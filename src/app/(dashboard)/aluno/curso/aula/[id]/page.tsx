"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ReactMarkdown from "react-markdown";

interface Lesson {
  _id: string;
  title: string;
  content: string;
  videoUrl?: string;
  videoFileName?: string;
  type: string;
  resources?: { title: string; url: string }[];
  moduleId: string;
}

export default function AulaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadLesson();
    checkProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadLesson() {
    try {
      const res = await fetch(`/api/modules/${id.split("_")[0]}/lessons/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLesson(data);
      }
    } catch (error) {
      console.error("Erro ao carregar aula:", error);
      // Tentar buscar de outra forma
      try {
        const coursesRes = await fetch("/api/courses");
        if (coursesRes.ok) {
          const courses = await coursesRes.json();
          if (courses.length > 0) {
            const courseRes = await fetch(`/api/courses/${courses[0]._id}`);
            if (courseRes.ok) {
              const course = await courseRes.json();
              for (const module of course.modules) {
                const lessonRes = await fetch(
                  `/api/modules/${module._id}/lessons/${id}`
                );
                if (lessonRes.ok) {
                  const data = await lessonRes.json();
                  setLesson(data);
                  break;
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Erro ao buscar aula:", err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function checkProgress() {
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        if (data.progress) {
          const completed = data.progress.completedLessons.some(
            (l: any) => (l._id || l) === id
          );
          setIsCompleted(completed);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar progresso:", error);
    }
  }

  async function markAsComplete() {
    if (!lesson) return;

    setCompleting(true);
    try {
      // Buscar o curso
      const coursesRes = await fetch("/api/courses");
      if (!coursesRes.ok) throw new Error("Erro ao buscar curso");

      const courses = await coursesRes.json();
      if (courses.length === 0) throw new Error("Nenhum curso encontrado");

      const res = await fetch("/api/progress/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: id,
          courseId: courses[0]._id,
        }),
      });

      if (res.ok) {
        setIsCompleted(true);
        router.push("/aluno/curso");
      }
    } catch (error) {
      console.error("Erro ao marcar como concluída:", error);
      alert("Erro ao marcar aula como concluída");
    } finally {
      setCompleting(false);
    }
  }

  const markdownComponents = {
    h1: ({ children }: any) => (
      <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
        {children}
      </Typography>
    ),
    h2: ({ children }: any) => (
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
        {children}
      </Typography>
    ),
    h3: ({ children }: any) => (
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
        {children}
      </Typography>
    ),
    p: ({ children }: any) => (
      <Typography variant="body1" paragraph sx={{ mb: 2, lineHeight: 1.8 }}>
        {children}
      </Typography>
    ),
    ul: ({ children }: any) => (
      <Box component="ul" sx={{ pl: 3, my: 2 }}>
        {children}
      </Box>
    ),
    ol: ({ children }: any) => (
      <Box component="ol" sx={{ pl: 3, my: 2 } as any}>
        {children}
      </Box>
    ),
    li: ({ children }: any) => (
      <Typography component="li" variant="body1" sx={{ mb: 1 }}>
        {children}
      </Typography>
    ),
    code: ({ inline, children, ...props }: any) =>
      inline ? (
        <Box
          component="code"
          sx={{
            bgcolor: "action.hover",
            px: 0.5,
            py: 0.25,
            borderRadius: 0.5,
            fontFamily: "monospace",
            fontSize: "0.875em",
          }}
          {...props}
        >
          {children}
        </Box>
      ) : (
        <Box
          component="pre"
          sx={{
            bgcolor: "action.hover",
            p: 2,
            borderRadius: 1,
            overflow: "auto",
            my: 2,
          }}
        >
          <Box
            component="code"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.875rem",
            }}
            {...props}
          >
            {children}
          </Box>
        </Box>
      ),
    blockquote: ({ children }: any) => (
      <Box
        component="blockquote"
        sx={{
          borderLeft: "4px solid",
          borderColor: "primary.main",
          pl: 2,
          py: 0.5,
          my: 2,
          fontStyle: "italic",
          color: "text.secondary",
        }}
      >
        {children}
      </Box>
    ),
    a: ({ children, href }: any) => (
      <Box
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          color: "primary.main",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {children}
      </Box>
    ),
  };

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
        <Link href="/aluno/curso" passHref>
          <Button variant="text" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
            Voltar ao Curso
          </Button>
        </Link>
        <Card>
          <CardContent sx={{ py: 8, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Aula não encontrada
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Link href="/aluno/curso" passHref>
          <Button variant="text" startIcon={<ArrowBackIcon />}>
            Voltar ao Curso
          </Button>
        </Link>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip
            label={isCompleted ? "Concluída" : "Em progresso"}
            color={isCompleted ? "success" : "default"}
            variant={isCompleted ? "filled" : "outlined"}
          />
          <Chip label={lesson.type} variant="outlined" />
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {lesson.title}
          </Typography>

          {lesson.videoUrl && (
            <Box sx={{ my: 3 }}>
              <video
                controls
                style={{
                  width: "100%",
                  maxHeight: "600px",
                  borderRadius: "8px",
                  backgroundColor: "#000"
                }}
                src={lesson.videoUrl}
              >
                Seu navegador não suporta a tag de vídeo.
              </video>
              {lesson.videoFileName && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  {lesson.videoFileName}
                </Typography>
              )}
            </Box>
          )}

          <Box sx={{ my: 4 }}>
            <ReactMarkdown components={markdownComponents}>
              {lesson.content}
            </ReactMarkdown>
          </Box>

          {lesson.resources && lesson.resources.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recursos Adicionais
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {lesson.resources.map((resource, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "action.hover"
                      }
                    }}
                  >
                    <CardContent sx={{ py: 2, px: 3 }}>
                      <Box
                        component="a"
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          textDecoration: "none",
                          color: "inherit"
                        }}
                      >
                        <OpenInNewIcon sx={{ color: "text.secondary" }} fontSize="small" />
                        <Typography variant="body1" sx={{ flex: 1 }}>
                          {resource.title}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {!isCompleted ? (
                <Button
                  variant="contained"
                  size="large"
                  onClick={markAsComplete}
                  disabled={completing}
                  startIcon={<CheckCircleIcon />}
                >
                  {completing ? "Marcando..." : "Marcar como Concluída"}
                </Button>
              ) : (
                <Link href="/aluno/curso" passHref>
                  <Button variant="outlined" size="large">
                    Voltar ao Curso
                  </Button>
                </Link>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
