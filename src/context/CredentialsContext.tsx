import React, { createContext, useContext, useState, ReactNode } from "react";
import ApiClient from "../api-client";
import { EventEmitter } from "../event-emitter";

interface CredentialsContextType {
  sid: string;
  authToken: string;
  apiClient: ApiClient | null;
  eventEmitter: EventEmitter | null;
  setCredentials: (sid: string, authToken: string) => Promise<boolean>;
  isAuthenticated: boolean;
  activePhoneNumber: string;
  phoneNumbers: string[];
  setActivePhoneNumberContext: (phoneNumber: string) => void;
  isLoading: boolean;
}

const CredentialsContext = createContext<CredentialsContextType | null>(null);

export const useCredentials = () => {
  const ctx = useContext(CredentialsContext);
  if (!ctx)
    throw new Error("useCredentials must be used within CredentialsProvider");
  return ctx;
};

export const useAuthedCreds = () => {
  const ctx = useCredentials();

  if (
    !ctx.isAuthenticated ||
    !ctx.apiClient ||
    !ctx.eventEmitter ||
    ctx.isLoading
  ) {
    throw new Error("useAuthedCreds used before auth is ready");
  }

  // Now TypeScript knows these are defined
  return {
    ...ctx,
    apiClient: ctx.apiClient,
    eventEmitter: ctx.eventEmitter,
  };
};

export const CredentialsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sid, setSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [apiClient, setApiClient] = useState<ApiClient | null>(null);
  const [eventEmitter, setEventEmitter] = useState<EventEmitter | null>(null);
  const [activePhoneNumber, setActivePhoneNumber] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setCredentials = async (sid: string, authToken: string) => {
    setIsLoading(true);
    let success = true;
    const client = ApiClient.getInstance(sid, authToken);
    try {
      setEventEmitter(EventEmitter.getInstance(client.axiosInstance));
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
        eventEmitter,
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
