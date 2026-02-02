"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Menu } from "lucide-react";
import DashboardNav from "@/components/shared/DashboardNav";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
  };
}

export default function DashboardLayoutClient({
  children,
  user,
}: DashboardLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      <DashboardNav
        user={user}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "grey.50",
          overflow: "hidden",
        }}
      >
        {/* Mobile Top Bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            display: { xs: "flex", md: "none" },
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: "text.primary" }}
            >
              <Menu size={24} />
            </IconButton>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Bootcamp
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: { xs: 1.5, sm: 3, md: 4 },
          }}
        >
          <Container maxWidth="xl">{children}</Container>
        </Box>
      </Box>
    </Box>
  );
}
