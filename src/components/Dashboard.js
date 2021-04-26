import React, { useState, useRef, useEffect } from "react"
import { Form, Card, Button, Alert, ListGroup, ListGroupItem, Image } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import firebase from "../firebase"
import ImageUpload from './ImageUpload'



export default function Dashboard() {
  const [error, setError] = useState("")
  const [editmode,setEditmode] = useState(false)
  const { currentUser, logout } = useAuth()
  const history = useHistory()

  const nameRef = useRef()
  const usernameRef = useRef()
  const bioRef = useRef()
  
  const [nameD,setNameD] = useState('')
  const [usernameD,setUsernameD] = useState('')
  const [bioD,setBioD] = useState('')
  const [folr,setFolr] = useState(0)
  const [folg,setFolg] = useState(0)
  const [posts,setPosts] = useState(0)
  const [image, setImage] = useState()
  const [imageUrl, setImageUrl] = useState()
  
  // a refernce to current user
  const userId = firebase.auth().currentUser.uid
  
  useEffect(() => {
      read()
  }, [])


  function updateUserData(username, name, bio) {

    var nodeRef = firebase.database().ref('users/' + userId);
    nodeRef.once('value', (snapshot) => {
      const data = snapshot.val();
      console.log(image)
        firebase.database().ref('users/'+userId).set({
          username:username,
          name: name,
          email:data.email,
          profile_picture : image,
          bio:bio,
          folg:data.folg,
          folr:data.folr,
          posts:data.posts
        },(error) => {
          if(error) setError("Failed to update")
          else setError("Data Updated SuccessFully!")
        })
      })
  }

  function read(){
    var starCountRef = firebase.database().ref('users/' + userId);
    starCountRef.once('value', (snapshot) => {
      const data = snapshot.val();
    
      if(data !== undefined && data !== null){
        setNameD(data.name)
        setUsernameD(data.username)
        setBioD(data.bio)
        setImage(data.profile_picture)
        setFolr(data.folr.length-1)
        setFolg(data.folg.length-1)
        setPosts(data.posts.length-1)

        firebase.storage().ref().child("images/" + data.profile_picture)
        .getDownloadURL()
        .then((url) => {
          setImageUrl(url);
          setError(null);
        })
        .catch((error) => {
              switch (error.code) {
                case 'storage/object-not-found':
                  console.log("File doesn't exist")
                  setError("File doesn't exist")
                  break;
                case 'storage/unauthorized':
                  console.log("User doesn't have permission to access the object")
                  setError("User doesn't have permission to access the object")
                  break;
                case 'storage/canceled':
                  console.log("User canceled the upload")
                  setError("User canceled the upload")
                  break;
                case 'storage/unknown':
                  console.log("Unknown error occurred, inspect the server response")
                  setError("Unknown error occurred, inspect the server response")
                  break;
             }
        })
      } 
   })
  }


  const Imgstyle = {
    height:'25vh'
  }

  const ImgWrap = {
    display: 'flex',
    justifyContent : 'center'
  }


  function handleSave(e) {
    e.preventDefault()
    setError("")
    updateUserData(usernameRef.current.value,nameRef.current.value,bioRef.current.value)
    setUsernameD(usernameRef.current.value)
    setNameD(nameRef.current.value)
    setBioD(bioRef.current.value)
    setEditmode(false)
  }

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <div style={{maxWidth:'100%',width:'600px'}}>
      { !editmode ?
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <div style={ImgWrap}>
             <Image style={Imgstyle} src={imageUrl} roundedCircle />
          </div> 

          <ListGroup>
            <ListGroupItem><strong>Name:&nbsp;&nbsp; </strong> {nameD}</ListGroupItem>
            <ListGroupItem><strong>Username:&nbsp; </strong> {usernameD}</ListGroupItem>
            <ListGroupItem><strong>Email:&nbsp;&nbsp; </strong> {currentUser.email}</ListGroupItem>
            <ListGroupItem><strong>Bio:&nbsp;&nbsp;&nbsp; </strong> {bioD}</ListGroupItem>
            <ListGroupItem><strong>Follower:&nbsp; </strong>{folr}</ListGroupItem>
            <ListGroupItem><strong>Following:&nbsp; </strong> {folg}</ListGroupItem>
            <ListGroupItem><strong>Posts:&nbsp;&nbsp; </strong> {posts}</ListGroupItem>
          </ListGroup> 

          <Button onClick={(e) => setEditmode(true)} className="btn btn-primary w-100 mt-3">
            Edit Profile
          </Button>
        </Card.Body>
      </Card>
      :
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <ImageUpload
              onRequestSave={id => {if(id !== undefined && id!== null){setImage(id)}}}
              onRequestClear={() => setImage(null)}
              defaultFiles={
                image
                  ? [
                      {
                        source: image,
                        options: {
                          type: "local"
                        }
                      }
                    ]
                  : []
              }
            />

          <Form onSubmit={(e) => handleSave(e)}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control defaultValue ={nameD} type="name" ref={nameRef} required/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control defaultValue = {usernameD} type="name" ref={usernameRef} required/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Bio</Form.Label>
              <Form.Control defaultValue ={bioD} type="name" ref={bioRef} required/>
            </Form.Group>

            <Button type="submit" className="btn btn-primary w-100 mt-3">
              Save Profile
            </Button>

          </Form>
        </Card.Body>
      </Card> }


      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>

    </div>
  )
}
