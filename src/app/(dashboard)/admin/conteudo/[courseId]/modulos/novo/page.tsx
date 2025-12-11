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
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function NovoModuloPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const router = useRouter();
  const { courseId } = use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const moduleData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      order: parseInt(formData.get("order") as string),
      estimatedHours: parseInt(formData.get("estimatedHours") as string),
      courseId,
    };

    try {
      const res = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(moduleData),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar módulo");
      }

      const module = await res.json();
      router.push(`/admin/conteudo/${courseId}/modulos/${module._id}`);
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao criar módulo. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
            Novo Módulo
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Adicione um novo módulo ao curso
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Informações do Módulo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Após criar o módulo, você poderá adicionar aulas e projetos
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
                label="Título do Módulo"
                name="title"
                placeholder="Ex: Introdução ao JavaScript"
                required
              />

              <TextField
                fullWidth
                label="Descrição"
                name="description"
                placeholder="Descreva o conteúdo do módulo..."
                required
                multiline
                rows={4}
              />

              <Grid container spacing={2}>
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
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                    Define a ordem de exibição do módulo
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Horas Estimadas"
                    name="estimatedHours"
                    type="number"
                    placeholder="Ex: 8"
                    required
                    defaultValue="8"
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? "Criando..." : "Criar Módulo"}
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
