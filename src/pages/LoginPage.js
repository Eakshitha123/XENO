import React from "react";

function LoginPage() {
  const handleLogin = () => {
    // Redirect user to backend Google OAuth
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <button onClick={handleLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Login with Google
      </button>
    </div>
  );
}

export default LoginPage;
