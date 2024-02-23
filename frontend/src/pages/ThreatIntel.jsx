import {
  Box,
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
import eclecticiqLogo from "../assets/eclecticiq_logo.svg";
import picusLogo from "../assets/picus_logo.svg";
import mandiantLogo from "../assets/mandiant_logo.png";
import xLogo from "../assets/X-Logo.png";
import options from "../appsettings.json";

const ThreatIntel = () => {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryError, setSearchQueryError] = useState("");

  const [neoViz, setNeoViz] = useState(null);

  const [config, setConfig] = useState({});

  // neoViz Configure and Initialize
  const prepareNeoViz = () => {
    let conf = {
      containerId: "viz",
      neo4j: {
        serverUrl: options.ThreatIntel.url,
        serverUser: options.ThreatIntel.user,
        serverPassword: options.ThreatIntel.password,
        driverConfig: {
          encrypted: "ENCRYPTION_ON",
          trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES",
        },
      },
      visConfig: {
        // nodes: {
        //   shape: "circle",
        //  },
        // configure: {
        //   enabled: true,
        //   filter: "edges",
        //   container: undefined,
        //   showButton: true,
        // },
        nodes: {
          shape: "circle",
          widthConstraint: {
            minimum: 70,
            maximum: 200,
          },
          // shadow: {
          //   enabled: true,
          // },
          mass: 1.5,
        },
        edges: {
          arrows: {
            to: { enabled: true, scaleFactor: 1.5 },
          },
          length: 200,
        },
      },
      labels: {
        ACTOR: {
          label: "name",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
          },
        },
        MALWARE: {
          label: "name",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
          },
        },
        PROCESS: {
          label: "name",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
          },
        },
        VULNERABILITY: {
          label: "name",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
          },
        },
        FILE: {
          label: "name",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
          },
        },
        REGISTRY: {
          label: "name",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
          },
        },
        HOST: {
          label: "name",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
          },
        },
        IP: {
          label: "name",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
          },
        },
      },
      relationships: {
        CONNECTED_TO: {
          label: "relationship",
          [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
              title: NeoVis.objectToTitleHtml,
            },
          },
        },
      },
      initialCypher: "MATCH p=()-[r:CONNECTED_TO]->() RETURN p,r;",
    };
    setNeoViz(new NeoVis(conf));
    setConfig(conf);
  };

  // Add Event on Node Click
  useEffect(() => {
    neoViz?.registerOnEvent("clickNode", (e) => {
      // e: { nodeId: number; node: Node }
      console.info(e.node.raw);
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
    //neoViz?.reinit();
    // let newConfig = {
    //   ...config,
    //   initialCypher: "MATCH p=(:MALWARE)-[:CONNECTED_TO]->() RETURN p;",
    // };
    //neoViz?.reinit(newConfig);
    neoViz.reload();
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
        <Typography variant="h5">Threat Intelligence</Typography>
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
          height: "500px",
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
      <Box>
        <Typography variant="h6" marginY="1rem">
          Threat Intelligence Sources
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Source
              title="Picus Security"
              description="Picus Security provides granular and actionable insights for operational and executive teams and helps build proactive capabilities."
              logo={picusLogo}
              imageFilters="invert(100%) sepia(5%) saturate(0%) hue-rotate(314deg) brightness(105%) contrast(105%)"
              imgWidth="35%"
              isEnabled={true}
              extraStyles={{
                height: "8rem",
                paddingBottom: "0.8rem",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box paddingBottom="3rem">
              <Source
                title="EclecticIQ"
                description="EclecticIQ is a global provider of threat intelligence technology and services, it is a leading European cybersecurity vendor operating worldwide."
                logo={eclecticiqLogo}
                imageFilters="invert(100%) sepia(5%) saturate(0%) hue-rotate(314deg) brightness(105%) contrast(105%)"
                imgWidth="50%"
                extraStyles={{
                  height: "8rem",
                  paddingBottom: "0.8rem",
                }}
                isEnabled={false}
                enablePopulate={true}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Source
              title="Mandiant Security"
              description="Mandiant is recognized by enterprises, governments and law enforcement agencies worldwide as the market leader in threat intelligence and expertise gained on the frontlines of cyber security."
              logo={mandiantLogo}
              imageFilters="invert(100%) sepia(5%) saturate(0%) hue-rotate(314deg) brightness(105%) contrast(105%)"
              imgWidth="45%"
              extraStyles={{
                height: "8rem",
                paddingBottom: "0.8rem",
              }}
              isEnabled={false}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Source
              title="X (Twitter)"
              description="X (Twitter) is very important in cybersecurity threat intelligence due to its real-time nature, the platform facilitates collaboration among cybersecurity professionals, enabling swift sharing of insights, analysis, and mitigation strategies."
              logo={xLogo}
              imageFilters="invert(100%) sepia(5%) saturate(0%) hue-rotate(314deg) brightness(105%) contrast(105%)"
              imgWidth="18%"
              extraStyles={{
                height: "8rem",
                paddingBottom: "0.8rem",
              }}
              isEnabled={false}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ThreatIntel;

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
