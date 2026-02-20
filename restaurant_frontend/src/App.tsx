import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack, Box } from "@mui/material";

import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import MesasPage from "../pages/MesasPage";
import OrdenesPage from "../pages/OrdenesPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Restaurante
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/acerca">
              Acerca de
            </Button>
            <Button color="inherit" component={Link} to="/mesas">
              Mesas
            </Button>
            <Button color="inherit" component={Link} to="/ordenes">
              Órdenes
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1, width: "100%", minHeight: "calc(100vh - 64px)" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/acerca" element={<AboutPage />} />
          <Route path="/mesas" element={<MesasPage />} />
          <Route path="/ordenes" element={<OrdenesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
