"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import BookOpenIcon from "@mui/icons-material/MenuBook";
import LockIcon from "@mui/icons-material/Lock";

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  type: string;
  order: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  modules: Module[];
}

export default function AlunoCursoPage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
    loadProgress();
  }, []);

  async function loadCourse() {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const courses = await res.json();
        if (courses.length > 0) {
          const courseId = courses[0]._id;
          const detailRes = await fetch("/api/courses/" + courseId);
          if (detailRes.ok) {
            const data = await detailRes.json();
            setCourse(data);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProgress() {
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        if (data.progress) {
          setCompletedLessons(data.progress.completedLessons.map((l: any) => l._id || l));
        }
      }
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
            <BookOpenIcon sx={{ fontSize: 48, color: "text.secondary" }} />
            <Typography variant="h6">Nenhum curso disponível</Typography>
            <Typography variant="body2" color="text.secondary">
              Entre em contato com o suporte
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercentage = totalLessons > 0
    ? Math.round((completedLessons.length / totalLessons) * 100)
    : 0;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" fontWeight="bold">{course.title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          {course.description}
        </Typography>
      </Box>

      <Paper sx={{ p: 2, bgcolor: "action.selected" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">Progresso Geral</Typography>
            <Typography variant="h4" fontWeight="bold">{progressPercentage}%</Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">Aulas Completas</Typography>
            <Typography variant="h4" fontWeight="bold">
              {completedLessons.length} / {totalLessons}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Stack spacing={3}>
        {course.modules
          .sort((a, b) => a.order - b.order)
          .map((module) => {
            const moduleLessons = module.lessons || [];
            const completedInModule = moduleLessons.filter((l) =>
              completedLessons.includes(l._id)
            ).length;
            const isModuleComplete = completedInModule === moduleLessons.length && moduleLessons.length > 0;

            return (
              <Card key={module._id}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        Módulo {module.order}: {module.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {module.description}
                      </Typography>
                    </Box>
                    <Chip label={module.estimatedHours + "h"} size="small" />
                  </Box>

                  <Stack spacing={1}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Progresso do Módulo</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {completedInModule} / {moduleLessons.length} aulas
                      </Typography>
                    </Box>

                    {moduleLessons.sort((a, b) => a.order - b.order).map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson._id);

                      return (
                        <Link key={lesson._id} href={"/aluno/aula/" + lesson._id} style={{ textDecoration: "none" }}>
                          <Paper
                            sx={{
                              p: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              "&:hover": { bgcolor: "action.hover" },
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            {isCompleted ? (
                              <CheckCircleIcon sx={{ color: "primary.main" }} />
                            ) : (
                              <CircleOutlinedIcon sx={{ color: "text.secondary" }} />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography fontWeight={500}>{lesson.order}. {lesson.title}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {lesson.type === "teoria" ? "Teoria" :
                                 lesson.type === "video" ? "Vídeo" :
                                 lesson.type === "quiz" ? "Quiz" :
                                 lesson.type === "activity" ? "Exercício Prático" :
                                 "Leitura"}
                              </Typography>
                            </Box>
                            <Button
                              size="small"
                              variant={isCompleted ? "outlined" : "contained"}
                            >
                              {isCompleted ? "Revisar" : "Iniciar"}
                            </Button>
                          </Paper>
                        </Link>
                      );
                    })}

                    <Divider sx={{ my: 2 }} />

                    {isModuleComplete ? (
                      <Link href={"/aluno/projetos?module=" + module._id} style={{ textDecoration: "none" }}>
                        <Paper
                          sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            "&:hover": { bgcolor: "primary.dark" },
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          <FolderIcon />
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight={500}>Projeto do Módulo</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Complete o projeto para finalizar o módulo
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            sx={{
                              color: "inherit",
                              borderColor: "currentColor",
                              "&:hover": { borderColor: "currentColor", bgcolor: "rgba(255,255,255,0.1)" }
                            }}
                          >
                            Ver Projeto
                          </Button>
                        </Paper>
                      </Link>
                    ) : (
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          bgcolor: "action.disabledBackground",
                          cursor: "not-allowed",
                          opacity: 0.7
                        }}
                      >
                        <LockIcon sx={{ color: "text.secondary" }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={500} color="text.secondary">
                            Projeto do Módulo
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Complete todas as aulas para desbloquear
                          </Typography>
                        </Box>
                        <Chip label="Bloqueado" size="small" />
                      </Paper>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
      </Stack>
    </Stack>
  );
}
