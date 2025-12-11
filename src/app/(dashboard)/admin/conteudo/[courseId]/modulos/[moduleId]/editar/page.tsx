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
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  courseId: string;
}

export default function EditarModuloPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const router = useRouter();
  const { courseId, moduleId } = use(params);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadModule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadModule() {
    try {
      const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}`);
      if (res.ok) {
        const data = await res.json();
        setModule(data);
      } else {
        setError("Módulo não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar módulo:", error);
      setError("Erro ao carregar módulo");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const moduleData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      order: parseInt(formData.get("order") as string),
      estimatedHours: parseInt(formData.get("estimatedHours") as string),
    };

    try {
      const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(moduleData),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar módulo");
      }

      router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao atualizar módulo. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este módulo? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(`/admin/conteudo/${courseId}`);
      } else {
        alert("Erro ao excluir módulo");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir módulo");
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
              {error || "Módulo não encontrado"}
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
    <Box sx={{ maxWidth: 800 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`} passHref>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Editar Módulo
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Atualize as informações do módulo
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Informações do Módulo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Modifique os dados do módulo conforme necessário
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
                defaultValue={module.title}
                placeholder="Ex: Introdução ao JavaScript"
                required
              />

              <TextField
                fullWidth
                label="Descrição"
                name="description"
                defaultValue={module.description}
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
                    defaultValue={module.order}
                    placeholder="Ex: 1"
                    required
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
                    defaultValue={module.estimatedHours}
                    placeholder="Ex: 8"
                    required
                  />
                </Grid>
              </Grid>

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
            Ações irreversíveis que afetam este módulo
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Excluir Módulo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remove o módulo e todas as suas aulas permanentemente
              </Typography>
            </Box>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Excluir Módulo
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
