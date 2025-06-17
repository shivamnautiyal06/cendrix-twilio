import { Typography, Stack, Table } from "@mui/joy";
import { displayDateTime } from "../../utils";

export default function CampaignsTable({ campaigns }: { campaigns: any[] }) {
  return (
    <Stack spacing={2}>
      <Typography level="h4" gutterBottom>
        Campaigns
      </Typography>

      {campaigns.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Created</th>
              <th>Name</th>
              <th>Status</th>
              <th>Queued</th>
              <th>Pending</th>
              <th>Failed</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((r) => (
              <tr key={r.id}>
                <td>{displayDateTime(new Date(r.createdTime))}</td>
                <td>{r.name}</td>
                <td>{r.status}</td>
                <td>
                  {r.queuedMessages}/{r.messageCount}
                </td>
                <td>
                  {r.pendingMessages}/{r.messageCount}
                </td>
                <td>
                  {r.failedMessages}/{r.messageCount}
                </td>
                <td>
                  {r.deliveredMessages}/{r.messageCount}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Stack>
  );
}
