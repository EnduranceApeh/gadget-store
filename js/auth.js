// Sign Up Function
function signUp(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("User signed up:", userCredential.user.uid);
      })
      .catch((error) => {
        console.error("Error signing up:", error.message);
      });
  }
  
  // Login Function
  function login(email, password) {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user.uid);
      })
      .catch((error) => {
        console.error("Error logging in:", error.message);
      });
  }
  