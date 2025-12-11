"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: number;
  prerequisites: string[];
  isActive: boolean;
}

export default function EditarCursoPage({ params }: { params: Promise<{ courseId: string }> }) {
  const router = useRouter();
  const { courseId } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      } else {
        setError("Curso não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
      setError("Erro ao carregar curso");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const courseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      duration: parseInt(formData.get("duration") as string),
      prerequisites: (formData.get("prerequisites") as string)
        .split("\n")
        .filter((p) => p.trim()),
      isActive: formData.get("isActive") === "true",
    };

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar curso");
      }

      router.push(`/admin/conteudo/${courseId}`);
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao atualizar curso. Tente novamente.");
    } finally {
      setSaving(false);
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
      <Box sx={{ maxWidth: 800 }}>
        <Card>
          <CardContent sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {error || "Curso não encontrado"}
            </Typography>
            <Link href="/admin/conteudo" passHref>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Voltar para Cursos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Link href={`/admin/conteudo/${courseId}`} passHref>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Editar Curso
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Atualize as informações do curso
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Informações do Curso
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Modifique os dados do curso conforme necessário
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Título do Curso"
                name="title"
                defaultValue={course.title}
                placeholder="Ex: Desenvolvimento Web Full-Stack"
                required
              />

              <TextField
                fullWidth
                label="Descrição"
                name="description"
                defaultValue={course.description}
                placeholder="Descreva o que os alunos vão aprender neste curso..."
                required
                multiline
                rows={4}
              />

              <TextField
                fullWidth
                label="Duração (em horas)"
                name="duration"
                type="number"
                defaultValue={course.duration}
                placeholder="Ex: 120"
                required
              />

              <Box>
                <TextField
                  fullWidth
                  label="Pré-requisitos (um por linha)"
                  name="prerequisites"
                  defaultValue={course.prerequisites.join("\n")}
                  placeholder="Ex:&#10;Conhecimento básico de HTML&#10;Noções de programação"
                  multiline
                  rows={4}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  Digite cada pré-requisito em uma linha separada
                </Typography>
              </Box>

              <Box>
                <TextField
                  fullWidth
                  select
                  label="Status do Curso"
                  name="isActive"
                  defaultValue={course.isActive ? "true" : "false"}
                >
                  <MenuItem value="true">Ativo</MenuItem>
                  <MenuItem value="false">Inativo</MenuItem>
                </TextField>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  Cursos inativos não aparecem para os alunos
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  sx={{ flex: 1 }}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Link href={`/admin/conteudo/${courseId}`} passHref>
                  <Button variant="outlined">
                    Cancelar
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
