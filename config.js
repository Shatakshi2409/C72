import * as firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyC56OXbL1ZGNSQt2DGw6_5gWPfKwPKj098",
    authDomain: "wily-56834.firebaseapp.com",
    databaseURL: "https://wily-56834.firebaseio.com",
    projectId: "wily-56834",
    storageBucket: "wily-56834.appspot.com",
    messagingSenderId: "590519556815",
    appId: "1:590519556815:web:21c9ec35ddae9d89e4f5ba"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()