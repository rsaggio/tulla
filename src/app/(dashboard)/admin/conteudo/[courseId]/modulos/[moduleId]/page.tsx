"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface Lesson {
  _id: string;
  title: string;
  type: string;
  order: number;
  content?: string;
}

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  courseId: string;
  lessons: Lesson[];
}

export default function ModuloDetalhesPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const { courseId, moduleId } = use(params);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadModule() {
    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons`);
      if (res.ok) {
        const lessons = await res.json();
        const moduleRes = await fetch(`/api/courses/${courseId}/modules/${moduleId}`);
        if (moduleRes.ok) {
          const moduleData = await moduleRes.json();
          setModule({ ...moduleData, lessons });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar módulo:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!module) {
    return (
      <Box sx={{ maxWidth: 800 }}>
        <Card>
          <CardContent sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Módulo não encontrado
            </Typography>
            <Link href={`/admin/conteudo/${courseId}`} passHref>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Voltar ao Curso
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href={`/admin/conteudo/${courseId}`} passHref>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Box>
            <Typography variant="h3" fontWeight="bold">
              Módulo {module.order}: {module.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {module.description}
            </Typography>
          </Box>
        </Box>
        <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/editar`} passHref>
          <Button variant="contained" startIcon={<EditIcon />}>
            Editar Módulo
          </Button>
        </Link>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Horas Estimadas
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {module.estimatedHours}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <MenuBookIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Total de Aulas
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {module.lessons?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Aulas do Módulo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Gerencie o conteúdo das aulas
              </Typography>
            </Box>
            <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/aulas/nova`} passHref>
              <Button variant="contained" startIcon={<AddIcon />}>
                Nova Aula
              </Button>
            </Link>
          </Box>

          {!module.lessons || module.lessons.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <MenuBookIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Nenhuma aula criada ainda
              </Typography>
              <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/aulas/nova`} passHref>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                  Criar Primeira Aula
                </Button>
              </Link>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {module.lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                  <Box
                    key={lesson._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="body1" fontWeight="medium">
                          {lesson.order}. {lesson.title}
                        </Typography>
                        <Chip
                          label={
                            lesson.type === "teoria"
                              ? "Teoria"
                              : lesson.type === "video"
                              ? "Vídeo"
                              : "Leitura"
                          }
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {lesson.content
                          ? `${lesson.content.length} caracteres`
                          : "Sem conteúdo"}
                      </Typography>
                    </Box>
                    <Link
                      href={`/admin/conteudo/${courseId}/modulos/${moduleId}/aulas/${lesson._id}/editar`}
                      passHref
                    >
                      <Button variant="text" size="small" startIcon={<EditIcon />}>
                        Editar
                      </Button>
                    </Link>
                  </Box>
                ))}
            </Box>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Projetos do Módulo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Projetos práticos para os alunos
              </Typography>
            </Box>
            <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/projetos/novo`} passHref>
              <Button variant="outlined" startIcon={<AddIcon />}>
                Novo Projeto
              </Button>
            </Link>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 6 }}>
            Projetos serão exibidos aqui
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
