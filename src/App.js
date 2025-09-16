import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignHistory from "./pages/CampaignHistory";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container">
          <header>
            <h1>CRM</h1>
            <nav>
              <Link to="/create">Create Campaign</Link>
              <Link to="/history">Campaign History</Link>
            </nav>
          </header>
          <main>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected routes */}
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CampaignCreate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <CampaignHistory />
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes */}
              <Route path="*" element={<LoginPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
