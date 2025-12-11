"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizEditorProps {
  value: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

export default function QuizEditor({ value, onChange }: QuizEditorProps) {
  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    };
    onChange([...value, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = value.filter((_, i) => i !== index);
    onChange(newQuestions);
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, fieldValue: any) => {
    const newQuestions = [...value];
    newQuestions[index] = { ...newQuestions[index], [field]: fieldValue };
    onChange(newQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, optionValue: string) => {
    const newQuestions = [...value];
    const newOptions = [...newQuestions[questionIndex].options];
    newOptions[optionIndex] = optionValue;
    newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
    onChange(newQuestions);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" fontWeight="medium">
          Perguntas do Quiz
        </Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={addQuestion}>
          Adicionar Pergunta
        </Button>
      </Box>

      {value.length === 0 && (
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Nenhuma pergunta adicionada. Clique em "Adicionar Pergunta" para começar.
            </Typography>
          </CardContent>
        </Card>
      )}

      {value.map((question, questionIndex) => (
        <Card key={questionIndex} variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="body1" fontWeight="bold">
                Pergunta {questionIndex + 1}
              </Typography>
              <IconButton
                color="error"
                size="small"
                onClick={() => removeQuestion(questionIndex)}
                aria-label="Remover pergunta"
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                fullWidth
                label="Pergunta"
                value={question.question}
                onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                placeholder="Digite a pergunta aqui..."
                required
                multiline
                rows={2}
              />

              <Box>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Opções de Resposta (selecione a correta)
                </Typography>
                <RadioGroup
                  value={question.correctAnswer}
                  onChange={(e) => updateQuestion(questionIndex, "correctAnswer", parseInt(e.target.value))}
                >
                  {question.options.map((option, optionIndex) => (
                    <Box key={optionIndex} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <FormControlLabel
                        value={optionIndex}
                        control={<Radio />}
                        label=""
                        sx={{ mr: 1 }}
                      />
                      <TextField
                        fullWidth
                        size="small"
                        label={`Opção ${String.fromCharCode(65 + optionIndex)}`}
                        value={option}
                        onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                        placeholder={`Digite a opção ${String.fromCharCode(65 + optionIndex)}...`}
                        required
                      />
                    </Box>
                  ))}
                </RadioGroup>
              </Box>

              <TextField
                fullWidth
                label="Explicação da Resposta (opcional)"
                value={question.explanation || ""}
                onChange={(e) => updateQuestion(questionIndex, "explanation", e.target.value)}
                placeholder="Explique por que esta é a resposta correta..."
                multiline
                rows={2}
              />
            </Box>
          </CardContent>
        </Card>
      ))}

      {value.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Adicione pelo menos uma pergunta ao quiz
        </Typography>
      )}
    </Box>
  );
}
