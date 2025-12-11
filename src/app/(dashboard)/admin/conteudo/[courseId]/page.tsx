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
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FolderIcon from "@mui/icons-material/Folder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  lessons: any[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: number;
  prerequisites: string[];
  isActive: boolean;
  modules: Module[];
}

export default function CursoDetalhesPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadCourse() {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
      }
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
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

  if (!course) {
    return (
      <Box>
        <Card>
          <CardContent sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Curso não encontrado
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Link href="/admin/conteudo" passHref>
                <Button variant="outlined">
                  Voltar para Cursos
                </Button>
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/admin/conteudo" passHref>
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Typography variant="h3" fontWeight="bold">
                {course.title}
              </Typography>
              <Chip
                label={course.isActive ? "Ativo" : "Inativo"}
                color={course.isActive ? "primary" : "default"}
                size="small"
              />
            </Box>
            <Typography variant="body1" color="text.secondary">
              {course.description}
            </Typography>
          </Box>
        </Box>
        <Link href={`/admin/conteudo/${courseId}/editar`} passHref>
          <Button variant="contained" startIcon={<EditIcon />}>
            Editar Curso
          </Button>
        </Link>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Duração Total
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {course.duration}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <MenuBookIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Módulos
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {course.modules?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <FolderIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Aulas Totais
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {course.prerequisites && course.prerequisites.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Pré-requisitos
            </Typography>
            <Box component="ul" sx={{ listStyle: "disc", pl: 3, m: 0 }}>
              {course.prerequisites.map((prereq, index) => (
                <Typography component="li" key={index} variant="body2" sx={{ mb: 0.5 }}>
                  {prereq}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Módulos do Curso
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organize o conteúdo em módulos e aulas
              </Typography>
            </Box>
            <Box>
              <Link href={`/admin/conteudo/${courseId}/modulos/novo`} passHref>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Novo Módulo
                </Button>
              </Link>
            </Box>
          </Box>

          {!course.modules || course.modules.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <MenuBookIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Nenhum módulo criado ainda
              </Typography>
              <Link href={`/admin/conteudo/${courseId}/modulos/novo`} passHref>
                <Button variant="contained" startIcon={<AddIcon />} sx={{ mt: 2 }}>
                  Criar Primeiro Módulo
                </Button>
              </Link>
            </Box>
          ) : (
            <Stack spacing={2}>
              {course.modules
                .sort((a, b) => a.order - b.order)
                .map((module) => (
                  <Box
                    key={module._id}
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
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="body1" fontWeight="medium">
                          Módulo {module.order}: {module.title}
                        </Typography>
                        <Chip label={`${module.estimatedHours}h`} size="small" variant="outlined" />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {module.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {module.lessons?.length || 0} aulas
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Link href={`/admin/conteudo/${courseId}/modulos/${module._id}`} passHref>
                        <Button variant="outlined" size="small">
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Link href={`/admin/conteudo/${courseId}/modulos/${module._id}/editar`} passHref>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Link>
                    </Box>
                  </Box>
                ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
