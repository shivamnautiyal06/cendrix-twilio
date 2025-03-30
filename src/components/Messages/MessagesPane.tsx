import { Box, Sheet, Stack, Avatar } from "@mui/joy";

import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import MessagesPaneHeader from "./MessagesPaneHeader";
import { useCredentials } from "../../context/CredentialsContext";
import { usePollingMessages } from "../../hooks/usePollingMessages";

import type { ChatInfo } from "../../types";

type MessagesPaneProps = {
  chat: ChatInfo;
  activePhoneNumber: string;
};

export default function MessagesPane(props: MessagesPaneProps) {
  const { chat, activePhoneNumber } = props;
  const { apiClient } = useCredentials();
  const { chatMessages, setChatMessages } = usePollingMessages(chat);

  return (
    <Sheet
      sx={{
        height: { xs: "calc(100dvh - var(--Header-height))", md: "100dvh" },
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.level1",
      }}
    >
      <MessagesPaneHeader contactNumber={chat.contactNumber} />
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: "scroll",
          flexDirection: "column-reverse",
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: "flex-end" }}>
          {chatMessages.map((message, index) => {
            const isYou = message.direction === "sent";
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                sx={{ flexDirection: isYou ? "row-reverse" : "row" }}
              >
                {!isYou && <Avatar />}
                <ChatBubble {...message} />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        onSubmit={async (content) => {
          await apiClient?.sendMessage(
            activePhoneNumber,
            chat.contactNumber,
            content,
          );
          setChatMessages([
            ...chatMessages,
            {
              content: content,
              direction: "sent",
              from: activePhoneNumber,
              to: chat.contactNumber,
              id: new Date().getTime().toString(),
              status: "delivered",
              timestamp: new Date().getTime(),
            },
          ]);
        }}
      />
    </Sheet>
  );
}
