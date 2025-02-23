import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const HomePage: React.FC = () => {
  const { login } = useContext(AuthContext)!;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to OverlayOasis</h1>
      <p>Please log in to continue.</p>
      <button
        onClick={login}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Login with Google
      </button>
    </div>
  );
};

export default HomePage;