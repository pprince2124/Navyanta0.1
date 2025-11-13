import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import axios from "axios";
import { AppContext } from "../../context/AppContext";

const AdminNotificationLogs = () => {
  const { backendUrl, statusColors, formatDateTime, formatCurrency } = useContext(AppContext);

  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    channel: "",
    event: "",
    from: "",
    to: "",
  });
  const [summary, setSummary] = useState({ count: 0, totalCostInr: 0 });
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    const params = {};
    if (filters.channel) params.channel = filters.channel;
    if (filters.event) params.event = filters.event;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;

    const { data } = await axios.get(`${backendUrl}/api/notify/logs`, { params });
    setLogs(data.logs);
    setSummary({ count: data.count, totalCostInr: data.totalCostInr });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", color: "text.primary" }}>
      <Typography variant="h5" gutterBottom>
        Notification Logs
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Select
          value={filters.channel}
          onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
          displayEmpty
        >
          <MenuItem value="">All Channels</MenuItem>
          <MenuItem value="SMS">SMS</MenuItem>
          <MenuItem value="WhatsApp">WhatsApp</MenuItem>
          <MenuItem value="Email">Email</MenuItem>
        </Select>

        <Select
          value={filters.event}
          onChange={(e) => setFilters({ ...filters, event: e.target.value })}
          displayEmpty
        >
          <MenuItem value="">All Events</MenuItem>
          <MenuItem value="OTP">OTP</MenuItem>
          <MenuItem value="VISIT_APPROVED">Visit Approved</MenuItem>
          <MenuItem value="QUOTATION_READY">Quotation Ready</MenuItem>
          <MenuItem value="PROJECT_COMPLETED">Project Completed</MenuItem>
        </Select>

        <TextField
          type="date"
          value={filters.from}
          onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          label="From"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          value={filters.to}
          onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          label="To"
          InputLabelProps={{ shrink: true }}
        />

        <Button variant="contained" onClick={fetchLogs}>
          Apply Filters
        </Button>
      </Box>

      {/* Summary */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Total Logs: {summary.count} | Total Cost: {formatCurrency(summary.totalCostInr)}
      </Typography>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Channel</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.userId}</TableCell>
                <TableCell>{log.channel}</TableCell>
                <TableCell>{log.event}</TableCell>
                <TableCell>
                  <Chip
                    label={log.status}
                    color={statusColors[log.status] || "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatCurrency(log.appliedCostInr)}</TableCell>
                <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedLog(log)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for log details */}
      <Dialog open={!!selectedLog} onClose={() => setSelectedLog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box sx={{ mt: 2 }}>
              <Typography><strong>User:</strong> {selectedLog.userId}</Typography>
              <Typography><strong>Channel:</strong> {selectedLog.channel}</Typography>
              <Typography><strong>Event:</strong> {selectedLog.event}</Typography>
              <Typography><strong>Status:</strong> {selectedLog.status}</Typography>
              <Typography><strong>Cost:</strong> {formatCurrency(selectedLog.appliedCostInr)}</Typography>
              <Typography><strong>Provider ID:</strong> {selectedLog.providerMessageId}</Typography>
              <Typography><strong>Error:</strong> {selectedLog.error || "None"}</Typography>
              <Typography><strong>Payload:</strong> {JSON.stringify(selectedLog.payload)}</Typography>
              <Typography><strong>Created At:</strong> {formatDateTime(selectedLog.createdAt)}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminNotificationLogs;