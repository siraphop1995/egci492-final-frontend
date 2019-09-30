import firebase from 'firebase/app';

var firebaseConfig = {
  apiKey: "AIzaSyDVm5UR92mCitQxZIIqwmAXbfexY31Jtz4",
  authDomain: "egci427final.firebaseapp.com",
  databaseURL: "https://egci427final.firebaseio.com",
  projectId: "egci427final",
  storageBucket: "gs://egci427final.appspot.com",
  messagingSenderId: "649964735354",
  appId: "1:649964735354:web:9ee258c1462454fd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// const firestorage = firebase.storage()
// export {
//   // firestorage,
//   auth
// }