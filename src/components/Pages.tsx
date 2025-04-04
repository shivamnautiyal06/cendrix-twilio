import { useEffect } from "react";
import { useCredentials } from "../context/CredentialsContext";

const Pages: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, setCredentials, isLoading } = useCredentials();

  useEffect(() => {
    const sid = localStorage.getItem("sid");
    const authToken = localStorage.getItem("authToken");

    if (!isAuthenticated && sid && authToken) {
      setCredentials(sid, authToken);
    }
  }, [isAuthenticated, setCredentials]); // Runs once on mount if not authenticated

  if (isLoading) return <p>Loading...</p>;

  return <>{children}</>;
};

export default Pages;
