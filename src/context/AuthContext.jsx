import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // undefined = still initializing, null = not logged in, object = logged in
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userProfile, setUserProfile] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          setUserProfile(snap.exists() ? snap.data() : null);
        } catch {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  // Only render children once Firebase auth state is resolved
  // Both must leave `undefined` before showing children
  const ready = currentUser !== undefined && userProfile !== undefined;

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, logout }}>
      {ready ? children : null}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
