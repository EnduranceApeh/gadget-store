// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAl276RzYFkf1H_vUt67tvrP04F2X0DyFs",
    authDomain: "gadget-store-6fba3.firebaseapp.com",
    projectId: "gadget-store-6fba3",
    storageBucket: "gadget-store-6fba3.firebasestorage.app",
    messagingSenderId: "76335394549",
    appId: "1:76335394549:web:ea94a1c604cfa773ce9fbc"
  };

  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  