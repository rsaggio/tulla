"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AssignmentIcon from "@mui/icons-material/Assignment";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Submission {
  _id: string;
  projectId: {
    _id: string;
    title: string;
    description: string;
    estimatedHours: number;
  };
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  githubUrl: string;
  notes?: string;
  status: "pendente" | "em_revisao" | "aprovado" | "reprovado";
  submittedAt: string;
}

export default function InstrutorRevisoesPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState<number>(0);
  const [reviewStatus, setReviewStatus] = useState<"aprovado" | "reprovado">("aprovado");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    try {
      const res = await fetch("/api/instructor/reviews");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Erro ao carregar submissões:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(submissionId: string) {
    if (!feedback.trim()) {
      alert("Por favor, forneça um feedback para o aluno");
      return;
    }

    if (grade < 0 || grade > 100) {
      alert("A nota deve estar entre 0 e 100");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/instructor/reviews/${submissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: reviewStatus,
          feedback,
          grade,
        }),
      });

      if (res.ok) {
        alert(`Projeto ${reviewStatus === "aprovado" ? "aprovado" : "reprovado"} com sucesso!`);
        setReviewing(null);
        setFeedback("");
        setGrade(0);
        setReviewStatus("aprovado");
        loadSubmissions();
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao revisar projeto");
      }
    } catch (error) {
      console.error("Erro ao revisar:", error);
      alert("Erro ao revisar projeto");
    } finally {
      setSubmitting(false);
    }
  }

  function startReview(submissionId: string) {
    setReviewing(submissionId);
    setFeedback("");
    setGrade(reviewStatus === "aprovado" ? 100 : 0);
  }

  function cancelReview() {
    setReviewing(null);
    setFeedback("");
    setGrade(0);
    setReviewStatus("aprovado");
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
          Fila de Revisões
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Revise os projetos submetidos pelos alunos
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <AssignmentIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" fontWeight="medium">
                  Pendentes
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {submissions.filter((s) => s.status === "pendente").length}
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
                  Em Revisão
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {submissions.filter((s) => s.status === "em_revisao").length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <CheckCircleIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" fontWeight="medium">
                  Total na Fila
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {submissions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {submissions.length === 0 ? (
        <Card>
          <CardContent>
            <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
              <AssignmentIcon sx={{ fontSize: 48, color: "text.secondary" }} />
              <Typography variant="h6" fontWeight="medium">
                Nenhuma submissão pendente
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Todas as submissões foram revisadas!
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {submissions.map((submission) => (
            <Card key={submission._id}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {submission.projectId.title}
                      </Typography>
                      <Chip
                        label={submission.status === "pendente" ? "Pendente" : "Em Revisão"}
                        color={submission.status === "pendente" ? "warning" : "info"}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {submission.projectId.description}
                    </Typography>
                  </Box>
                  <Chip label={`${submission.projectId.estimatedHours}h`} size="small" variant="outlined" />
                </Box>

                <Grid container spacing={3} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                      Aluno
                    </Typography>
                    <Typography variant="body2">{submission.studentId.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {submission.studentId.email}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                      Submetido
                    </Typography>
                    <Typography variant="body2">
                      {formatDistanceToNow(new Date(submission.submittedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Repositório
                  </Typography>
                  <Link
                    href={submission.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <OpenInNewIcon sx={{ fontSize: 16 }} />
                    {submission.githubUrl}
                  </Link>
                </Box>

                {submission.notes && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium" gutterBottom>
                      Notas do Aluno
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "action.hover" }}>
                      <Typography variant="body2" color="text.secondary">
                        {submission.notes}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {reviewing === submission._id ? (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                          Status da Revisão
                        </Typography>
                        <ToggleButtonGroup
                          value={reviewStatus}
                          exclusive
                          onChange={(e, value) => {
                            if (value !== null) {
                              setReviewStatus(value);
                              setGrade(value === "aprovado" ? 100 : 0);
                            }
                          }}
                          fullWidth
                        >
                          <ToggleButton value="aprovado" color="success">
                            <CheckCircleIcon sx={{ mr: 1 }} />
                            Aprovar
                          </ToggleButton>
                          <ToggleButton value="reprovado" color="error">
                            <CancelIcon sx={{ mr: 1 }} />
                            Reprovar
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </Box>

                      <TextField
                        label="Nota (0-100)"
                        type="number"
                        inputProps={{ min: 0, max: 100 }}
                        value={grade}
                        onChange={(e) => setGrade(Number(e.target.value))}
                        fullWidth
                      />

                      <TextField
                        label="Feedback"
                        placeholder="Forneça um feedback detalhado sobre o projeto do aluno..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        multiline
                        rows={6}
                        required
                        fullWidth
                      />

                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleReview(submission._id)}
                          disabled={submitting}
                          sx={{ flex: 1 }}
                        >
                          {submitting ? "Enviando..." : "Enviar Revisão"}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={cancelReview}
                          disabled={submitting}
                        >
                          Cancelar
                        </Button>
                      </Box>
                    </Stack>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => startReview(submission._id)}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Iniciar Revisão
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
