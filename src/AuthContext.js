import React, { createContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store logged-in user info
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/success", {
          credentials: "include", // important to send cookies
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user); // set user if logged in
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
