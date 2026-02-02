"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Course {
  _id: string;
  title: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Cohort {
  _id: string;
  courseId: { _id: string; title: string };
  name: string;
  code: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: string;
  maxStudents?: number;
  instructors: any[];
  timezone?: string;
}

export default function EditarTurmaPage() {
  const params = useParams();
  const router = useRouter();
  const cohortId = params.cohortId as string;
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [cohort, setCohort] = useState<Cohort | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, [cohortId]);

  async function loadData() {
    try {
      const [cohortRes, coursesRes, usersRes] = await Promise.all([
        fetch(`/api/cohorts/${cohortId}`),
        fetch("/api/courses"),
        fetch("/api/users?role=instrutor"),
      ]);

      if (cohortRes.ok) {
        const cohortData = await cohortRes.json();
        setCohort(cohortData);
      }

      if (coursesRes.ok) {
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setInstructors(usersData);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar dados da turma");
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Para Select múltiplo, usar getAll para pegar todos os valores selecionados
    const instructors = formData.getAll("instructors") as string[];

    const cohortData = {
      courseId: formData.get("courseId") as string,
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: formData.get("status") as string,
      maxStudents: parseInt(formData.get("maxStudents") as string) || undefined,
      instructors,
      timezone: formData.get("timezone") as string,
    };

    try {
      const res = await fetch(`/api/cohorts/${cohortId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cohortData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar turma");
      }

      router.push(`/admin/turmas/${cohortId}`);
    } catch (error: any) {
      console.error("Erro:", error);
      setError(error.message || "Erro ao atualizar turma. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cohort) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Turma não encontrada
        </Typography>
        <Link href="/admin/turmas" passHref style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ mt: 2 }}>
            Voltar para Turmas
          </Button>
        </Link>
      </Box>
    );
  }

  const formatDateForInput = (dateString: string) => {
    return dateString.split("T")[0];
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Link href={`/admin/turmas/${cohortId}`} passHref style={{ textDecoration: "none" }}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Editar Turma
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {cohort.name} - {cohort.code}
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Informações da Turma
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Atualize as informações da turma
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FormControl fullWidth required>
                <InputLabel>Curso</InputLabel>
                <Select
                  name="courseId"
                  label="Curso"
                  defaultValue={cohort.courseId._id}
                >
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Nome da Turma"
                name="name"
                defaultValue={cohort.name}
                placeholder="Ex: Turma 2026.1 - Manhã"
                required
              />

              <TextField
                fullWidth
                label="Código da Turma"
                name="code"
                defaultValue={cohort.code}
                placeholder="Ex: DW-2026-1-M"
                required
                helperText="Código único para identificar a turma (será convertido para maiúsculas)"
              />

              <TextField
                fullWidth
                label="Descrição"
                name="description"
                defaultValue={cohort.description || ""}
                placeholder="Informações adicionais sobre a turma..."
                multiline
                rows={3}
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  fullWidth
                  label="Data de Início"
                  name="startDate"
                  type="date"
                  defaultValue={formatDateForInput(cohort.startDate)}
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  label="Data de Término"
                  name="endDate"
                  type="date"
                  defaultValue={formatDateForInput(cohort.endDate)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select name="status" label="Status" defaultValue={cohort.status}>
                  <MenuItem value="scheduled">Agendada</MenuItem>
                  <MenuItem value="active">Ativa</MenuItem>
                  <MenuItem value="completed">Concluída</MenuItem>
                  <MenuItem value="cancelled">Cancelada</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Máximo de Alunos"
                name="maxStudents"
                type="number"
                defaultValue={cohort.maxStudents || ""}
                placeholder="Ex: 30"
                helperText="Deixe em branco para sem limite"
              />

              <FormControl fullWidth>
                <InputLabel>Instrutores</InputLabel>
                <Select
                  name="instructors"
                  label="Instrutores"
                  defaultValue={cohort.instructors.map((i: any) => i._id)}
                  multiple
                  renderValue={(selected: any) => {
                    const selectedIds = Array.isArray(selected)
                      ? selected
                      : selected.split(",").filter((id: string) => id);
                    return selectedIds
                      .map((id: string) => instructors.find((i) => i._id === id)?.name)
                      .filter(Boolean)
                      .join(", ");
                  }}
                >
                  {instructors.map((instructor) => (
                    <MenuItem key={instructor._id} value={instructor._id}>
                      {instructor.name} ({instructor.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Fuso Horário"
                name="timezone"
                defaultValue={cohort.timezone || "America/Sao_Paulo"}
                helperText="Ex: America/Sao_Paulo, America/New_York"
              />

              <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Link href={`/admin/turmas/${cohortId}`} passHref style={{ textDecoration: "none" }}>
                  <Button variant="outlined">Cancelar</Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
