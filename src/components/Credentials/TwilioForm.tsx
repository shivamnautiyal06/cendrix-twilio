import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Input, Button, Typography } from "@mui/joy";

import { useCredentials } from "../../context/CredentialsContext";

export default function TwilioForm() {
  const {
    setCredentials,
    isAuthenticated,
    sid: sidContext,
    authToken: authTokenContext,
    isLoading,
  } = useCredentials();
  const [sid, setSid] = React.useState(sidContext);
  const [authToken, setAuthToken] = React.useState(authTokenContext);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const credsValid = await setCredentials(sid, authToken);
    localStorage.setItem("sid", sid);
    localStorage.setItem("authToken", authToken);
    if (credsValid) {
      navigate("/");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        marginTop: 20,
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        mx: "auto",
        width: "100%",
        maxWidth: 400,
      }}
    >
      <Typography level="h4" sx={{ mb: 2, textAlign: "center" }}>
        Enter Twilio Credentials
      </Typography>
      <Alert
        variant="outlined"
        color="success"
        sx={{ mb: 2, width: "100%", textAlign: "center" }}
      >
        Your credentials are safe, they never leave this browser. <br />
        You can check the code!
      </Alert>

      <Input
        placeholder="Twilio SID"
        value={sid}
        onChange={(e) => setSid(e.target.value)}
        sx={{ mb: 2, width: "100%" }}
      />
      <Input
        placeholder="Auth Token"
        type="password"
        value={authToken}
        onChange={(e) => setAuthToken(e.target.value)}
        sx={{ mb: 2, width: "100%" }}
      />
      <Button type="submit" variant="solid" sx={{ width: "100%" }}>
        Submit
      </Button>
      {isAuthenticated && !isLoading && (
        <Alert variant="soft" color="success" sx={{ mt: 2, width: "100%" }}>
          Credentials successfully set!
        </Alert>
      )}
      {!isAuthenticated && !isLoading && (sidContext || authTokenContext) && (
        <Alert variant="soft" color="danger" sx={{ mt: 2, width: "100%" }}>
          Credentials incorrect!
        </Alert>
      )}
    </Box>
  );
}
