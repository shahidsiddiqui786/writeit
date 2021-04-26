import firebase from "firebase"


const appconfig = {
  apiKey: "AIzaSyAJDJew_-WhY_kOHlStF7U-ydRtlRMjkhE",
  authDomain: "auth-demo-production-16587.firebaseapp.com",
  databaseURL: "https://auth-demo-production-16587.firebaseio.com",
  projectId: "auth-demo-production-16587",
  storageBucket: "auth-demo-production-16587.appspot.com",
  messagingSenderId: "292437340124",
  appId: "1:292437340124:web:f747ceb6c1d25632c36919"
};

// const app = firebase.initializeApp({
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID
// })

firebase.initializeApp(appconfig)

export default firebase
