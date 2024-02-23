import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import NeoVis from "neovis.js/dist/neovis.js";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Source from "../components/Source";
import crowdstrikeLogo from "../assets/crowdstrike.svg";
import awsLogo from "../assets/Amazon_Web_Services_Logo.svg";
import LoopIcon from "@mui/icons-material/Loop";
import PauseIcon from "@mui/icons-material/Pause";
import azureLogo from "../assets/Microsoft_Azure-Logo.svg";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import options from "../appsettings.json";

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "type", headerName: "Type", width: 150 },
  { field: "details", headerName: "Details", width: 200 },
  { field: "system", headerName: "System", width: 120 },
  {
    field: "vtreport",
    headerName: "VT Report",
    width: 170,
    renderCell: (v) => (
      <Typography variant="body2">
        <Link
          href={v.value}
          target="_blank"
          underline="hover"
          color="inherit"
          variant="inherit"
        >
          {v.value}
        </Link>
      </Typography>
    ),
  },
];

const IOCReport = () => {
  const theme = useTheme();
  const [neoViz, setNeoViz] = useState(null);

  // setup the state
  const [rows, setRows] = useState([]);
  const [report, setReport] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const client = axios.create({
    baseURL: options.DetectionBaseUrl,
    withCredentials: false,
  });

  useEffect(() => {
    let ignore = false;
    //setRows([]);
    client
      .get(options.DetectionEndpoint)
      .then((response) => {
        if (!ignore) {
          setIsLoaded(true);
          setReport(response?.data);
          setRows(response?.data?.iocs);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // neoViz Configure and Initialize
  const prepareNeoViz = () => {
    const config = {
      containerId: "viz",
      neo4j: {
        serverUrl:
          "neo4j://ec2-18-193-111-68.eu-central-1.compute.amazonaws.com:7687",
        serverUser: "neo4j",
        serverPassword: "password",
      },
      visConfig: {
        physics: {
          enabled: true,
          stabilization: {
            enabled: true,
            iterations: 1000,
            updateInterval: 100,
            onlyDynamicEdges: false,
            fit: true,
          },
          maxVelocity: 2,
        },
        nodes: {
          shape: "ellipse",
          mass: 1.5,
          font: {
            color: "black",
            strokeWidth: 0,
          },
        },
        edges: {
          arrows: {
            to: { enabled: true, scaleFactor: 0.4 },
          },
          length: 200,
        },
      },
      labels: {
        File: {
          label: "path",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
            static: {
              color: "#F79767",
              font: {
                color: "white",
              },
            },
          },
        },
        Process: {
          label: "exec",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
            static: {
              color: "red",
              font: {
                color: "white",
              },
            },
          },
        },
        Socket: {
          label: "dst_ip",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
          },
          static: {
            color: "#57C7E3",
            font: {
              color: "black",
            },
          },
        },
      },
      relationships: {
        EVENT_WRITE: {
          //value: "relationship",
          // [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
          //   function: {
          //     title: NeoVis.objectToTitleHtml,
          //     // title: (details) => {
          //     //   let temp = new Date(0);
          //     //   temp.setMilliseconds(
          //     //     details.properties.timestamp.substring(0, 13)
          //     //   );
          //     //   return `${
          //     //     temp.getMonth() + 1
          //     //   }/${temp.getDate()} ${temp.getHours()}:${temp.getMinutes()}:${temp.getSeconds()}:${temp.getMilliseconds()}`;
          //     //},
          //   },
          // },
        },
      },
      initialCypher: report.query,
    };
    setNeoViz(new NeoVis(config));
  };

  // Add Event on Node Click
  useEffect(() => {
    neoViz?.registerOnEvent("clickNode", (e) => {
      // e: { nodeId: number; node: Node }
      console.info(e.node.raw.properties);
    });
    neoViz?.render();
  }, [neoViz]);

  const handleReload = () => {
    neoViz?.reload();
  };

  const handleStabilize = () => {
    neoViz?.stabilize();
  };

  // Prepare the graph
  useEffect(() => {
    if (isLoaded) {
      prepareNeoViz();
    }
  }, [isLoaded]);

  return (
    <Container sx={{ paddingBottom: "1rem" }}>
      <Box marginTop="1.3rem">
        <Typography variant="h5">Detection Report</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Grid item xs={12}>
            <Box
              marginY="1.3rem"
              sx={{
                height: "300px",
                width: "100%",
                border: "1px solid lightblue",
                borderRadius: "0.3rem",
                backgroundColor: theme.palette.primary.light,
              }}
            >
              <div id="viz" style={{ height: "100%", width: "100%" }}></div>
              <IconButton
                sx={{
                  position: "relative",
                  float: "right",
                  color: theme.palette.primary.light,
                }}
                onClick={handleStabilize}
              >
                <PauseIcon />
              </IconButton>
              <IconButton
                sx={{
                  position: "relative",
                  float: "right",
                  color: theme.palette.primary.light,
                }}
                onClick={handleReload}
              >
                <LoopIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box marginTop="1.5rem">
              <Typography variant="h6">Indicators Of Compromise</Typography>
            </Box>
            <Box marginTop="0.4rem">
              <DataGrid rows={rows} columns={columns}></DataGrid>
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Box
            marginTop="1.3rem"
            sx={{
              height: "600px",
              width: "100%",
              border: "1px solid lightblue",
              borderRadius: "0.3rem",
              padding: "1rem",
              paddingBottom: "1.5rem",
            }}
          >
            <Box>
              <Typography variant="h5" marginBottom="1rem">
                Summary
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">{report?.summary}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default IOCReport;
