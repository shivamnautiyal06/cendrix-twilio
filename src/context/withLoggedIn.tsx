import React from "react";
import { Alert, Box, Button } from "@mui/joy";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const withLoggedIn = <P extends object>(
  Component: React.ComponentType<P>,
  area: string,
  inline = false,
) => {
  return (props: P) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return (
        <Box
          component="form"
          sx={{
            display: "flex",
            marginTop: inline ? "" : 20,
            flexDirection: "column",
            alignItems: "center",
            p: inline ? "" : 2,
            mx: inline ? "" : "auto",
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Alert
            variant="outlined"
            color="warning"
            sx={{ mb: 2, textAlign: "center" }}
          >
            To access {area}, you must first login to Poku.
          </Alert>
          <Button
            variant="solid"
            sx={{ width: "100%" }}
            component={Link}
            to="/account"
          >
            Go to Account Page
          </Button>
        </Box>
      );
    }

    return <Component {...props} />;
  };
};

export default withLoggedIn;
