import { useState, useEffect } from 'react';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Popup from './components/Popup';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuthError("");
    } catch (error) {
      setAuthError((error as any).message);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAuthError("");
    } catch (error) {
      setAuthError((error as any).message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
        {isSignUp ? (
          <SignUp
            onSignUp={handleSignUp}
            onSwitchToSignIn={() => { setIsSignUp(false); setAuthError(""); }}
            signUpError={authError}
          />
        ) : (
          <SignIn
            onSignIn={handleSignIn}
            onSwitchToSignUp={() => { setIsSignUp(true); setAuthError(""); }}
            signInError={authError}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <Popup 
        userId={userId}
        onLogout={() => {
          signOut(auth)
            .then(() => setUserId(null))
            .catch((err) => console.error("Logout failed", err));
        }} 
      />
    </div>
  );
}

export default App;
