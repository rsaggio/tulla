"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MarkdownEditor from "@/components/MarkdownEditor";
import QuizEditor, { QuizQuestion } from "@/components/QuizEditor";

export default function NovaAulaPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const router = useRouter();
  const { courseId, moduleId } = use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [videoSource, setVideoSource] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lessonType, setLessonType] = useState("teoria");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [activityDescription, setActivityDescription] = useState("");
  const [activityInstructions, setActivityInstructions] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const lessonType = formData.get("type") as string;

    // Validar quiz
    if (lessonType === "quiz" && quizQuestions.length === 0) {
      setError("Adicione pelo menos uma pergunta ao quiz");
      setLoading(false);
      return;
    }

    // Validar activity
    if (lessonType === "activity" && !activityInstructions.trim()) {
      setError("Preencha as instruções do exercício prático");
      setLoading(false);
      return;
    }

    console.log("=== FRONTEND: Criando aula ===");
    console.log("Tipo da aula:", lessonType);
    console.log("Arquivo de vídeo selecionado:", videoFile ? videoFile.name : "nenhum");

    try {
      let videoUrl = undefined;
      let videoFileName = undefined;

      if (lessonType === "video") {
        if (videoSource === "url" && videoUrlInput) {
          // Usar URL direta (Vimeo/YouTube)
          videoUrl = videoUrlInput;
        } else if (videoSource === "upload" && videoFile) {
          // Fazer upload do arquivo
          console.log("Iniciando upload do vídeo...");
          setUploading(true);
          setUploadProgress(0);

          const uploadFormData = new FormData();
          uploadFormData.append("video", videoFile);

          const uploadRes = await fetch("/api/upload/video", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            throw new Error(errorData.error || "Erro ao fazer upload do vídeo");
          }

          const uploadData = await uploadRes.json();
          videoUrl = uploadData.videoUrl;
          videoFileName = uploadData.fileName;
          setUploading(false);
          setUploadProgress(100);
        }
      }

      const lessonData: any = {
        title: formData.get("title") as string,
        content: content,
        type: lessonType,
        order: parseInt(formData.get("order") as string),
        videoUrl,
        videoFileName,
        quiz: lessonType === "quiz" ? quizQuestions : undefined,
        moduleId,
      };

      if (lessonType === "activity") {
        lessonData.activity = {
          description: activityDescription || content,
          instructions: activityInstructions,
        };
      }

      const res = await fetch(`/api/modules/${moduleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar aula");
      }

      router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
    } catch (error) {
      console.error("Erro:", error);
      setError(error instanceof Error ? error.message : "Erro ao criar aula. Tente novamente.");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`} passHref>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Nova Aula
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Crie uma nova aula para o módulo
          </Typography>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Informações da Aula
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Preencha os dados da nova aula
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                fullWidth
                label="Título da Aula"
                name="title"
                placeholder="Ex: Variáveis e Tipos de Dados"
                required
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Tipo"
                    name="type"
                    value={lessonType}
                    onChange={(e) => setLessonType(e.target.value)}
                    required
                  >
                    <MenuItem value="teoria">Teoria</MenuItem>
                    <MenuItem value="video">Vídeo</MenuItem>
                    <MenuItem value="quiz">Quiz</MenuItem>
                    <MenuItem value="activity">Exercício Prático</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ordem"
                    name="order"
                    type="number"
                    placeholder="Ex: 1"
                    required
                    defaultValue="1"
                  />
                </Grid>
              </Grid>

              {lessonType === "video" && (
                <Box>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                    Vídeo da Aula
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <Button
                      variant={videoSource === "url" ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setVideoSource("url")}
                    >
                      URL do Vídeo
                    </Button>
                    <Button
                      variant={videoSource === "upload" ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setVideoSource("upload")}
                    >
                      Upload de Arquivo
                    </Button>
                  </Box>

                  {videoSource === "url" ? (
                    <Box>
                      <TextField
                        fullWidth
                        label="URL do Vídeo (Vimeo ou YouTube)"
                        placeholder="Ex: https://vimeo.com/123456789"
                        value={videoUrlInput}
                        onChange={(e) => setVideoUrlInput(e.target.value)}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                        Cole a URL do Vimeo ou YouTube
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 1 }}
                      >
                        {videoFile ? "Alterar Vídeo" : "Fazer Upload do Vídeo"}
                        <input
                          type="file"
                          hidden
                          accept="video/mp4,video/webm,video/ogg,video/quicktime"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setVideoFile(file);
                            }
                          }}
                        />
                      </Button>
                      {videoFile && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Arquivo selecionado: {videoFile.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Tamanho: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                          </Typography>
                        </Box>
                      )}
                      {uploading && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Fazendo upload do vídeo...
                          </Typography>
                          <LinearProgress variant="determinate" value={uploadProgress} />
                        </Box>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                        Formatos aceitos: MP4, WebM, OGG, MOV. Tamanho máximo: 500MB
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {lessonType === "quiz" && (
                <QuizEditor value={quizQuestions} onChange={setQuizQuestions} />
              )}

              {lessonType === "activity" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Configurações do Exercício Prático
                  </Typography>
                  <TextField
                    fullWidth
                    label="Descrição da Atividade"
                    placeholder="Descreva o objetivo do exercício..."
                    value={activityDescription}
                    onChange={(e) => setActivityDescription(e.target.value)}
                    multiline
                    rows={3}
                  />
                  <TextField
                    fullWidth
                    label="Instruções"
                    placeholder="Instruções detalhadas para o aluno..."
                    value={activityInstructions}
                    onChange={(e) => setActivityInstructions(e.target.value)}
                    multiline
                    rows={4}
                    required
                  />
                </Box>
              )}

              <MarkdownEditor
                value={content}
                onChange={setContent}
                label={lessonType === "quiz" ? "Conteúdo Introdutório (Markdown - Opcional)" : "Conteúdo (Markdown)"}
                placeholder="# Título da Seção&#10;&#10;Escreva o conteúdo da aula em Markdown...&#10;&#10;```javascript&#10;const exemplo = 'código';&#10;```"
                required={lessonType !== "quiz" && lessonType !== "activity"}
                rows={20}
                name="content"
              />

              <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ flex: 1 }}
                >
                  {loading ? "Criando..." : "Criar Aula"}
                </Button>
                <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`} passHref>
                  <Button variant="outlined">
                    Cancelar
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
