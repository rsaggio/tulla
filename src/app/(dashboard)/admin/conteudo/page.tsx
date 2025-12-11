"use client";

import { useState, useEffect } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
  modules: any[];
  createdAt: string;
}

export default function AdminConteudoPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCourse(id: string) {
    if (!confirm("Tem certeza que deseja deletar este curso? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadCourses();
      }
    } catch (error) {
      console.error("Erro ao deletar curso:", error);
      alert("Erro ao deletar curso");
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Gestão de Conteúdo
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Gerencie cursos, módulos, aulas e projetos
          </Typography>
        </Box>
        <Link href="/admin/conteudo/novo" passHref>
          <Button variant="contained" startIcon={<AddIcon />}>
            Novo Curso
          </Button>
        </Link>
      </Box>

      {courses.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
              <MenuBookIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Nenhum curso criado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comece criando seu primeiro curso
              </Typography>
              <Link href="/admin/conteudo/novo" passHref>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Criar Primeiro Curso
                </Button>
              </Link>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} lg={4} key={course._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    boxShadow: 6,
                  },
                  transition: "box-shadow 0.3s",
                }}
              >
                <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 0, mr: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {course.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {course.description}
                      </Typography>
                    </Box>
                    <Chip
                      label={course.isActive ? "Ativo" : "Inativo"}
                      color={course.isActive ? "primary" : "default"}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Duração:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {course.duration}h
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Módulos:
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {course.modules?.length || 0}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Link href={`/admin/conteudo/${course._id}`} passHref>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            fullWidth
                          >
                            Editar
                          </Button>
                        </Link>
                      </Box>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteCourse(course._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
