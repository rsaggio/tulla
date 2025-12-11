"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MarkdownEditor from "@/components/MarkdownEditor";

interface Lesson {
  _id: string;
  title: string;
  content: string;
  type: string;
  order: number;
  videoUrl?: string;
  resources?: { title: string; url: string }[];
  moduleId: string;
}

export default function EditarAulaPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
}) {
  const router = useRouter();
  const { courseId, moduleId, lessonId } = use(params);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLesson() {
    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        setLesson(data);
        setContent(data.content || "");
      } else {
        setError("Aula não encontrada");
      }
    } catch (error) {
      console.error("Erro ao carregar aula:", error);
      setError("Erro ao carregar aula");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const lessonData = {
      title: formData.get("title") as string,
      content: content,
      type: formData.get("type") as string,
      order: parseInt(formData.get("order") as string),
      videoUrl: formData.get("videoUrl") as string || undefined,
    };

    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar aula");
      }

      router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao atualizar aula. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
      } else {
        alert("Erro ao excluir aula");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir aula");
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lesson) {
    return (
      <Box sx={{ maxWidth: 900 }}>
        <Card>
          <CardContent sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {error || "Aula não encontrada"}
            </Typography>
            <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`} passHref>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Voltar ao Módulo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`} passHref>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Editar Aula
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Atualize o conteúdo da aula
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Informações da Aula
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Modifique o conteúdo e propriedades da aula
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
                label="Título da Aula"
                name="title"
                defaultValue={lesson.title}
                placeholder="Ex: Variáveis e Tipos de Dados"
                required
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Tipo"
                    name="type"
                    defaultValue={lesson.type}
                    required
                  >
                    <MenuItem value="teoria">Teoria</MenuItem>
                    <MenuItem value="video">Vídeo</MenuItem>
                    <MenuItem value="leitura">Leitura</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ordem"
                    name="order"
                    type="number"
                    defaultValue={lesson.order}
                    placeholder="Ex: 1"
                    required
                  />
                </Grid>
              </Grid>

              <Box>
                <TextField
                  fullWidth
                  label="URL do Vídeo (opcional)"
                  name="videoUrl"
                  type="url"
                  defaultValue={lesson.videoUrl || ""}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                  Link para vídeo do YouTube, Vimeo, etc.
                </Typography>
              </Box>

              <MarkdownEditor
                value={content}
                onChange={setContent}
                label="Conteúdo (Markdown)"
                placeholder="# Título da Seção&#10;&#10;Escreva o conteúdo da aula em Markdown...&#10;&#10;```javascript&#10;const exemplo = 'código';&#10;```"
                required
                rows={20}
                name="content"
              />

              <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  sx={{ flex: 1 }}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`} passHref>
                  <Button variant="outlined">
                    Cancelar
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderColor: "error.main", borderWidth: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="error" gutterBottom>
            Zona de Perigo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ações irreversíveis que afetam esta aula
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Excluir Aula
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remove a aula permanentemente
              </Typography>
            </Box>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Excluir Aula
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
