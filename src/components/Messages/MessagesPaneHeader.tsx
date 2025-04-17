import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  IconButton,
  Link,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/joy";
import {
  ArrowBackIosNewRounded,
  CloseRounded,
  InfoOutlined,
} from "@mui/icons-material";

import { DOCS_LINK, toggleMessagesPane } from "../../utils";
import { useAuthedCreds } from "../../context/CredentialsContext";

import type { ChatInfo } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

type MessagesPaneHeaderProps = {
  chat: ChatInfo;
};

export default function MessagesPaneHeader(props: MessagesPaneHeaderProps) {
  const { chat } = props;
  const [isInfoShown, setIsInfoShown] = useState(false);
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.body",
      }}
    >
      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack
            direction="row"
            sx={{ alignItems: "center" }}
            spacing={{ xs: 1, md: 2 }}
          >
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
              onClick={() => toggleMessagesPane()}
            >
              <ArrowBackIosNewRounded />
            </IconButton>
            <Avatar size="lg" />
            <Typography
              component="h2"
              noWrap
              sx={{ fontWeight: "lg", fontSize: "lg" }}
            >
              {chat.contactNumber}
            </Typography>
          </Stack>
          <Toggle
            chat={chat}
            isInfoShown={isInfoShown}
            setIsInfoShown={setIsInfoShown}
          />
        </Stack>

        {isInfoShown && (
          <Box
            sx={{
              pt: 1,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                maxWidth: "100%", // optional safeguard
              }}
            >
              <Alert
                variant="soft"
                color="neutral"
                endDecorator={
                  <IconButton
                    variant="soft"
                    color="neutral"
                    onClick={() => setIsInfoShown(false)}
                  >
                    <CloseRounded />
                  </IconButton>
                }
              >
                <Typography color="neutral">
                  Use this to tell your agent whether to respond to this chat or not.{" "}
                  <br />
                  Must be{" "}
                  <Link
                    component="button"
                    onClick={() => {
                      navigate("/account");
                    }}
                  >
                    logged in
                  </Link>{" "}
                  to use.
                  <br />
                  Learn more in our{" "}
                  <Link
                    href={DOCS_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    docs
                  </Link>.
                </Typography>
              </Alert>
            </Box>
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

type ToggleProps = {
  chat: ChatInfo;
  isInfoShown: boolean;
  setIsInfoShown: (val: boolean) => void;
};

function Toggle({ chat, isInfoShown, setIsInfoShown }: ToggleProps) {
  const { twilioClient } = useAuthedCreds();
  const [switchValue, setSwitchValue] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    twilioClient
      .getToggle(chat.chatId)
      .then((res) => {
        setSwitchValue(res.data.isEnabled);
      })
      .catch((err) => console.error(err));
  }, [chat]);

  return (
    <Stack spacing={1} direction="row">
      <Tooltip title="Use this to tell your agent whether to respond to this chat or not.">
        <Switch
          checked={switchValue}
          onChange={(e) => {
            if (!isAuthenticated) {
              setIsInfoShown(true);
              return;
            }

            const isChecked = e.target.checked;
            twilioClient
              .setToggle(chat.chatId, isChecked)
              .then(() => {
                setSwitchValue(isChecked);
              })
              .catch((err) => console.error(err));
          }}
        />
      </Tooltip>
      <IconButton onClick={() => setIsInfoShown(!isInfoShown)}>
        <InfoOutlined />
      </IconButton>
    </Stack>
  );
}
