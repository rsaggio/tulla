"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Play, Calendar, Clock, User } from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

interface LiveClass {
  _id: string;
  title: string;
  description?: string;
  recordingUrl: string;
  date: string;
  duration?: number;
  instructor: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  cohortId: {
    name: string;
    code: string;
  };
  topics?: string[];
}

interface LiveClassesData {
  liveClasses: LiveClass[];
  message?: string;
}

export default function AulasGravadasPage() {
  const [data, setData] = useState<LiveClassesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLiveClasses() {
      try {
        const response = await fetch("/api/student/live-classes");
        if (!response.ok) {
          throw new Error("Erro ao carregar aulas gravadas");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchLiveClasses();
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

  if (!data?.liveClasses || data.liveClasses.length === 0) {
    return (
      <Box sx={{ py: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" fontWeight="bold">
              Aulas Gravadas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Gravações das aulas ao vivo da sua turma
            </Typography>
          </Box>

          <Card>
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <Video size={48} style={{ margin: "0 auto", opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Nenhuma aula gravada disponível
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data?.message || "As gravações das aulas ao vivo aparecerão aqui"}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Aulas Gravadas
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {data.liveClasses.length} {data.liveClasses.length === 1 ? 'gravação disponível' : 'gravações disponíveis'}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {data.liveClasses.map((liveClass) => (
            <Grid item xs={12} md={6} lg={4} key={liveClass._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: 1,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Video size={24} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <CardTitle>{liveClass.title}</CardTitle>
                      <CardDescription>
                        {liveClass.cohortId.name}
                      </CardDescription>
                    </Box>
                  </Stack>
                </CardHeader>

                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Stack spacing={2} sx={{ flex: 1 }}>
                    {liveClass.description && (
                      <Typography variant="body2" color="text.secondary">
                        {liveClass.description}
                      </Typography>
                    )}

                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Calendar size={16} />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(liveClass.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </Typography>
                      </Stack>

                      {liveClass.duration && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Clock size={16} />
                          <Typography variant="caption" color="text.secondary">
                            {liveClass.duration} minutos
                          </Typography>
                        </Stack>
                      )}

                      <Stack direction="row" spacing={1} alignItems="center">
                        <User size={16} />
                        <Typography variant="caption" color="text.secondary">
                          {liveClass.instructor.name}
                        </Typography>
                      </Stack>
                    </Stack>

                    {liveClass.topics && liveClass.topics.length > 0 && (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                        {liveClass.topics.map((topic, index) => (
                          <Chip
                            key={index}
                            label={topic}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    )}

                    <Box sx={{ mt: 'auto', pt: 2 }}>
                      <a
                        href={liveClass.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', width: '100%', display: 'block' }}
                      >
                        <Button fullWidth>
                          <Play size={16} style={{ marginRight: 8 }} />
                          Assistir Gravação
                        </Button>
                      </a>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
