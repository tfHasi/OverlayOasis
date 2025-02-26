import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file for styling

const Navbar: React.FC = () => {
  const { user, logout, login } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to the homepage after logout
  };

  const handleLogin = () => {
    login();
  };

  return (
    <div className="navbar-container">
      {/* Site Name on the Left */}
      <div className="navbar-brand" onClick={() => navigate("/")}>
        OverlayOasis
      </div>

      {/* Right Side: Login/Logout and Profile Picture */}
      <div className="navbar-right">
        {user ? (
          // Display Profile Picture and Logout Button
          <div className="user-profile">
            <img
              src={user.picture}
              alt="Profile"
              className="profile-picture"
            />
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          // Display Login Button on Homepage
          location.pathname === "/" && (
            <button onClick={handleLogin} className="login-button">
              Login with Google
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Navbar;