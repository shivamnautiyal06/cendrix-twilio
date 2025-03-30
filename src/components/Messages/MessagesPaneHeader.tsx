import { Avatar, IconButton, Stack, Typography } from "@mui/joy";
import { ArrowBackIosNewRounded } from "@mui/icons-material";

import { toggleMessagesPane } from "../../utils";

type MessagesPaneHeaderProps = {
  contactNumber: string;
};

export default function MessagesPaneHeader(props: MessagesPaneHeaderProps) {
  const { contactNumber } = props;
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
          <ArrowBackIosNewRounded />
        </IconButton>
        <Avatar size="lg" />
        <div>
          <Typography
            component="h2"
            noWrap
            sx={{ fontWeight: "lg", fontSize: "lg" }}
          >
            {contactNumber}
          </Typography>
        </div>
      </Stack>
    </Stack>
  );
}
