"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Alert,
  LinearProgress,
  Divider,
} from "@mui/material";
import {
  Quiz as QuizIcon,
  CheckCircle,
  Cancel,
  Timer,
} from "@mui/icons-material";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
}

interface QuizLessonProps {
  quiz: Quiz;
  onSubmit: (answers: number[], score: number, passed: boolean) => Promise<void>;
  previousSubmission?: {
    score: number;
    passed: boolean;
    answers: { questionIndex: number; selectedAnswer: number; isCorrect: boolean }[];
  };
}

export default function QuizLesson({
  quiz,
  onSubmit,
  previousSubmission,
}: QuizLessonProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(!!previousSubmission);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
    correctAnswers: boolean[];
  } | null>(
    previousSubmission
      ? {
          score: previousSubmission.score,
          passed: previousSubmission.passed,
          correctAnswers: previousSubmission.answers.map((a) => a.isCorrect),
        }
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // Verificar se todas as perguntas foram respondidas
    if (answers.some((a) => a === null)) {
      alert("Por favor, responda todas as perguntas antes de enviar.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calcular resultado
      const correctAnswers = quiz.questions.map(
        (q, i) => answers[i] === q.correctAnswer
      );
      const score = Math.round(
        (correctAnswers.filter(Boolean).length / quiz.questions.length) * 100
      );
      const passed = score >= quiz.passingScore;

      setResult({ score, passed, correctAnswers });
      setSubmitted(true);

      // Enviar para o backend
      await onSubmit(answers as number[], score, passed);
    } catch (error) {
      console.error("Erro ao enviar quiz:", error);
      alert("Erro ao enviar quiz. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers(new Array(quiz.questions.length).fill(null));
    setSubmitted(false);
    setResult(null);
  };

  const progress =
    (answers.filter((a) => a !== null).length / quiz.questions.length) * 100;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip icon={<QuizIcon />} label="Quiz" color="secondary" size="small" />
          {quiz.timeLimit && (
            <Chip
              icon={<Timer />}
              label={quiz.timeLimit + " minutos"}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {quiz.title}
        </Typography>
        {quiz.description && (
          <Typography variant="body1" color="text.secondary">
            {quiz.description}
          </Typography>
        )}
      </Box>

      {/* Result Alert */}
      {result && (
        <Alert
          severity={result.passed ? "success" : "error"}
          icon={result.passed ? <CheckCircle /> : <Cancel />}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" fontWeight="bold">
            {result.passed ? "Parabéns! Você passou!" : "Você não atingiu a nota mínima"}
          </Typography>
          <Typography variant="body2">
            Sua nota: {result.score}% (Mínimo para passar: {quiz.passingScore}%)
          </Typography>
          <Typography variant="body2">
            Acertos: {result.correctAnswers.filter(Boolean).length} de{" "}
            {quiz.questions.length}
          </Typography>
        </Alert>
      )}

      {/* Progress */}
      {!submitted && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progresso
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {answers.filter((a) => a !== null).length} de {quiz.questions.length}{" "}
              respondidas
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}

      {/* Questions */}
      <Box sx={{ mb: 3 }}>
        {quiz.questions.map((question, qIndex) => (
          <Paper
            key={qIndex}
            sx={{
              p: 3,
              mb: 2,
              border: submitted
                ? result?.correctAnswers[qIndex]
                  ? 2
                  : 2
                : 1,
              borderColor: submitted
                ? result?.correctAnswers[qIndex]
                  ? "success.main"
                  : "error.main"
                : "divider",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Questão {qIndex + 1}
            </Typography>
            <Typography variant="body1" paragraph>
              {question.question}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[qIndex] !== null ? answers[qIndex] : ""}
                onChange={(e) =>
                  handleAnswerChange(qIndex, parseInt(e.target.value))
                }
              >
                {question.options.map((option, oIndex) => {
                  const isCorrect = oIndex === question.correctAnswer;
                  const isSelected = answers[qIndex] === oIndex;
                  const showCorrectness = submitted;

                  return (
                    <FormControlLabel
                      key={oIndex}
                      value={oIndex}
                      control={<Radio disabled={submitted} />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography>{option}</Typography>
                          {showCorrectness && isCorrect && (
                            <CheckCircle
                              sx={{ color: "success.main", fontSize: 20 }}
                            />
                          )}
                          {showCorrectness && isSelected && !isCorrect && (
                            <Cancel sx={{ color: "error.main", fontSize: 20 }} />
                          )}
                        </Box>
                      }
                      sx={{
                        bgcolor: showCorrectness
                          ? isCorrect
                            ? "success.50"
                            : isSelected
                            ? "error.50"
                            : "transparent"
                          : "transparent",
                        p: 1,
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    />
                  );
                })}
              </RadioGroup>
            </FormControl>

            {/* Explanation */}
            {submitted && question.explanation && (
              <>
                <Divider sx={{ my: 2 }} />
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Explicação:
                  </Typography>
                  <Typography variant="body2">{question.explanation}</Typography>
                </Alert>
              </>
            )}
          </Paper>
        ))}
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        {!submitted ? (
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={
              answers.some((a) => a === null) || isSubmitting
            }
          >
            {isSubmitting ? "Enviando..." : "Enviar Respostas"}
          </Button>
        ) : (
          <>
            {!result?.passed && (
              <Button variant="outlined" size="large" onClick={handleRetry}>
                Tentar Novamente
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
