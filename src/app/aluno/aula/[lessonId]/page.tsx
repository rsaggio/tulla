"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
} from "@mui/icons-material";
import CourseSidebar from "@/components/course/CourseSidebar";
import VideoLesson from "@/components/course/VideoLesson";
import TextLesson from "@/components/course/TextLesson";
import QuizLesson from "@/components/course/QuizLesson";
import ActivityLesson from "@/components/course/ActivityLesson";

interface Lesson {
  _id: string;
  title: string;
  type: "teoria" | "video" | "leitura" | "quiz" | "activity";
  duration?: number;
  order: number;
}

interface Module {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [quizSubmission, setQuizSubmission] = useState<any>(null);
  const [activitySubmission, setActivitySubmission] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    loadLessonData();
    loadCourseData();
  }, [lessonId]);

  const loadLessonData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/lessons/" + lessonId);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao carregar aula");
      }

      setLesson(data.lesson);
      setQuiz(data.quiz);
      setActivity(data.activity);
      setQuizSubmission(data.quizSubmission);
      setActivitySubmission(data.activitySubmission);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseData = async () => {
    try {
      // Buscar cursos
      const coursesRes = await fetch("/api/courses");
      const coursesData = await coursesRes.json();

      if (coursesData && coursesData.length > 0) {
        const courseId = coursesData[0]._id;

        // Buscar detalhes do curso com módulos e lessons
        const courseDetailRes = await fetch("/api/courses/" + courseId);
        const courseDetail = await courseDetailRes.json();

        console.log("[DEBUG] Course detail:", courseDetail);
        console.log("[DEBUG] Modules:", courseDetail.modules);

        if (courseDetail.modules) {
          setModules(courseDetail.modules);
        }
      }

      // Buscar progresso
      const progressRes = await fetch("/api/progress");
      const progressData = await progressRes.json();

      if (progressData.progress) {
        const completed = progressData.progress.completedLessons.map(
          (l: any) => l._id || l
        );
        setCompletedLessons(completed);
        setIsCompleted(completed.includes(lessonId));
      }
    } catch (err) {
      console.error("Erro ao carregar dados do curso:", err);
    }
  };

  const handleMarkComplete = async () => {
    try {
      const res = await fetch("/api/lessons/" + lessonId + "/complete", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Erro ao marcar aula como completa");
      }

      setIsCompleted(true);
      setCompletedLessons((prev) => [...prev, lessonId]);
      alert("Aula marcada como completa!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleQuizSubmit = async (
    answers: number[],
    score: number,
    passed: boolean
  ) => {
    try {
      const res = await fetch("/api/quiz/" + quiz._id + "/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers, score, passed }),
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar quiz");
      }

      if (passed) {
        setIsCompleted(true);
        setCompletedLessons((prev) => [...prev, lessonId]);
      }
    } catch (err: any) {
      throw err;
    }
  };

  const handleActivitySubmit = async (content: string) => {
    try {
      const res = await fetch("/api/activity/" + activity._id + "/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao enviar atividade");
      }

      // Recarregar dados da atividade
      await loadLessonData();
    } catch (err: any) {
      throw err;
    }
  };

  const handleLessonClick = (moduleId: string, newLessonId: string) => {
    router.push("/aluno/aula/" + newLessonId);
  };

  const findAdjacentLessons = () => {
    let allLessons: { moduleId: string; lessonId: string }[] = [];

    modules.forEach((module) => {
      if (module.lessons && Array.isArray(module.lessons)) {
        module.lessons
          .sort((a, b) => a.order - b.order)
          .forEach((lesson) => {
            if (lesson && lesson._id) {
              allLessons.push({
                moduleId: module._id,
                lessonId: lesson._id,
              });
            }
          });
      }
    });

    const currentIndex = allLessons.findIndex((l) => l.lessonId === lessonId);

    return {
      previous: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next:
        currentIndex < allLessons.length - 1
          ? allLessons[currentIndex + 1]
          : null,
    };
  };

  const { previous, next } = findAdjacentLessons();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !lesson) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Aula não encontrada"}</Alert>
        <Button
          variant="outlined"
          onClick={() => router.push("/aluno/curso")}
          sx={{ mt: 2 }}
        >
          Voltar ao Curso
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <CourseSidebar
        modules={modules}
        currentLessonId={lessonId}
        completedLessons={completedLessons}
        onLessonClick={handleLessonClick}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Navigation Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() =>
                previous
                  ? handleLessonClick(previous.moduleId, previous.lessonId)
                  : router.push("/aluno/curso")
              }
            >
              {previous ? "Aula Anterior" : "Voltar ao Curso"}
            </Button>

            {next && (
              <Button
                variant="outlined"
                endIcon={<ArrowForward />}
                onClick={() => handleLessonClick(next.moduleId, next.lessonId)}
              >
                Próxima Aula
              </Button>
            )}
          </Box>

          {/* Lesson Content */}
          {lesson.type === "video" && (
            <VideoLesson
              title={lesson.title}
              videoUrl={lesson.videoUrl}
              content={lesson.content}
              duration={lesson.duration}
              resources={lesson.resources}
            />
          )}

          {(lesson.type === "teoria" || lesson.type === "leitura") && (
            <TextLesson
              title={lesson.title}
              content={lesson.content}
              type={lesson.type}
              duration={lesson.duration}
              resources={lesson.resources}
            />
          )}

          {lesson.type === "quiz" && quiz && (
            <QuizLesson
              quiz={quiz}
              onSubmit={handleQuizSubmit}
              previousSubmission={quizSubmission}
            />
          )}

          {lesson.type === "activity" && activity && (
            <ActivityLesson
              activity={activity}
              onSubmit={handleActivitySubmit}
              previousSubmission={activitySubmission}
            />
          )}

          {/* Mark as Complete Button */}
          {(lesson.type === "video" ||
            lesson.type === "teoria" ||
            lesson.type === "leitura") &&
            !isCompleted && (
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CheckCircle />}
                  onClick={handleMarkComplete}
                >
                  Marcar como Completa
                </Button>
              </Box>
            )}

          {isCompleted && (
            <Box sx={{ mt: 4 }}>
              <Alert severity="success" icon={<CheckCircle />}>
                Aula completa! Parabéns!
              </Alert>
            </Box>
          )}

          {/* Bottom Navigation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 6,
              pt: 3,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Button
              variant="text"
              startIcon={<ArrowBack />}
              onClick={() =>
                previous
                  ? handleLessonClick(previous.moduleId, previous.lessonId)
                  : router.push("/aluno/curso")
              }
            >
              {previous ? "Aula Anterior" : "Voltar ao Curso"}
            </Button>

            {next && (
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={() => handleLessonClick(next.moduleId, next.lessonId)}
              >
                Próxima Aula
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
