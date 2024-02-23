import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
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

const ProvenanceGraph = () => {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryError, setSearchQueryError] = useState("");

  const [neoViz, setNeoViz] = useState(null);

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
          maxVelocity: 5,
        },
        nodes: {
          shape: "ellipse",
          widthConstraint: {
            minimum: 50,
            maximum: 200,
          },
          mass: 3,
          font: {
            color: "black",
            strokeWidth: 0,
          },
        },
        edges: {
          arrows: {
            to: { enabled: true, scaleFactor: 0.6 },
            //middle: { enabled: true, scaleFactor: 1.5 },
            //to: { enabled: true, scaleFactor: 1.5 },
          },
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
              color: "#C990C0",
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
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_ACCEPT: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_CLOSE: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_CONNECT: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_CREATE_OBJECT: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_EXECUTE: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_FCNTL: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_LINK: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_LSEEK: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_MMAP: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_MODIFY_FILE_ATTRIBUTES: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_OPEN: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_READ: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_RECVFROM: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_RECVMSG: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_RENAME: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_SENDTO: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_TRUNCATE: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
        EVENT_UNLINK: {
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              //title: NeoVis.objectToTitleHtml,
            },
          },
        },
      },

      initialCypher: "MATCH p=()-->() RETURN p LIMIT 1000;",
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

  // Handle Cypher Search
  const handleCypherSearchPressed = (e) => {
    e.preventDefault();
    try {
      setSearchQueryError("");
      neoViz.renderWithCypher(searchQuery);
    } catch (error) {
      setSearchQueryError(error);
    }
  };

  // Draw the graph
  const draw = () => {
    neoViz.render();
  };

  const handleReload = () => {
    neoViz?.reload();
  };

  const handleStabilize = () => {
    neoViz?.stabilize();
  };

  // Prepare the graph
  useEffect(() => {
    prepareNeoViz();
  }, []);

  return (
    <Container sx={{ paddingBottom: "1rem" }}>
      <Box marginY="1.3rem">
        <Typography variant="h5">Provenance Graph</Typography>
      </Box>
      {/* <Box marginY="1.3rem">
        <Button
          onClick={draw}
          color="secondary"
          variant="outlined"
          sx={{ marginRight: "0.3rem" }}
        >
          Draw
        </Button>
        <Button
          onClick={() => {
            neoViz.stabilize();
          }}
          color="secondary"
          variant="outlined"
        >
          Stabilize
        </Button>
      </Box> */}

      <Box sx={{ marginY: "1rem" }}>
        <TextField
          id="search-bar"
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          value={searchQuery}
          label="Enter query"
          variant="outlined"
          size="small"
          sx={{
            width: "80%",
            color: "white",
          }}
          //inputProps={{ color: "white" }}
          //color="primary"
          InputProps={{
            color: "secondary",
            sx: { color: "white" },
          }}
          color="secondary"
          focused
        />
        <IconButton
          type="submit"
          aria-label="search"
          onClick={handleCypherSearchPressed}
        >
          <SearchIcon style={{ fill: "white" }} />
        </IconButton>
      </Box>
      <Box
        marginY="1.3rem"
        sx={{
          height: "600px",
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
      <Box>
        {searchQueryError ? (
          <Typography color="lightcoral">
            {searchQueryError?.message}
          </Typography>
        ) : null}
      </Box>
    </Container>
  );
};

export default ProvenanceGraph;

/*
visConfig: {
        nodes: {
          shape: "ellipse",
          color: "red",
        },
        edges: { length: 100, arrows: { to: { enabled: false } } },
        physics: {
          hierarchicalRepulsion: { avoidOverlap: 1 },
          solver: "repulsion",
          repulsion: { nodeDistance: 1000 },
        },
        layout: {
          improvedLayout: true,
          randomSeed: 420,
          hierarchical: {
            enabled: true,
            direction: "DU",
            sortMethod: "directed",
            nodeSpacing: 1000,
            treeSpacing: 20,
            levelSeparation: 250,
          },
        },
      },
      */
