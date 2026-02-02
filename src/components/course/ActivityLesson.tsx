"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  TextField,
  Button,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Assignment,
  Info,
  Send,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";

interface Activity {
  _id: string;
  title: string;
  description: string;
  instructions: string;
  expectedFormat?: string;
  minWords?: number;
  maxWords?: number;
  resources?: { title: string; url: string }[];
}

interface Submission {
  content: string;
  submittedAt: Date;
  status: "pendente" | "em_revisao" | "aprovado" | "reprovado";
  feedback?: string;
  grade?: number;
}

interface EvaluationResult {
  grade: number;
  feedback: string;
  status: string;
}

interface ActivityLessonProps {
  activity: Activity;
  onSubmit: (content: string) => Promise<EvaluationResult>;
  previousSubmission?: Submission;
}

export default function ActivityLesson({
  activity,
  onSubmit,
  previousSubmission,
}: ActivityLessonProps) {
  const [content, setContent] = useState(
    previousSubmission?.status === "reprovado"
      ? previousSubmission?.content || ""
      : previousSubmission?.content || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(
    previousSubmission?.content
      ? previousSubmission.content.trim().split(/\s+/).length
      : 0
  );
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    const words = newContent.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Por favor, escreva sua resposta antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit(content);
      setEvaluation(result);
      setModalOpen(true);
    } catch (error) {
      console.error("Erro ao enviar atividade:", error);
      alert("Erro ao enviar atividade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "aprovado":
        return { severity: "success" as const, text: "Atividade Aprovada" };
      case "reprovado":
        return { severity: "error" as const, text: "Atividade Reprovada" };
      case "em_revisao":
        return { severity: "info" as const, text: "Em Revisão" };
      default:
        return { severity: "warning" as const, text: "Aguardando Revisão" };
    }
  };

  const isDisabled =
    isSubmitting ||
    previousSubmission?.status === "aprovado";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip
            icon={<Assignment />}
            label="Atividade"
            color="secondary"
            size="small"
          />
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {activity.title}
        </Typography>
      </Box>

      {/* Previous Submission Status */}
      {previousSubmission && (
        <Alert
          severity={getStatusInfo(previousSubmission.status).severity}
          icon={
            previousSubmission.status === "aprovado" ? (
              <CheckCircle />
            ) : undefined
          }
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" fontWeight="bold">
            {getStatusInfo(previousSubmission.status).text}
          </Typography>
          {previousSubmission.grade !== undefined && (
            <Typography variant="body2">
              Nota: {(previousSubmission.grade / 10).toFixed(1)}/10
            </Typography>
          )}
          {previousSubmission.feedback && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Feedback:</strong> {previousSubmission.feedback}
            </Typography>
          )}
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Enviado em:{" "}
            {new Date(previousSubmission.submittedAt).toLocaleString("pt-BR")}
          </Typography>
        </Alert>
      )}

      {/* Description */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Info color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Descrição
          </Typography>
        </Box>
        <Box
          sx={{
            "& p": { mb: 2 },
            "& ul, & ol": { pl: 3, mb: 2 },
          }}
        >
          <ReactMarkdown>{activity.description}</ReactMarkdown>
        </Box>
      </Paper>

      {/* Instructions */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: "info.50", borderLeft: 4, borderColor: "info.main" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Instruções
        </Typography>
        <Box
          sx={{
            "& p": { mb: 2 },
            "& ul, & ol": { pl: 3, mb: 2 },
          }}
        >
          <ReactMarkdown>{activity.instructions}</ReactMarkdown>
        </Box>

        {activity.expectedFormat && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Formato esperado: {activity.expectedFormat}
              </Typography>
            </Box>
          </>
        )}
      </Paper>

      {/* Resources */}
      {activity.resources && activity.resources.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Recursos Adicionais
          </Typography>
          <Box component="ul" sx={{ pl: 3, m: 0 }}>
            {activity.resources.map((resource, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  {resource.title}
                </a>
              </li>
            ))}
          </Box>
        </Paper>
      )}

      {/* Answer Editor */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Sua Resposta
        </Typography>

        <TextField
          multiline
          fullWidth
          rows={12}
          value={content}
          onChange={handleContentChange}
          placeholder="Digite sua resposta aqui..."
          disabled={isDisabled}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Palavras: {wordCount}
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
            onClick={handleSubmit}
            disabled={isDisabled || !content.trim()}
          >
            {isSubmitting ? "Avaliando sua resposta..." : "Enviar Atividade"}
          </Button>
        </Box>
      </Paper>

      {/* Evaluation Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {evaluation && (
          <>
            <DialogTitle sx={{ textAlign: "center", pt: 4 }}>
              <Box sx={{ mb: 2 }}>
                {evaluation.status === "aprovado" ? (
                  <CheckCircle sx={{ fontSize: 64, color: "success.main" }} />
                ) : (
                  <Cancel sx={{ fontSize: 64, color: "error.main" }} />
                )}
              </Box>
              <Typography variant="h5" fontWeight="bold">
                {evaluation.status === "aprovado"
                  ? "Parabéns! Atividade Aprovada!"
                  : "Tente Novamente"}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  sx={{
                    color:
                      evaluation.grade > 7
                        ? "success.main"
                        : evaluation.grade >= 5
                        ? "warning.main"
                        : "error.main",
                  }}
                >
                  {evaluation.grade.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  de 10.0
                </Typography>
              </Box>

              <Paper
                sx={{
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Feedback do avaliador:
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                  {evaluation.feedback}
                </Typography>
              </Paper>

              {evaluation.status !== "aprovado" && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Você precisa de uma nota maior que 7.0 para ser aprovado. Revise sua resposta e tente novamente!
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
              <Button
                variant="contained"
                onClick={() => setModalOpen(false)}
                size="large"
              >
                {evaluation.status === "aprovado" ? "Fechar" : "Tentar Novamente"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
