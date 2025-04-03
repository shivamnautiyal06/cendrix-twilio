import React, { useState } from "react";
import { Box, IconButton } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

export default function Banner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "var(--joy-palette-warning-200)",
        padding: "5px 10px", // Adjusted padding for a thinner appearance
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed", // Fixes the banner to the top
        zIndex: 99999, // Ensures the banner is above other content
      }}
    >
      <span>
        <a
          href="https://join.slack.com/t/pokulabs/shared_invite/zt-334pmqhy9-oZN8cMAXLFUdmDCgNZX9rA"
          target="_blank"
        >
          Join our Slack
        </a>{" "}
        and leave feedback or request a feature. I shall do your bidding!
      </span>
      <IconButton
        onClick={() => setVisible(false)}
        sx={{
          position: "absolute", // Positions the button absolutely
          right: 10, // Positions the button 10px from the right
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
