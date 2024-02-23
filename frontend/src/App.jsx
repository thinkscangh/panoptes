import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import ThreatIntel from "./pages/ThreatIntel";
import Graphs from "./pages/Graphs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ProvenanceGraph from "./pages/ProvenanceGraph";
//import { blueGrey, red } from "@mui/material/colors"
import Detections from "./pages/Detections";
import IOCReport from "./pages/IOCReport";

const mainColor = "#000001";
const bgColor = "#111420";
const textColor = "#d0dfef";

const theme = createTheme({
  palette: {
    primary: {
      main: mainColor,
      light: textColor,
      contrastText: textColor,
      dark: bgColor,
    },
    secondary: {
      main: textColor,
    },
    background: {
      default: textColor,
    },
  },
  typography: {
    fontFamily: "Oswald",
    h4: {
      color: textColor,
    },
    h5: {
      color: textColor,
    },
    h6: {
      color: textColor,
    },
    p: {
      color: textColor,
    },
    body2: {
      color: textColor,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <ThreatIntel /> },
      { path: "/threatintel", element: <ThreatIntel /> },
      { path: "/detections", element: <Detections /> },
      { path: "/provenance", element: <ProvenanceGraph /> },
      { path: "/detection-report", element: <IOCReport /> },
      { path: "*", element: <div>404</div> },
    ],
  },
]);

// Create driver instance
// const driver = createDriver(
//   "neo4j",
//   "788517cc.databases.neo4j.io",
//   7687,
//   "neo4j",
//   "DhGsSD9gRT1taAcjK-cXZic88RF05aXN1q5q6uIhU6k"
// )

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
