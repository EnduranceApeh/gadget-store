import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Sign Up Function
async function saveUserToFirestore(user) {
  try{
    const userRef = doc(collection(db, "users"), user.uid);
    await setDoc(userRef, {
      email: user.email,
      createdAt: serverTimestamp()
    });
    console.log("user saved to firestore")
  } catch(error) {
    console.log(error)
  }
}

async function signUp() {
  const email = document.getElementById("signup-email").value
  const password = document.getElementById("signup-password").value

  try{
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("user signedup")

    await saveUserToFirestore(user)
  } catch (error) {
    console.error("Error signing up: ", error.message);
  }
}
  
  // Login Function
  async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

      try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log("User loggin successfully", userCredential.user.uid)

       
      } catch (error) {
        console.error("Error loggin in:", error.message)
      }
  }
  
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

loginBtn.addEventListener("click", () => login())
signupBtn.addEventListener("click", () => signUp())