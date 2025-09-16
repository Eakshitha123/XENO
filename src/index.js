import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { AuthProvider } from "./AuthContext"; // <-- import AuthProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>  {/* <-- wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
