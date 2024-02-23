import { Box, Button, Container, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import options from "../appsettings.json";

const getRandomDate = (days) => {
  const today = new Date();
  const randomTimestamp = Math.random() * 7 * 24 * 60 * 60 * 1000; // Random timestamp within the last 7 days
  const timestamp = today.getTime() - randomTimestamp;
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
};

const Detections = () => {
  const navigate = useNavigate();
  const navigationPressed = (page) => {
    console.log(page);
    navigate("/" + page.toLowerCase().replaceAll(" ", ""));
  };

  const [rows, setRows] = useState([]);
  const client = axios.create({
    baseURL: options.DetectionsBaseUrl,
    withCredentials: false,
  });

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "timestamp", headerName: "Timestamp", width: 150 },
    { field: "details", headerName: "Details", width: 100 },
    { field: "system", headerName: "System", width: 120 },
    { field: "source", headerName: "Source", width: 150 },
    { field: "alert_level", headerName: "Alert Level", width: 120 },
    //{ field: "conclusion", headerName: "Conclusion", width: 150 },"source"
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "viewDetails",
      headerName: "",
      width: 150,
      renderCell: () => (
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => navigationPressed("detection-report")}
        >
          View Report
        </Button>
      ),
    },
  ];

  useEffect(() => {
    let ignore = false;
    //setRows([]);
    client
      .get(options.DetectionsEndpoint)
      .then((response) => {
        if (!ignore) {
          setRows(response.data?.rows);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <Container sx={{ paddingBottom: "1rem" }}>
      <Box marginTop="1rem">
        <Typography variant="h5">Detections</Typography>
      </Box>
      <Box marginTop="1rem">
        <DataGrid rows={rows} columns={columns}></DataGrid>
      </Box>
    </Container>
  );
};

export default Detections;
