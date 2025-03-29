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
  isLoading: boolean;
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
  isLoading: false,
});

export const useCredentials = () => useContext(CredentialsContext);

export const CredentialsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sid, setSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [apiClient, setApiClient] = useState<ApiClient | null>(null);
  const [activePhoneNumber, setActivePhoneNumber] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setCredentials = async (sid: string, authToken: string) => {
    setIsLoading(true);
    let success = true;
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
      success = false;
    }

    setIsLoading(false);
    return success;
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
        isLoading,
      }}
    >
      {children}
    </CredentialsContext.Provider>
  );
};
