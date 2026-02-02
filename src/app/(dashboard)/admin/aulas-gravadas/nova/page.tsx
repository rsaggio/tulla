"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Chip from "@mui/material/Chip";

interface Cohort {
  _id: string;
  name: string;
  code: string;
}

interface Instructor {
  _id: string;
  name: string;
  email: string;
}

export default function NovaAulaGravadaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [formData, setFormData] = useState({
    cohortId: "",
    title: "",
    description: "",
    recordingUrl: "",
    date: "",
    duration: "",
    instructor: "",
    topics: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Pré-selecionar turma se vier da query string
    const cohortIdParam = searchParams.get("cohortId");
    if (cohortIdParam) {
      setFormData((prev) => ({ ...prev, cohortId: cohortIdParam }));
    }
  }, [searchParams]);

  async function loadData() {
    try {
      // Carregar turmas
      const cohortsRes = await fetch("/api/cohorts");
      if (cohortsRes.ok) {
        const cohortsData = await cohortsRes.json();
        // A API retorna array direto, não objeto com propriedade cohorts
        setCohorts(Array.isArray(cohortsData) ? cohortsData : []);
      }

      // Carregar instrutores
      const instructorsRes = await fetch("/api/users?role=instrutor");
      if (instructorsRes.ok) {
        const instructorsData = await instructorsRes.json();
        setInstructors(instructorsData.users || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  function handleChange(field: string, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleAddTopic() {
    if (topicInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        topics: [...prev.topics, topicInput.trim()],
      }));
      setTopicInput("");
    }
  }

  function handleRemoveTopic(index: number) {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
      };

      const res = await fetch("/api/admin/live-classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // Redirecionar para a página de detalhes da turma
        const cohortIdParam = searchParams.get("cohortId");
        if (cohortIdParam || formData.cohortId) {
          router.push(`/admin/turmas/${cohortIdParam || formData.cohortId}`);
        } else {
          router.push("/admin/aulas-gravadas");
        }
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao criar aula gravada");
      }
    } catch (error) {
      console.error("Erro ao criar aula gravada:", error);
      alert("Erro ao criar aula gravada");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Link href="/admin/aulas-gravadas" passHref style={{ textDecoration: "none" }}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Nova Aula Gravada
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Adicione uma gravação de aula ao vivo
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl fullWidth required>
                <InputLabel>Turma</InputLabel>
                <Select
                  value={formData.cohortId}
                  label="Turma"
                  onChange={(e) => handleChange("cohortId", e.target.value)}
                >
                  {cohorts.map((cohort) => (
                    <MenuItem key={cohort._id} value={cohort._id}>
                      {cohort.code} - {cohort.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Título"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Descrição"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                multiline
                rows={3}
                fullWidth
              />

              <TextField
                label="URL da Gravação (Google Drive)"
                value={formData.recordingUrl}
                onChange={(e) => handleChange("recordingUrl", e.target.value)}
                required
                fullWidth
                placeholder="https://drive.google.com/..."
                helperText="Cole o link compartilhável do Google Drive"
              />

              <TextField
                label="Data da Aula"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Duração (minutos)"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                fullWidth
                inputProps={{ min: 1 }}
              />

              <FormControl fullWidth>
                <InputLabel>Instrutor</InputLabel>
                <Select
                  value={formData.instructor}
                  label="Instrutor"
                  onChange={(e) => handleChange("instructor", e.target.value)}
                >
                  <MenuItem value="">
                    <em>Usar meu usuário</em>
                  </MenuItem>
                  {instructors.map((instructor) => (
                    <MenuItem key={instructor._id} value={instructor._id}>
                      {instructor.name} ({instructor.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Tópicos Abordados
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Digite um tópico"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTopic();
                      }
                    }}
                    fullWidth
                  />
                  <Button variant="outlined" onClick={handleAddTopic}>
                    Adicionar
                  </Button>
                </Stack>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                  {formData.topics.map((topic, index) => (
                    <Chip
                      key={index}
                      label={topic}
                      onDelete={() => handleRemoveTopic(index)}
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Link href="/admin/aulas-gravadas" passHref style={{ textDecoration: "none" }}>
                  <Button variant="outlined" disabled={loading}>
                    Cancelar
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
