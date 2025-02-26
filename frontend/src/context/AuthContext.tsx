import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  email: string;
  id: string;
  picture: string;
  verified_email: boolean;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = () => {
    axios.get<{ auth_url: string }>("http://localhost:5000/login", { withCredentials: true })
      .then(response => {
        window.location.href = response.data.auth_url; // Redirect to Google OAuth
      })
      .catch(error => {
        console.error("Login failed:", error);
      });
  };

  const logout = () => {
    axios.get("http://localhost:5000/logout", { withCredentials: true })
      .then(() => {
        setUser(null);
        localStorage.removeItem("user");
        window.location.href = "/"; // Redirect to home page after logout
      })
      .catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};