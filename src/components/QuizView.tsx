"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export default function QuizView({ questions, onComplete }: QuizViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);

    const correctCount = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;

    if (onComplete) {
      onComplete(correctCount, questions.length);
    }
  };

  const calculateScore = () => {
    const correctCount = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer
    ).length;
    return {
      correct: correctCount,
      total: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100),
    };
  };

  const isAnswerCorrect = (questionIndex: number, answerIndex: number) => {
    return answerIndex === questions[questionIndex].correctAnswer;
  };

  const isAnswerSelected = (questionIndex: number, answerIndex: number) => {
    return selectedAnswers[questionIndex] === answerIndex;
  };

  const allQuestionsAnswered = selectedAnswers.every((answer) => answer !== null);

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Nenhuma pergunta disponível neste quiz.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const score = submitted ? calculateScore() : null;

  return (
    <Box>
      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Pergunta {currentQuestion + 1} de {questions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}% completo
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={((currentQuestion + 1) / questions.length) * 100}
        />
      </Box>

      {/* Results Summary */}
      {showResults && score && (
        <Alert
          severity={score.percentage >= 70 ? "success" : "warning"}
          icon={score.percentage >= 70 ? <CheckCircleIcon /> : <CancelIcon />}
          sx={{ mb: 3 }}
        >
          <Typography variant="body1" fontWeight="bold">
            Você acertou {score.correct} de {score.total} perguntas ({score.percentage}%)
          </Typography>
          <Typography variant="body2">
            {score.percentage >= 70
              ? "Parabéns! Você foi aprovado no quiz!"
              : "Continue estudando. Você pode refazer o quiz para melhorar sua nota."}
          </Typography>
        </Alert>
      )}

      {/* Question Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {questions[currentQuestion].question}
          </Typography>

          <FormControl component="fieldset" sx={{ width: "100%", mt: 3 }}>
            <RadioGroup
              value={selectedAnswers[currentQuestion] ?? ""}
              onChange={(e) => handleAnswerSelect(parseInt(e.target.value))}
            >
              {questions[currentQuestion].options.map((option, index) => {
                const isCorrect = isAnswerCorrect(currentQuestion, index);
                const isSelected = isAnswerSelected(currentQuestion, index);
                const showFeedback = submitted;

                return (
                  <Box
                    key={index}
                    sx={{
                      mb: 1,
                      p: 2,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: showFeedback
                        ? isCorrect
                          ? "success.main"
                          : isSelected
                          ? "error.main"
                          : "divider"
                        : "divider",
                      bgcolor: showFeedback
                        ? isCorrect
                          ? "success.lighter"
                          : isSelected
                          ? "error.lighter"
                          : "transparent"
                        : "transparent",
                    }}
                  >
                    <FormControlLabel
                      value={index}
                      control={<Radio disabled={submitted} />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="body1">{option}</Typography>
                          {showFeedback && isCorrect && (
                            <CheckCircleIcon color="success" fontSize="small" />
                          )}
                          {showFeedback && isSelected && !isCorrect && (
                            <CancelIcon color="error" fontSize="small" />
                          )}
                        </Box>
                      }
                      sx={{ width: "100%" }}
                    />
                  </Box>
                );
              })}
            </RadioGroup>
          </FormControl>

          {/* Explanation */}
          {submitted && questions[currentQuestion].explanation && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Explicação:
              </Typography>
              <Typography variant="body2">
                {questions[currentQuestion].explanation}
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Anterior
        </Button>

        <Box sx={{ display: "flex", gap: 2 }}>
          {currentQuestion < questions.length - 1 && (
            <Button variant="outlined" onClick={handleNext}>
              Próxima
            </Button>
          )}

          {currentQuestion === questions.length - 1 && !submitted && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered}
            >
              Finalizar Quiz
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
          {questions.map((_, index) => {
            const isAnswered = selectedAnswers[index] !== null;
            const isCurrent = index === currentQuestion;
            const isCorrectAnswer = submitted && selectedAnswers[index] === questions[index].correctAnswer;
            const isWrongAnswer = submitted && selectedAnswers[index] !== null && !isCorrectAnswer;

            return (
              <Button
                key={index}
                variant={isCurrent ? "contained" : "outlined"}
                size="small"
                onClick={() => setCurrentQuestion(index)}
                sx={{
                  minWidth: 40,
                  bgcolor: submitted
                    ? isCorrectAnswer
                      ? "success.main"
                      : isWrongAnswer
                      ? "error.main"
                      : undefined
                    : undefined,
                  color: submitted && (isCorrectAnswer || isWrongAnswer) ? "white" : undefined,
                  "&:hover": {
                    bgcolor: submitted
                      ? isCorrectAnswer
                        ? "success.dark"
                        : isWrongAnswer
                        ? "error.dark"
                        : undefined
                      : undefined,
                  },
                }}
              >
                {index + 1}
                {isAnswered && !submitted && " ✓"}
              </Button>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
