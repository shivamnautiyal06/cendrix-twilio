import * as React from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import MessageInput from "./MessageInput";

import { useCredentials } from "../../context/CredentialsContext";
import NewMessagePaneHeader from "./NewMessagePaneHeader";

export default function NewMessagesPane(props: {
  activePhoneNumber: string;
  callback: (contactNumber: string) => void;
}) {
  const { activePhoneNumber, callback } = props;
  const [contactNumber, setContactNumber] = React.useState("");
  const { apiClient } = useCredentials();

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", md: "100dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      <NewMessagePaneHeader setContactNumber={setContactNumber} />
      <Box sx={{ mt: "auto" }}>
        <MessageInput
          onSubmit={async (content) => {
            if (!apiClient) {
              return;
            }
            await apiClient.sendMessage(
              activePhoneNumber,
              contactNumber,
              content,
            );
            callback(contactNumber);
          }}
        />
      </Box>
    </Sheet>
  );
}
