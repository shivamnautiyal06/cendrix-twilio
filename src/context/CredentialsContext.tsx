import React, { createContext, useContext, useState, ReactNode } from "react";
import ApiClient from "../api-client";

interface CredentialsContextType {
  sid: string;
  authToken: string;
  apiClient: ApiClient | null;
  setCredentials: (sid: string, authToken: string) => Promise<boolean>;
  isAuthenticated: boolean;
  activePhoneNumber: string;
  phoneNumbers: string[];
  setActivePhoneNumberContext: (phoneNumbers: string) => void;
}

const CredentialsContext = createContext<CredentialsContextType>({
  sid: "",
  authToken: "",
  apiClient: null,
  setCredentials: async () => true,
  isAuthenticated: false,
  activePhoneNumber: "",
  phoneNumbers: [],
  setActivePhoneNumberContext: () => {},
});

export const useCredentials = () => useContext(CredentialsContext);

export const CredentialsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sid, setSid] = useState<string>("");
  const [authToken, setAuthToken] = useState<string>("");
  const [apiClient, setApiClient] = useState<ApiClient | null>(null);
  const [activePhoneNumber, setActivePhoneNumber] = useState<string>("");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setCredentials = async (sid: string, authToken: string) => {
    const client = new ApiClient(sid, authToken);
    try {
      setSid(sid);
      setAuthToken(authToken);
      await client.getPhoneNumbers();
      setApiClient(client);
      const phoneNumbers = await client.getPhoneNumbers();
      setPhoneNumbers(phoneNumbers);
      setActivePhoneNumber(phoneNumbers[0]);
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
      return false;
    }

    return true;
  };

  const setActivePhoneNumberContext = (phoneNumber: string) => {
    setActivePhoneNumber(phoneNumber);
  };

  return (
    <CredentialsContext.Provider
      value={{
        sid,
        authToken,
        apiClient,
        setCredentials,
        isAuthenticated,
        activePhoneNumber,
        phoneNumbers,
        setActivePhoneNumberContext,
      }}
    >
      {children}
    </CredentialsContext.Provider>
  );
};
