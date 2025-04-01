import * as React from "react";
import { Sheet } from "@mui/joy";

import MessagesPane from "./MessagesPane";
import ChatsPane from "./ChatsPane";
import NewMessagesPane from "./NewMessagePane";
import { useCredentials } from "../../context/CredentialsContext";
import { usePollingChats } from "../../hooks/usePollingChats";

export default function Messages() {
  const { isAuthenticated, apiClient, activePhoneNumber, setCredentials } =
    useCredentials();

  React.useEffect(() => {
    // This is needed until refactor to common parent component
    const sid = localStorage.getItem("sid");
    const authToken = localStorage.getItem("authToken");
    if (sid && authToken) {
      setCredentials(sid, authToken);
    }

    // Ask for notification permission
    // Weirdly, my mobile chrome doesn't have this obj and crashes without this guard
    // Not even Notification?.requestPermissions() works
    window.Notification?.requestPermission();
  }, []);

  const { chats, setChats, selectedChat, setSelectedChat } = usePollingChats();

  React.useEffect(() => {
    setSelectedChat(null);
  }, [activePhoneNumber]);

  if (!isAuthenticated) {
    return (
      <p>Please enter your Twilio credentials first in the Credentials tab.</p>
    );
  }

  const markChatAsRead = (chatId: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.chatId === chatId ? { ...chat, hasUnread: false } : chat,
      ),
    );
  };

  return (
    <Sheet
      sx={{
        flex: 1,
        width: "100%",
        mx: "auto",
        pt: { xs: "var(--Header-height)", md: 0 },
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "minmax(min-content, min(30%, 400px)) 1fr",
        },
      }}
    >
      <Sheet
        sx={{
          position: { xs: "fixed", sm: "sticky" },
          transform: {
            xs: "translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))",
            sm: "none",
          },
          transition: "transform 0.4s, width 0.4s",
          zIndex: 100,
          width: "100%",
          top: 52,
        }}
      >
        <ChatsPane
          activePhoneNumber={activePhoneNumber}
          chats={chats}
          selectedChatId={selectedChat?.chatId}
          setSelectedChat={(chat) => {
            setSelectedChat(chat);
            if (chat) {
              markChatAsRead(chat.chatId);
            }
          }}
        />
      </Sheet>
      {selectedChat ? (
        <MessagesPane
          chat={selectedChat}
          activePhoneNumber={activePhoneNumber}
        />
      ) : (
        <NewMessagesPane
          callback={async (contactNumber: string) => {
            try {
              const chatsData = await apiClient?.getChats(activePhoneNumber)!;
              const chat = chatsData.filter(
                (e) => e.contactNumber === contactNumber,
              )[0];
              setChats(chatsData);
              setSelectedChat(chat);
            } catch (error) {
              console.error("Failed to fetch chats:", error);
            }
          }}
          activePhoneNumber={activePhoneNumber}
        />
      )}
    </Sheet>
  );
}
