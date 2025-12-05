"use client";

import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  PlayCircle,
  Article,
  Quiz,
  Assignment,
  CheckCircle,
  RadioButtonUnchecked,
  Menu as MenuIcon,
  ArrowBack,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface Lesson {
  _id: string;
  title: string;
  type: "teoria" | "video" | "leitura" | "quiz" | "activity";
  duration?: number;
  order: number;
}

interface Module {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseSidebarProps {
  modules: Module[];
  currentLessonId?: string;
  completedLessons: string[];
  onLessonClick: (moduleId: string, lessonId: string) => void;
}

const DRAWER_WIDTH = 320;

const getLessonIcon = (type: string) => {
  switch (type) {
    case "video":
      return <PlayCircle />;
    case "quiz":
      return <Quiz />;
    case "activity":
      return <Assignment />;
    default:
      return <Article />;
  }
};

const getLessonTypeLabel = (type: string) => {
  switch (type) {
    case "video":
      return "Vídeo";
    case "quiz":
      return "Quiz";
    case "activity":
      return "Atividade";
    case "leitura":
      return "Leitura";
    default:
      return "Teoria";
  }
};

export default function CourseSidebar({
  modules,
  currentLessonId,
  completedLessons,
  onLessonClick,
}: CourseSidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => {
    // Abrir o módulo da aula atual por padrão
    const initial: Record<string, boolean> = {};
    modules.forEach((module) => {
      const hasCurrentLesson = module.lessons.some(
        (lesson) => lesson._id === currentLessonId
      );
      initial[module._id] = hasCurrentLesson;
    });
    return initial;
  });

  const handleToggleModule = (moduleId: string) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const handleLessonClick = (moduleId: string, lessonId: string) => {
    onLessonClick(moduleId, lessonId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Conteúdo do Curso
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflow: "auto", py: 0 }}>
        {/* Botão Voltar ao Dashboard */}
        <ListItemButton
          onClick={() => router.push("/aluno")}
          sx={{
            bgcolor: "grey.100",
            borderBottom: 1,
            borderColor: "divider",
            py: 1.5,
            "&:hover": {
              bgcolor: "grey.200",
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <ArrowBack />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="body2" fontWeight="medium">
                Voltar ao Dashboard
              </Typography>
            }
          />
        </ListItemButton>
        {modules.map((module, moduleIndex) => {
          const completedCount = module.lessons.filter((lesson) =>
            completedLessons.includes(lesson._id)
          ).length;
          const totalLessons = module.lessons.length;
          const isModuleComplete = completedCount === totalLessons;

          return (
            <React.Fragment key={module._id}>
              <ListItemButton
                onClick={() => handleToggleModule(module._id)}
                sx={{
                  bgcolor: "grey.50",
                  borderBottom: 1,
                  borderColor: "divider",
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Módulo {moduleIndex + 1}: {module.title}
                      </Typography>
                      {isModuleComplete && (
                        <CheckCircle
                          sx={{ fontSize: 18, color: "success.main" }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {completedCount}/{totalLessons} aulas concluídas
                    </Typography>
                  }
                />
                {openModules[module._id] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={openModules[module._id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {module.lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson, lessonIndex) => {
                      const isCompleted = completedLessons.includes(lesson._id);
                      const isCurrent = lesson._id === currentLessonId;

                      return (
                        <ListItem
                          key={lesson._id}
                          disablePadding
                          sx={{
                            borderLeft: isCurrent ? 3 : 0,
                            borderColor: "primary.main",
                            bgcolor: isCurrent ? "primary.50" : "transparent",
                          }}
                        >
                          <ListItemButton
                            onClick={() =>
                              handleLessonClick(module._id, lesson._id)
                            }
                            sx={{
                              pl: 4,
                              "&:hover": {
                                bgcolor: "grey.100",
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {isCompleted ? (
                                <CheckCircle
                                  sx={{ color: "success.main", fontSize: 20 }}
                                />
                              ) : (
                                <RadioButtonUnchecked
                                  sx={{ color: "grey.400", fontSize: 20 }}
                                />
                              )}
                            </ListItemIcon>

                            <ListItemText
                              primary={
                                <Typography
                                  variant="body2"
                                  fontWeight={isCurrent ? "bold" : "normal"}
                                  color={isCurrent ? "primary" : "text.primary"}
                                >
                                  {lessonIndex + 1}. {lesson.title}
                                </Typography>
                              }
                              secondary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mt: 0.5,
                                  }}
                                >
                                  <Chip
                                    icon={getLessonIcon(lesson.type)}
                                    label={getLessonTypeLabel(lesson.type)}
                                    size="small"
                                    sx={{ height: 20, fontSize: "0.7rem" }}
                                  />
                                  {lesson.duration && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {lesson.duration} min
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300 }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {drawer}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          position: "relative",
          height: "100%",
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}
