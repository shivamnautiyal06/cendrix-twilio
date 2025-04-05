import { useEffect } from "react";
import { useCredentials } from "../context/CredentialsContext";

const Pages: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setCredentials, sid, authToken } = useCredentials();

  useEffect(() => {
    if (sid && authToken) {
      setCredentials(sid, authToken).catch((err) =>
        console.error("Pages couldn't set credentials", err),
      );
    }
  }, []);

  return <>{children}</>;
};

export default Pages;
