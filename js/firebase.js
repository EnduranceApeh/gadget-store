  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

 export {auth, db}
  