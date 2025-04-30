import { Box, Typography } from "@mui/joy";

import LlmKey from "./LlmKey";
import DecisionAgent from "./Agent";
import withLoggedIn from "../../context/withLoggedIn";

function Hitl() {
  return (
    <Box
      sx={{
        display: "flex",
        marginTop: 5,
        flexDirection: "column",
        p: 4,
        gap: 5,
        maxWidth: 500,
      }}
    >
      <Typography>
        Automatically flag messages for review based on your own rules.
      </Typography>

      <LlmKey />
      <DecisionAgent />
    </Box>
  );
}

export default withLoggedIn(Hitl);
