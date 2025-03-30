import * as React from "react";
import {
  Box,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  Stack,
  Typography,
  Avatar,
} from "@mui/joy";
import { Circle } from "@mui/icons-material";

import { displayDateTime, toggleMessagesPane } from "../../utils";

import type { ChatInfo } from "../../types";

type ChatListItemProps = ListItemButtonProps & {
  chat: ChatInfo;
  selectedChatId?: string;
  setSelectedChat: (chat: ChatInfo) => void;
};

export default function ChatListItem(props: ChatListItemProps) {
  const { chat, selectedChatId, setSelectedChat } = props;
  const selected = selectedChatId === chat.chatId;
  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            setSelectedChat(chat);
          }}
          selected={selected}
          color="neutral"
          sx={{ flexDirection: "column", alignItems: "initial", gap: 1 }}
        >
          <Stack direction="row" spacing={1.5}>
            <Avatar />
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm" sx={{ alignItems: "center" }}>
                {chat.contactNumber}
              </Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: "right" }}>
              {chat.hasUnread && (
                <Circle sx={{ fontSize: 12 }} color="primary" />
              )}
              <Typography
                level="body-xs"
                noWrap
                sx={{ display: { xs: "none", md: "block" } }}
              >
                {displayDateTime(chat.recentMsgDate)}
              </Typography>
            </Box>
          </Stack>
          <Typography
            level="body-sm"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: "1",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {chat.recentMsgContent}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
}
