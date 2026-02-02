"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy } from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

interface Classmate {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  completedActivities: number;
}

interface CohortInfo {
  _id: string;
  name: string;
  code: string;
}

interface ClassmatesData {
  classmates: Classmate[];
  cohort: CohortInfo | null;
  message?: string;
}

export default function TurmaPage() {
  const [data, setData] = useState<ClassmatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClassmates() {
      try {
        const response = await fetch("/api/student/classmates");
        if (!response.ok) {
          throw new Error("Erro ao carregar colegas de turma");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchClassmates();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 3 }}>
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!data?.cohort) {
    return (
      <Box sx={{ py: 3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Minha Turma</CardTitle>
            <CardDescription>
              {data?.message || "Você ainda não está matriculado em nenhuma turma"}
            </CardDescription>
          </CardHeader>
        </Card>
      </Box>
    );
  }

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRankColor = (index: number) => {
    if (index === 0) return "gold";
    if (index === 1) return "silver";
    if (index === 2) return "#CD7F32"; // bronze
    return "grey.600";
  };

  const getRankEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <Box sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Minha Turma
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {data.cohort.name} ({data.cohort.code})
          </Typography>
        </Box>

        <Card>
          <CardHeader>
            <Stack direction="row" spacing={1} alignItems="center">
              <Trophy size={20} />
              <CardTitle>
                Ranking da Turma ({data.classmates.length})
              </CardTitle>
            </Stack>
            <CardDescription>
              Classificação por atividades concluídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.classmates.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Você é o único aluno nesta turma no momento.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {data.classmates.map((classmate, index) => (
                  <Grid item xs={12} sm={6} md={4} key={classmate._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack spacing={2} alignItems="center">
                          <Box sx={{ position: "relative" }}>
                            <Avatar
                              src={classmate.profileImage}
                              alt={classmate.name}
                              sx={{ width: 64, height: 64 }}
                            >
                              {getInitials(classmate.name)}
                            </Avatar>
                            <Box
                              sx={{
                                position: "absolute",
                                top: -8,
                                right: -8,
                                bgcolor: "background.paper",
                                borderRadius: "50%",
                                width: 32,
                                height: 32,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "2px solid",
                                borderColor: getRankColor(index),
                                fontSize: "1rem",
                              }}
                            >
                              {getRankEmoji(index)}
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: "center", width: "100%" }}>
                            <Typography variant="h6" fontWeight="medium">
                              {classmate.name}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                              justifyContent="center"
                              sx={{ mt: 1 }}
                            >
                              <Trophy size={14} color={getRankColor(index)} />
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                sx={{ color: getRankColor(index) }}
                              >
                                {classmate.completedActivities}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {classmate.completedActivities === 1 ? "atividade" : "atividades"}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
