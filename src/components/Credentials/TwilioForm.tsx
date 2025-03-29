import * as React from "react";
import Box from "@mui/joy/Box";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

import { useCredentials } from "../../context/CredentialsContext";
import { Alert } from "@mui/joy";

export default function TwilioForm() {
  const {
    setCredentials,
    isAuthenticated,
    sid: sidContext,
    authToken: authTokenContext,
  } = useCredentials();
  const [sid, setSid] = React.useState(
    () => localStorage.getItem("sid") || sidContext,
  );
  const [authToken, setAuthToken] = React.useState(
    () => localStorage.getItem("authToken") || authTokenContext,
  );

  React.useEffect(() => {
    if (sid && authToken) {
      setCredentials(sid, authToken);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const credsValid = await setCredentials(sid, authToken);
      if (credsValid) {
        localStorage.setItem("sid", sid);
        localStorage.setItem("authToken", authToken);
      }
    } catch (err) {

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
      {isAuthenticated && (
        <Alert variant="soft" color="success" sx={{ mt: 2, width: "100%" }}>
          Credentials successfully set!
        </Alert>
      )}
      {(!isAuthenticated && (sidContext || authTokenContext)) && (
        <Alert variant="soft" color="danger" sx={{ mt: 2, width: "100%" }}>
          Credentials incorrect!
        </Alert>
      )}
    </Box>
  );
}
