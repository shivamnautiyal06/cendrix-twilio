import * as React from "react";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import { toggleMessagesPane } from "../../utils";
import Input from "@mui/joy/Input";
import { Divider } from "@mui/joy";

type MessagesPaneHeaderProps = {
  setContactNumber: (contactNumber: string) => void;
};

export default function NewMessagePaneHeader(props: MessagesPaneHeaderProps) {
  const { setContactNumber } = props;
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
      <Stack
        direction="row"
        spacing={{ xs: 1, md: 2 }}
        sx={{ alignItems: "center" }}
      >
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ display: { xs: "inline-flex", sm: "none" } }}
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Input
          placeholder="+12223334444"
          onChange={(e) => setContactNumber(e.target.value)}
          startDecorator={
            <React.Fragment>
              <Typography sx={{ pr: 1.5 }}>To:</Typography>
              <Divider orientation="vertical" />
            </React.Fragment>
          }
        />
      </Stack>
    </Stack>
  );
}
