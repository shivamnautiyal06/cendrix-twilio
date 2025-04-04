import { useEffect } from "react";
import { useCredentials } from "../context/CredentialsContext";

const Pages: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, setCredentials } = useCredentials();

  useEffect(() => {
    const sid = localStorage.getItem("sid");
    const authToken = localStorage.getItem("authToken");

    if (!isAuthenticated && sid && authToken) {
      setCredentials(sid, authToken)
      .catch(err => console.error("Pages couldn't set credentials", err));
    }
  }, [isAuthenticated, setCredentials]); // Runs once on mount if not authenticated

  return <>{children}</>;
};

export default Pages;
