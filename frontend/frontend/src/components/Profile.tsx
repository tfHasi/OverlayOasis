import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { user, setUser, logout } = useContext(AuthContext)!;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse query parameters from the URL
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const id = searchParams.get("id");
    const picture = searchParams.get("picture");
    const verified_email = searchParams.get("verified_email") === "true";

    if (email && id && picture) {
      // Set the user in the AuthContext
      setUser({
        email,
        id,
        picture,
        verified_email,
      });

      // Store the user in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({ email, id, picture, verified_email })
      );

      // Clear the query parameters from the URL
      navigate("/profile", { replace: true });
    }
  }, [location, navigate, setUser]);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to the homepage after logout
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Profile</h1>
      <div style={{ marginBottom: "20px" }}>
        <img
          src={user.picture}
          alt="Profile"
          style={{ width: "100px", borderRadius: "50%" }}
        />
        <h2>{user.email}</h2>
        <p>Email Verified: {user.verified_email ? "Yes" : "No"}</p>
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#DB4437",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;