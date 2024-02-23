import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import NavBar from "../components/global/NavBar";

const MainLayout = () => {
  return (
    <Box bgcolor="#111420" sx={{ minHeight: "100vh" }}>
      <NavBar />
      <Outlet />
    </Box>
  );
};

export default MainLayout;
