"use client";

import { useState, use } from "react";
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
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MarkdownEditor from "@/components/MarkdownEditor";

export default function NovaAulaPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const router = useRouter();
  const { courseId, moduleId } = use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const lessonData = {
      title: formData.get("title") as string,
      content: content,
      type: formData.get("type") as string,
      order: parseInt(formData.get("order") as string),
      videoUrl: formData.get("videoUrl") as string || undefined,
      moduleId,
    };

    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar aula");
      }

      router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao criar aula. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
            Nova Aula
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Crie uma nova aula para o módulo
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Informações da Aula
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Preencha os dados da nova aula
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
                    defaultValue="teoria"
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
                    placeholder="Ex: 1"
                    required
                    defaultValue="1"
                  />
                </Grid>
              </Grid>

              <Box>
                <TextField
                  fullWidth
                  label="URL do Vídeo (opcional)"
                  name="videoUrl"
                  type="url"
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
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? "Criando..." : "Criar Aula"}
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
    </Box>
  );
}
