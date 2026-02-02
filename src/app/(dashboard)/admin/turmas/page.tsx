"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Cohort {
  _id: string;
  name: string;
  code: string;
  courseId: {
    _id: string;
    title: string;
  };
  startDate: string;
  endDate: string;
  status: "scheduled" | "active" | "completed" | "cancelled";
  students: any[];
  instructors: any[];
  maxStudents?: number;
}

const statusConfig = {
  scheduled: { label: "Agendada", color: "info" as const },
  active: { label: "Ativa", color: "success" as const },
  completed: { label: "Concluída", color: "default" as const },
  cancelled: { label: "Cancelada", color: "error" as const },
};

export default function AdminTurmasPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCohorts();
  }, []);

  async function loadCohorts() {
    try {
      const res = await fetch("/api/cohorts");
      if (res.ok) {
        const data = await res.json();
        setCohorts(data);
      }
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCohort(id: string) {
    if (!confirm("Tem certeza que deseja deletar esta turma? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const res = await fetch(`/api/cohorts/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadCohorts();
      }
    } catch (error) {
      console.error("Erro ao deletar turma:", error);
      alert("Erro ao deletar turma");
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
            Gestão de Turmas
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Gerencie turmas, alunos e instrutores
          </Typography>
        </Box>
        <Link href="/admin/turmas/nova" passHref style={{ textDecoration: "none" }}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Nova Turma
          </Button>
        </Link>
      </Box>

      {cohorts.length === 0 ? (
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8 }}>
              <SchoolIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Nenhuma turma criada
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Comece criando sua primeira turma
              </Typography>
              <Link href="/admin/turmas/nova" passHref style={{ textDecoration: "none" }}>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Criar Primeira Turma
                </Button>
              </Link>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {cohorts.map((cohort) => (
            <Grid item xs={12} md={6} lg={4} key={cohort._id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {cohort.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Código: {cohort.code}
                      </Typography>
                    </Box>
                    <Chip
                      label={statusConfig[cohort.status].label}
                      color={statusConfig[cohort.status].color}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="primary" fontWeight="medium" gutterBottom>
                    {cohort.courseId.title}
                  </Typography>

                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarTodayIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(cohort.startDate), "dd/MM/yyyy", { locale: ptBR })} -{" "}
                        {format(new Date(cohort.endDate), "dd/MM/yyyy", { locale: ptBR })}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PeopleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {cohort.students.length}
                        {cohort.maxStudents ? ` / ${cohort.maxStudents}` : ""} alunos
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <SchoolIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {cohort.instructors.length} instrutor(es)
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Link href={`/admin/turmas/${cohort._id}`} passHref style={{ textDecoration: "none" }}>
                    <Button size="small" variant="outlined">
                      Detalhes
                    </Button>
                  </Link>
                  <Link href={`/admin/turmas/${cohort._id}/editar`} passHref style={{ textDecoration: "none" }}>
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Link>
                  <IconButton size="small" color="error" onClick={() => deleteCohort(cohort._id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
