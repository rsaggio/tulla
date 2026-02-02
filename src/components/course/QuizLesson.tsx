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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(quiz.questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(!!previousSubmission);
  const [result, setResult] = useState<{
    score: number;
    passed: boolean;
  } | null>(
    previousSubmission
      ? {
          score: previousSubmission.score,
          passed: previousSubmission.passed,
        }
      : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (answerIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (answers.some((a) => a === null)) {
      alert("Por favor, responda todas as perguntas antes de enviar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const correctCount = quiz.questions.filter(
        (q, i) => answers[i] === q.correctAnswer
      ).length;
      const score = Math.round(
        (correctCount / quiz.questions.length) * 100
      );
      const passed = score >= quiz.passingScore;

      setResult({ score, passed });
      setSubmitted(true);

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
    setCurrentQuestion(0);
    setSubmitted(false);
    setResult(null);
  };

  const allQuestionsAnswered = answers.every((a) => a !== null);
  const question = quiz.questions[currentQuestion];

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
          {!result.passed && (
            <Typography variant="body2">
              Continue estudando e tente novamente!
            </Typography>
          )}
        </Alert>
      )}

      {/* Progress Bar */}
      {!submitted && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Pergunta {currentQuestion + 1} de {quiz.questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {answers.filter((a) => a !== null).length} de {quiz.questions.length}{" "}
              respondidas
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={((currentQuestion + 1) / quiz.questions.length) * 100}
          />
        </Box>
      )}

      {/* Question Card - only show when not submitted */}
      {!submitted && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Questão {currentQuestion + 1}
            </Typography>
            <Typography variant="body1" paragraph>
              {question.question}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[currentQuestion] !== null ? answers[currentQuestion] : ""}
                onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
              >
                {question.options.map((option, oIndex) => (
                  <FormControlLabel
                    key={oIndex}
                    value={oIndex}
                    control={<Radio />}
                    label={<Typography>{option}</Typography>}
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      mb: 0.5,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>

          {/* Navigation Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              {currentQuestion < quiz.questions.length - 1 && (
                <Button variant="outlined" onClick={handleNext}>
                  Próxima
                </Button>
              )}

              {currentQuestion === quiz.questions.length - 1 && (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered || isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Finalizar Quiz"}
                </Button>
              )}
            </Box>
          </Box>

          {/* Question Navigator */}
          <Box sx={{ mt: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Navegação rápida:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
              {quiz.questions.map((_, index) => {
                const isAnswered = answers[index] !== null;
                const isCurrent = index === currentQuestion;

                return (
                  <Button
                    key={index}
                    variant={isCurrent ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setCurrentQuestion(index)}
                    sx={{ minWidth: 40 }}
                  >
                    {index + 1}
                    {isAnswered && " ✓"}
                  </Button>
                );
              })}
            </Box>
          </Box>
        </>
      )}

      {/* Actions after submit */}
      {submitted && !result?.passed && (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" size="large" onClick={handleRetry}>
            Tentar Novamente
          </Button>
        </Box>
      )}
    </Box>
  );
}
