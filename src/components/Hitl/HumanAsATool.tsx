import { useEffect, useState } from "react";
import { Button, Typography, Input, Stack, Select, Option } from "@mui/joy";
import { apiClient } from "../../api-client";
import { useCredentials } from "../../context/CredentialsContext";

export default function HumanAsATool() {
  const { phoneNumbers, whatsappNumbers, sid, authToken } = useCredentials();
  const [humanNumber, setHumanNumber] = useState("");
  const [agentNumber, setAgentNumber] = useState("");
  const [waitTime, setWaitTime] = useState<number>(60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.getAccount();
        if (res.data) {
          setHumanNumber(res.data.humanNumber || "");
          setAgentNumber(res.data.agentNumber || "");
          setWaitTime(res.data.waitTime || 60);
        }

        const twilioCredsExist = await apiClient.checkTwilioCredsExist();
        if (twilioCredsExist.data.hasKey) {
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [phoneNumbers]);

  const handleSave = async () => {
    await apiClient.saveAccount(humanNumber, agentNumber, waitTime);
    await apiClient.createTwilioKey(sid, authToken);
  };

  return (
    <Stack spacing={1}>
      <Typography level="h4">Human in the Loop</Typography>

      <Typography>Agent number:</Typography>
      {(phoneNumbers.length || whatsappNumbers.length) > 0 && (
        <Select
          placeholder="Choose a number"
          value={agentNumber || ""}
          onChange={(_event, newPhoneNumber) => setAgentNumber(newPhoneNumber!)}
        >
          {phoneNumbers.concat(whatsappNumbers).map((e) => (
            <Option key={e} value={e}>
              {e}
            </Option>
          ))}
        </Select>
      )}

      <Typography>Human number:</Typography>
      <Input
        value={humanNumber}
        onChange={(e) => setHumanNumber(e.target.value || "")}
        placeholder="+12223334444"
      />

      <Input
        type="number"
        value={waitTime}
        onChange={(e) => setWaitTime(+e.target.value)}
      />

      <Button
        onClick={handleSave}
        disabled={!humanNumber || !agentNumber || !sid || !authToken}
      >
        Save
      </Button>
    </Stack>
  );
}
