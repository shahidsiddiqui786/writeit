import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import firebase from "../firebase"

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const { signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()


  async function handleSubmit(e) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      const userId = firebase.auth().currentUser.uid
      const em = emailRef.current.value
      writeUserData(userId,em.substring(0,em.indexOf('@')),em.substring(0,em.indexOf('@')),em,'zXriHVXNs',[''],[''],[''],'I love quoting')
      history.push("/profile")
    } catch(err) {
      setError(err.message)
    }

    setLoading(false)
  }

  function writeUserData(userId,username, name, email, imageUrl,posts,folr,folg,bio) {
    firebase.database().ref('users/'+userId).set({
      username:username,
      name: name,
      email: email,
      profile_picture : imageUrl,
      posts:posts,
      folr:folr,
      folg:folg,
      bio:bio
    })
  }
  

  return (
    <div style={{maxWidth:'100%',width:'400px'}}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} required />
            </Form.Group>
           
            <Button disabled={loading} className="w-100" type="submit">
              Sign Up
            </Button>
          </Form>
            
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  )
}
