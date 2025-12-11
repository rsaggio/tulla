"use client";

import { useState, useEffect, use } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MarkdownEditor from "@/components/MarkdownEditor";
import QuizEditor, { QuizQuestion } from "@/components/QuizEditor";

interface Lesson {
  _id: string;
  title: string;
  content: string;
  type: string;
  order: number;
  videoUrl?: string;
  videoFileName?: string;
  quiz?: QuizQuestion[];
  resources?: { title: string; url: string }[];
  moduleId: string;
}

export default function EditarAulaPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
}) {
  const router = useRouter();
  const { courseId, moduleId, lessonId } = use(params);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lessonType, setLessonType] = useState("teoria");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLesson() {
    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        setLesson(data);
        setContent(data.content || "");
        setLessonType(data.type || "teoria");
        setQuizQuestions(data.quiz || []);
      } else {
        setError("Aula não encontrada");
      }
    } catch (error) {
      console.error("Erro ao carregar aula:", error);
      setError("Erro ao carregar aula");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const lessonType = formData.get("type") as string;

    // Validar quiz
    if (lessonType === "quiz" && quizQuestions.length === 0) {
      setError("Adicione pelo menos uma pergunta ao quiz");
      setSaving(false);
      return;
    }

    try {
      let videoUrl = lesson?.videoUrl;
      let videoFileName = lesson?.videoFileName;

      // Se for tipo vídeo e tiver novo arquivo, fazer upload
      if (lessonType === "video" && videoFile) {
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

      const lessonData = {
        title: formData.get("title") as string,
        content: content,
        type: lessonType,
        order: parseInt(formData.get("order") as string),
        videoUrl,
        videoFileName,
        quiz: lessonType === "quiz" ? quizQuestions : undefined,
      };

      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar aula");
      }

      router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
    } catch (error) {
      console.error("Erro:", error);
      setError(error instanceof Error ? error.message : "Erro ao atualizar aula. Tente novamente.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
      } else {
        alert("Erro ao excluir aula");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir aula");
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lesson) {
    return (
      <Box sx={{ maxWidth: 900 }}>
        <Card>
          <CardContent sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {error || "Aula não encontrada"}
            </Typography>
            <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`} passHref>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Voltar ao Módulo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </Box>
    );
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
            Editar Aula
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Atualize o conteúdo da aula
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Informações da Aula
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Modifique o conteúdo e propriedades da aula
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
                defaultValue={lesson.title}
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
                    defaultValue={lesson.order}
                    placeholder="Ex: 1"
                    required
                  />
                </Grid>
              </Grid>

              {lessonType === "video" && (
                <Box>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                    Vídeo da Aula
                  </Typography>
                  {lesson.videoUrl && !videoFile && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Vídeo atual: {lesson.videoFileName || "vídeo.mp4"}
                      </Typography>
                      <video
                        controls
                        style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
                        src={lesson.videoUrl}
                      >
                        Seu navegador não suporta a tag de vídeo.
                      </video>
                    </Box>
                  )}
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mb: 1 }}
                  >
                    {videoFile ? "Alterar Vídeo" : lesson.videoUrl ? "Substituir Vídeo" : "Fazer Upload do Vídeo"}
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
                        Novo arquivo selecionado: {videoFile.name}
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

              {lessonType === "quiz" && (
                <QuizEditor value={quizQuestions} onChange={setQuizQuestions} />
              )}

              <MarkdownEditor
                value={content}
                onChange={setContent}
                label={lessonType === "quiz" ? "Conteúdo Introdutório (Markdown - Opcional)" : "Conteúdo (Markdown)"}
                placeholder="# Título da Seção&#10;&#10;Escreva o conteúdo da aula em Markdown...&#10;&#10;```javascript&#10;const exemplo = 'código';&#10;```"
                required={lessonType !== "quiz"}
                rows={20}
                name="content"
              />

              <Box sx={{ display: "flex", gap: 2, pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  sx={{ flex: 1 }}
                >
                  {saving ? "Salvando..." : "Salvar Alterações"}
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

      <Card sx={{ borderColor: "error.main", borderWidth: 1 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="error" gutterBottom>
            Zona de Perigo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ações irreversíveis que afetam esta aula
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Excluir Aula
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remove a aula permanentemente
              </Typography>
            </Box>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Excluir Aula
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
