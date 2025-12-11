"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import PeopleIcon from "@mui/icons-material/People";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  progress: {
    overallProgress: number;
    completedLessons: any[];
    lastActivityAt: string | null;
    currentModuleId: { title: string } | null;
  };
}

export default function InstrutorAlunosPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [search, students]);

  async function loadStudents() {
    try {
      const res = await fetch("/api/instructor/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        setFilteredStudents(data);
      }
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  }

  function getActivityStatus(lastActivity: string | null, createdAt: string) {
    if (!lastActivity) {
      return { color: "default" as const, text: "Nunca acessou" };
    }

    const daysSince = Math.floor(
      (new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince === 0) return { color: "success" as const, text: "Ativo hoje" };
    if (daysSince <= 3) return { color: "success" as const, text: "Ativo" };
    if (daysSince <= 7) return { color: "warning" as const, text: "Moderado" };
    return { color: "error" as const, text: "Em risco" };
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" fontWeight="bold">
          Alunos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Acompanhe o progresso e atividade de todos os alunos
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <PeopleIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" fontWeight="medium">
                  Total de Alunos
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {students.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <TrendingUpIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" fontWeight="medium">
                  Progresso Médio
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {students.length > 0
                  ? Math.round(
                      students.reduce((acc, s) => acc + s.progress.overallProgress, 0) /
                        students.length
                    )
                  : 0}
                %
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <AccessTimeIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" fontWeight="medium">
                  Alunos Ativos
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {
                  students.filter((s) => {
                    if (!s.progress.lastActivityAt) return false;
                    const daysSince = Math.floor(
                      (new Date().getTime() -
                        new Date(s.progress.lastActivityAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return daysSince <= 7;
                  }).length
                }
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Ativos nos últimos 7 dias
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Buscar aluno por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {filteredStudents.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 12 }}>
              <PeopleIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {search ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {filteredStudents.map((student) => {
                const activityStatus = getActivityStatus(
                  student.progress.lastActivityAt,
                  student.createdAt
                );

                return (
                  <Paper
                    key={student._id}
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      "&:hover": { bgcolor: "action.hover" },
                      transition: "all 0.2s",
                    }}
                    variant="outlined"
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography fontWeight="medium" noWrap>
                          {student.name}
                        </Typography>
                        <Chip
                          label={activityStatus.text}
                          color={activityStatus.color}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {student.email}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Progresso:
                        </Typography>
                        <Chip
                          label={`${student.progress.overallProgress}%`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {student.progress.completedLessons.length} aulas concluídas
                      </Typography>
                      {student.progress.lastActivityAt && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Último acesso:{" "}
                          {formatDistanceToNow(
                            new Date(student.progress.lastActivityAt),
                            { addSuffix: true, locale: ptBR }
                          )}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
