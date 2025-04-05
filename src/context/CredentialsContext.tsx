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

  return {
    ...ctx,
    apiClient: ctx.apiClient,
    eventEmitter: ctx.eventEmitter,
  };
};

export const CredentialsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sid, setSid] = useState(localStorage.getItem("sid") || "");
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || "",
  );
  const [apiClient, setApiClient] = useState<ApiClient | null>(null);
  const [eventEmitter, setEventEmitter] = useState<EventEmitter | null>(null);
  const [activePhoneNumber, setActivePhoneNumber] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setCredentials = async (sid: string, authToken: string) => {
    let success = false;
    if (!sid || !authToken) return success;
    setIsLoading(true);
    try {
      const client = await ApiClient.getInstance(sid, authToken);
      const numbers = await client.getPhoneNumbers();
      const ee = await EventEmitter.getInstance(client.axiosInstance);
      setEventEmitter(ee);
      setSid(sid);
      setAuthToken(authToken);
      setApiClient(client);
      setPhoneNumbers(numbers);
      setActivePhoneNumber(numbers[0]);
      setIsAuthenticated(true);
      success = true;
    } catch (err) {
      setIsAuthenticated(false);
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
