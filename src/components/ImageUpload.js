import * as React from "react";
import firebase from "firebase"
import shortid from 'shortid'
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// And import the necessary css
import "filepond/dist/filepond.min.css"
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// register the filepond plugins for additional functionality
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// make a reference to our firebase storage
const storage = firebase.storage().ref();



export default function ImageUpload({
    onRequestSave,
    onRequestClear,
    defaultFiles = [],
  }) {
    // use a useState hook to maintain our files collection
    const [files, setFiles] = React.useState(defaultFiles)

    const server = {
        // this uploads the image using firebase
        process: (fieldName, file, metadata, load, error, progress, abort) => {
          // create a unique id for the file
          const id = shortid.generate()
          // upload the image to firebase
          const task = storage.child('images/' + id).put(file, {
            contentType: 'image/jpeg',
          })
      
          // monitor the task to provide updates to FilePond
          task.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snap => {
              console.log("progress: %o", snap);
              progress(true, snap.bytesTransferred, snap.totalBytes);
            },
            err => {
              console.log("error: %o", err);
              error(err.message);
            },
            () => {
              console.log("DONE");
              load(id);
              onRequestSave(id);
            }
          )
        },
      
        // this loads an already uploaded image to firebase
        // load: (source, load, error, progress, abort) => {
        //   // reset our progress
        //   progress(true, 0, 1024)
      
          // fetch the download URL from firebase
          // storage
          //   .child('images/' + source)
          //   .getDownloadURL()
          //   .then(url => {
          //     console.log(url)
              // fetch the actual image using the download URL
              // and provide the blob to FilePond using the load callback
              // let xhr = new XMLHttpRequest()
              // xhr.responseType = 'blob'
              // xhr.onload = function(event) {
              //   let blob = xhr.response
              //   load(blob)
              // }
              // xhr.open('GET', url)
              // xhr.send()
        //     })
        //     .catch(err => {
        //       error(err.message)
        //       abort()
        //     })
        // },
       }
  
    return (
      <FilePond
        files={files}
        allowMultiple={false}
        maxFiles={1}
        onupdatefiles={fileItems => {
          if (fileItems.length === 0) {
            onRequestClear()
          }
  
          setFiles(fileItems.map(fileItem => fileItem.file))
        }}
        server={server} // todo: add custom server functionality using firebase
      />
    )
  }