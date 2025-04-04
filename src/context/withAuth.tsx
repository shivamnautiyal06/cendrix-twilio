import React from "react";
import { useCredentials } from "../context/CredentialsContext";

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useCredentials();

    if (isLoading) return <p>Loading...</p>;
    if (!isAuthenticated) return <p>Please log in first.</p>;

    return <Component {...props} />;
  };
};

export default withAuth;
