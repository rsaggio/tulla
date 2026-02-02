"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth";
import {
  BookOpen,
  FolderKanban,
  User,
  Users,
  ClipboardCheck,
  BarChart3,
  LogOut,
  GraduationCap,
  Bot,
  School,
} from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";

const DRAWER_WIDTH = 256;

interface DashboardNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: "aluno" | "instrutor" | "admin";
  };
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function DashboardNav({ user, mobileOpen = false, onMobileClose }: DashboardNavProps) {
  const pathname = usePathname();

  const alunoNav = [
    { href: "/aluno", label: "Início", icon: GraduationCap },
    { href: "/aluno/curso", label: "Curso", icon: BookOpen },
    { href: "/aluno/projetos", label: "Projetos", icon: FolderKanban },
    { href: "/aluno/assistente", label: "Assistente Virtual", icon: Bot },
    { href: "/aluno/perfil", label: "Perfil", icon: User },
  ];

  const instrutorNav = [
    { href: "/instrutor", label: "Início", icon: GraduationCap },
    { href: "/instrutor/alunos", label: "Alunos", icon: Users },
    { href: "/instrutor/revisoes", label: "Revisões", icon: ClipboardCheck },
  ];

  const adminNav = [
    { href: "/admin", label: "Início", icon: GraduationCap },
    { href: "/admin/metricas", label: "Métricas", icon: BarChart3 },
    { href: "/admin/turmas", label: "Turmas", icon: School },
    { href: "/admin/usuarios", label: "Usuários", icon: Users },
    { href: "/admin/conteudo", label: "Conteúdo", icon: BookOpen },
  ];

  const navigation =
    user.role === "aluno"
      ? alunoNav
      : user.role === "instrutor"
      ? instrutorNav
      : adminNav;

  const getRoleColor = () => {
    if (user.role === "aluno") return "primary";
    if (user.role === "instrutor") return "secondary";
    return "error";
  };

  const navContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h5" fontWeight="bold">
          Bootcamp
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {user.name}
        </Typography>
        <Chip
          label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          color={getRoleColor() as any}
          size="small"
          sx={{ mt: 1 }}
        />
      </Box>

      <List sx={{ flex: 1, p: 2 }}>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                onClick={onMobileClose}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 500 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            fullWidth
            startIcon={<LogOut size={20} />}
            sx={{ justifyContent: "flex-start" }}
          >
            Sair
          </Button>
        </form>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: DRAWER_WIDTH,
          },
        }}
      >
        {navContent}
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          height: "100vh",
        }}
      >
        {navContent}
      </Box>
    </>
  );
}
