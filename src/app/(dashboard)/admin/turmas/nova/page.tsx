"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function NovaTurmaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [coursesRes, usersRes] = await Promise.all([
        fetch("/api/courses"),
        fetch("/api/users?role=instrutor"),
      ]);

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
    } finally {
      setLoadingData(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const cohortData = {
      courseId: formData.get("courseId") as string,
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      status: formData.get("status") as string,
      maxStudents: parseInt(formData.get("maxStudents") as string) || undefined,
      instructors: (formData.get("instructors") as string)
        .split(",")
        .filter((id) => id.trim()),
      timezone: formData.get("timezone") as string,
    };

    try {
      const res = await fetch("/api/cohorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cohortData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao criar turma");
      }

      const cohort = await res.json();
      router.push(`/admin/turmas/${cohort._id}`);
    } catch (error: any) {
      console.error("Erro:", error);
      setError(error.message || "Erro ao criar turma. Tente novamente.");
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

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Link href="/admin/turmas" passHref style={{ textDecoration: "none" }}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Nova Turma
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Crie uma nova turma para um curso existente
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Informações da Turma
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Após criar a turma, você poderá adicionar alunos
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
                <Select name="courseId" label="Curso" defaultValue="">
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
                placeholder="Ex: Turma 2026.1 - Manhã"
                required
              />

              <TextField
                fullWidth
                label="Código da Turma"
                name="code"
                placeholder="Ex: DW-2026-1-M"
                required
                helperText="Código único para identificar a turma (será convertido para maiúsculas)"
              />

              <TextField
                fullWidth
                label="Descrição"
                name="description"
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
                  required
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  label="Data de Término"
                  name="endDate"
                  type="date"
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select name="status" label="Status" defaultValue="scheduled">
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
                placeholder="Ex: 30"
                helperText="Deixe em branco para sem limite"
              />

              <FormControl fullWidth>
                <InputLabel>Instrutores</InputLabel>
                <Select
                  name="instructors"
                  label="Instrutores"
                  defaultValue={[]}
                  multiple
                  renderValue={(selected: any) => {
                    const selectedIds = Array.isArray(selected) ? selected : selected.split(",").filter((id: string) => id);
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
                defaultValue="America/Sao_Paulo"
                helperText="Ex: America/Sao_Paulo, America/New_York"
              />

              <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? "Criando..." : "Criar Turma"}
                </Button>
                <Link href="/admin/turmas" passHref style={{ textDecoration: "none" }}>
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
