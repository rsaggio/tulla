"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, Circle, FolderKanban } from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

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
            <BookOpen size={48} />
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

            return (
              <Card key={module._id}>
                <CardHeader>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Box>
                      <CardTitle>
                        Módulo {module.order}: {module.title}
                      </CardTitle>
                      <CardDescription sx={{ mt: 0.5 }}>
                        {module.description}
                      </CardDescription>
                    </Box>
                    <Badge label={module.estimatedHours + "h"} />
                  </Box>
                </CardHeader>
                <CardContent>
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
                          <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, "&:hover": { bgcolor: "action.hover" }, cursor: "pointer" }}>
                            {isCompleted ? <CheckCircle2 size={20} style={{ color: "green" }} /> : <Circle size={20} />}
                            <Box sx={{ flex: 1 }}>
                              <Typography fontWeight={500}>{lesson.order}. {lesson.title}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {lesson.type === "teoria" ? "Teoria" : lesson.type === "video" ? "Vídeo" : "Leitura"}
                              </Typography>
                            </Box>
                            <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                              {isCompleted ? "Revisar" : "Iniciar"}
                            </Button>
                          </Paper>
                        </Link>
                      );
                    })}

                    <Divider sx={{ my: 2 }} />

                    <Link href={"/aluno/projetos?module=" + module._id} style={{ textDecoration: "none" }}>
                      <Paper sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, bgcolor: "secondary.light", "&:hover": { opacity: 0.9 }, cursor: "pointer" }}>
                        <FolderKanban size={20} />
                        <Box sx={{ flex: 1 }}>
                          <Typography fontWeight={500}>Projeto do Módulo</Typography>
                          <Typography variant="body2" color="text.secondary">Complete todas as aulas para acessar</Typography>
                        </Box>
                        <Button size="sm" variant="secondary">Ver Projeto</Button>
                      </Paper>
                    </Link>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
      </Stack>
    </Stack>
  );
}
