import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { IconButton, Input, Select, Option } from "@mui/joy";
import List from "@mui/joy/List";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChatListItem from "./ChatListItem";
import { toggleMessagesPane } from "../../utils";
import { useCredentials } from "../../context/CredentialsContext";
import { useState } from "react";
import type { ChatInfo } from "../../types";

type ChatsPaneProps = {
  activePhoneNumber: string;
  chats: ChatInfo[];
  setSelectedChat: (chat: ChatInfo | null) => void;
  selectedChatId: string | undefined;
};

export default function ChatsPane(props: ChatsPaneProps) {
  const { chats, setSelectedChat, selectedChatId, activePhoneNumber } = props;
  const { phoneNumbers, setActivePhoneNumberContext } = useCredentials();
  const [contactsFilter, setContactsFilter] = useState("");
  
  return (
    <Sheet
      sx={{
        borderRight: "1px solid",
        borderColor: "divider",
        height: { sm: "calc(100dvh - var(--Header-height))", md: "100dvh" },
        overflowY: "auto",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          pb: 1.5,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "md", md: "lg" },
            fontWeight: "lg",
            mr: "auto",
            display: { xs: "none", sm: "unset" }
          }}
        >
          Messages
        </Typography>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          onClick={() => {
            setSelectedChat(null);
            if (window.innerWidth < 600) { // Approximate `xs` breakpoint
              toggleMessagesPane();
            }
          }}
        >
          <EditNoteRoundedIcon />
        </IconButton>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => {
            toggleMessagesPane();
          }}
          sx={{ display: { sm: "none" } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Stack sx={{ px: 2, pb: 1.5 }} spacing={1}>
        <Select
          value={activePhoneNumber}
          onChange={(_event, newPhoneNumber) =>
            setActivePhoneNumberContext(newPhoneNumber!)
          }
        >
          {phoneNumbers.map((e) => {
            return (
              <Option key={e} value={e}>
                {e}
              </Option> // Ensure each Option has a unique key and correct display value
            );
          })}
        </Select>
        <Input
          onChange={(event) => {
            setContactsFilter(event.target.value);
          }}
          value={contactsFilter}
          startDecorator={<SearchRoundedIcon />}
          placeholder="Filter contacts"
          endDecorator={
            <IconButton size="sm" onClick={() => setContactsFilter("")}>
              <CloseRoundedIcon />
            </IconButton>
          }
        />
      </Stack>
      <List
        sx={{
          py: 0,
          "--ListItem-paddingY": "0.75rem",
          "--ListItem-paddingX": "1rem",
        }}
      >
        {chats
          .filter((e) => e.contactNumber.includes(contactsFilter))
          .map((chat) => (
            <ChatListItem
              key={chat.chatId}
              chat={chat}
              setSelectedChat={setSelectedChat}
              selectedChatId={selectedChatId}
            />
          ))}
      </List>
    </Sheet>
  );
}
