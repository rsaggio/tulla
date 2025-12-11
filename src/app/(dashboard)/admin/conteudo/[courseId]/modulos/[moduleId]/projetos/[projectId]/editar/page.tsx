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
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface RubricItem {
  criterion: string;
  points: number;
  description: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  estimatedHours: number;
  requirements: string[];
  deliverables: string[];
  rubric: RubricItem[];
  githubRequired: boolean;
}

export default function EditarProjetoPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string; projectId: string }>;
}) {
  const router = useRouter();
  const { courseId, moduleId, projectId } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [deliverables, setDeliverables] = useState<string[]>([""]);
  const [rubric, setRubric] = useState<RubricItem[]>([
    { criterion: "", points: 0, description: "" },
  ]);
  const [githubRequired, setGithubRequired] = useState(true);

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProject() {
    try {
      const res = await fetch(`/api/modules/${moduleId}/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
        setRequirements(data.requirements.length > 0 ? data.requirements : [""]);
        setDeliverables(data.deliverables.length > 0 ? data.deliverables : [""]);
        setRubric(
          data.rubric.length > 0
            ? data.rubric
            : [{ criterion: "", points: 0, description: "" }]
        );
        setGithubRequired(data.githubRequired);
      } else {
        setError("Projeto não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar projeto:", error);
      setError("Erro ao carregar projeto");
    } finally {
      setLoading(false);
    }
  }

  function addRequirement() {
    setRequirements([...requirements, ""]);
  }

  function removeRequirement(index: number) {
    setRequirements(requirements.filter((_, i) => i !== index));
  }

  function updateRequirement(index: number, value: string) {
    const updated = [...requirements];
    updated[index] = value;
    setRequirements(updated);
  }

  function addDeliverable() {
    setDeliverables([...deliverables, ""]);
  }

  function removeDeliverable(index: number) {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  }

  function updateDeliverable(index: number, value: string) {
    const updated = [...deliverables];
    updated[index] = value;
    setDeliverables(updated);
  }

  function addRubricItem() {
    setRubric([...rubric, { criterion: "", points: 0, description: "" }]);
  }

  function removeRubricItem(index: number) {
    setRubric(rubric.filter((_, i) => i !== index));
  }

  function updateRubricItem(
    index: number,
    field: keyof RubricItem,
    value: string | number
  ) {
    const updated = [...rubric];
    updated[index] = { ...updated[index], [field]: value };
    setRubric(updated);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const projectData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      estimatedHours: parseInt(formData.get("estimatedHours") as string),
      requirements: requirements.filter((r) => r.trim()),
      deliverables: deliverables.filter((d) => d.trim()),
      rubric: rubric.filter((r) => r.criterion.trim() && r.points > 0),
      githubRequired,
    };

    try {
      const res = await fetch(`/api/modules/${moduleId}/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(errorData.error || "Erro ao atualizar projeto");
      }

      router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao atualizar projeto. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (
      !confirm(
        "Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/modules/${moduleId}/projects/${projectId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
      } else {
        alert("Erro ao excluir projeto");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir projeto");
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return (
      <Box sx={{ maxWidth: 900 }}>
        <Card>
          <CardContent sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {error || "Projeto não encontrado"}
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
    <Box sx={{ maxWidth: 900 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`} passHref>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Editar Projeto
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Atualize as informações do projeto
          </Typography>
        </Box>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Informações Básicas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Atualize o título e descrição do projeto
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Título do Projeto"
                name="title"
                defaultValue={project.title}
                placeholder="Ex: Sistema de Gerenciamento de Tarefas"
                required
              />

              <TextField
                fullWidth
                label="Descrição"
                name="description"
                defaultValue={project.description}
                placeholder="Descreva o projeto e seus objetivos..."
                required
                multiline
                rows={4}
              />

              <TextField
                fullWidth
                label="Horas Estimadas"
                name="estimatedHours"
                type="number"
                defaultValue={project.estimatedHours}
                placeholder="Ex: 20"
                required
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={githubRequired}
                    onChange={(e) => setGithubRequired(e.target.checked)}
                  />
                }
                label="Envio via GitHub obrigatório"
              />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Requisitos
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  O que o aluno precisa implementar
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={addRequirement}
              >
                Adicionar
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {requirements.map((req, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder={`Requisito ${index + 1}`}
                    value={req}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                  />
                  {requirements.length > 1 && (
                    <IconButton color="error" onClick={() => removeRequirement(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Entregáveis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  O que o aluno deve entregar
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={addDeliverable}
              >
                Adicionar
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {deliverables.map((del, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    placeholder={`Entregável ${index + 1}`}
                    value={del}
                    onChange={(e) => updateDeliverable(index, e.target.value)}
                  />
                  {deliverables.length > 1 && (
                    <IconButton color="error" onClick={() => removeDeliverable(index)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Rubrica de Avaliação
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Critérios e pontuação do projeto
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={addRubricItem}
              >
                Adicionar Critério
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {rubric.map((item, index) => (
                <Box key={index}>
                  {index > 0 && <Divider sx={{ mb: 2 }} />}
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                      <TextField
                        fullWidth
                        label="Critério"
                        placeholder="Ex: Funcionalidades implementadas"
                        value={item.criterion}
                        onChange={(e) =>
                          updateRubricItem(index, "criterion", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Pontos"
                        type="number"
                        placeholder="0"
                        value={item.points || ""}
                        onChange={(e) =>
                          updateRubricItem(
                            index,
                            "points",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                        <TextField
                          fullWidth
                          label="Descrição"
                          placeholder="Como será avaliado"
                          value={item.description}
                          onChange={(e) =>
                            updateRubricItem(index, "description", e.target.value)
                          }
                        />
                        {rubric.length > 1 && (
                          <IconButton color="error" onClick={() => removeRubricItem(index)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button type="submit" variant="contained" disabled={saving} sx={{ flex: 1 }}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`} passHref>
            <Button variant="outlined">Cancelar</Button>
          </Link>
        </Box>
      </Box>

      <Card sx={{ borderColor: "error.main", borderWidth: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="error" gutterBottom>
            Zona de Perigo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ações irreversíveis que afetam este projeto
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Excluir Projeto
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remove o projeto permanentemente
              </Typography>
            </Box>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Excluir Projeto
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
