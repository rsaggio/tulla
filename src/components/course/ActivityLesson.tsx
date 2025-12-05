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
} from "@mui/material";
import {
  Assignment,
  Info,
  Send,
  CheckCircle,
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

interface ActivityLessonProps {
  activity: Activity;
  onSubmit: (content: string) => Promise<void>;
  previousSubmission?: Submission;
}

export default function ActivityLesson({
  activity,
  onSubmit,
  previousSubmission,
}: ActivityLessonProps) {
  const [content, setContent] = useState(
    previousSubmission?.content || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(
    previousSubmission?.content
      ? previousSubmission.content.trim().split(/\s+/).length
      : 0
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    const words = newContent.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  const handleSubmit = async () => {
    // Validar palavras mínimas
    if (activity.minWords && wordCount < activity.minWords) {
      alert("A atividade deve ter pelo menos " + activity.minWords + " palavras.");
      return;
    }

    // Validar palavras máximas
    if (activity.maxWords && wordCount > activity.maxWords) {
      alert("A atividade deve ter no máximo " + activity.maxWords + " palavras.");
      return;
    }

    if (!content.trim()) {
      alert("Por favor, escreva sua resposta antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      alert("Atividade enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar atividade:", error);
      alert("Erro ao enviar atividade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWordCountColor = () => {
    if (activity.minWords && wordCount < activity.minWords) return "error";
    if (activity.maxWords && wordCount > activity.maxWords) return "error";
    return "success";
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
              Nota: {previousSubmission.grade}
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

        {(activity.minWords || activity.maxWords || activity.expectedFormat) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              {activity.minWords && (
                <Typography variant="body2" color="text.secondary">
                  • Mínimo de palavras: {activity.minWords}
                </Typography>
              )}
              {activity.maxWords && (
                <Typography variant="body2" color="text.secondary">
                  • Máximo de palavras: {activity.maxWords}
                </Typography>
              )}
              {activity.expectedFormat && (
                <Typography variant="body2" color="text.secondary">
                  • Formato esperado: {activity.expectedFormat}
                </Typography>
              )}
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
          disabled={
            isSubmitting ||
            (previousSubmission?.status === "aprovado" ||
              previousSubmission?.status === "em_revisao")
          }
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            variant="body2"
            color={getWordCountColor() + ".main"}
          >
            Palavras: {wordCount}
            {activity.minWords && " / " + activity.minWords + " mínimo"}
            {activity.maxWords && " (máx: " + activity.maxWords + ")"}
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<Send />}
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !content.trim() ||
              (activity.minWords && wordCount < activity.minWords) ||
              (activity.maxWords && wordCount > activity.maxWords) ||
              previousSubmission?.status === "em_revisao" ||
              previousSubmission?.status === "aprovado"
            }
          >
            {isSubmitting ? "Enviando..." : "Enviar Atividade"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
