import { auth } from "@/auth";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import connectDB from "@/lib/db/mongodb";
import Progress from "@/models/Progress";
import Course from "@/models/Course";
import Submission from "@/models/Submission";
import Lesson from "@/models/Lesson";
import Module from "@/models/Module";
import { BookOpen, FolderKanban, TrendingUp, Play } from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

export default async function AlunoPage() {
  const session = await auth();

  let progressData = null;
  let course = null;
  let pendingSubmissions = 0;
  let lastAccessedLesson = null;
  let lastAccessedModule = null;

  try {
    await connectDB();

    course = await Course.findOne({ isActive: true });

    if (course && session?.user?.id) {
      progressData = await Progress.findOne({
        studentId: session.user.id,
        courseId: course._id,
      }).populate("currentModuleId");

      if (!progressData) {
        // Se não existe progresso, criar automaticamente
        progressData = await Progress.create({
          studentId: session.user.id,
          courseId: course._id,
          completedLessons: [],
          overallProgress: 0,
        });
      }

      // Buscar última aula acessada
      if (progressData?.lastAccessedLessonId) {
        const lessonDoc = await Lesson.findById(progressData.lastAccessedLessonId);

        if (lessonDoc) {
          lastAccessedLesson = {
            _id: lessonDoc._id.toString(),
            title: lessonDoc.title,
            moduleId: lessonDoc.moduleId,
          };
          const moduleDoc = await Module.findById(lessonDoc.moduleId);

          if (moduleDoc) {
            lastAccessedModule = {
              _id: moduleDoc._id.toString(),
              title: moduleDoc.title,
            };
          }
        }
      }

      pendingSubmissions = await Submission.countDocuments({
        studentId: session.user.id,
        status: { $in: ["pendente", "em_revisao"] },
      });
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }

  const overallProgress = progressData?.overallProgress || 0;
  const completedLessons = progressData?.completedLessons?.length || 0;

  return (
    <Box sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" fontWeight="bold">
            Olá, {session?.user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            {course ? `Bem-vindo de volta ao ${course.title}` : "Bem-vindo ao seu dashboard"}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrendingUp size={20} />
                  <CardTitle>Progresso Geral</CardTitle>
                </Stack>
                <CardDescription>Seu avanço no curso</CardDescription>
              </CardHeader>
              <CardContent>
                <Typography variant="h3" fontWeight="bold">
                  {overallProgress}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {completedLessons > 0
                    ? `${completedLessons} aulas concluídas`
                    : "Comece suas aulas"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FolderKanban size={20} />
                  <CardTitle>Projetos</CardTitle>
                </Stack>
                <CardDescription>Submissões pendentes</CardDescription>
              </CardHeader>
              <CardContent>
                <Typography variant="h3" fontWeight="bold">
                  {pendingSubmissions}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Aguardando revisão
                </Typography>
                <Link href="/aluno/projetos" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" size="sm" fullWidth sx={{ mt: 2 }}>
                    Ver Projetos
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BookOpen size={20} />
                  <CardTitle>Continue Aprendendo</CardTitle>
                </Stack>
                {lastAccessedLesson ? (
                  <CardDescription>Última aula acessada</CardDescription>
                ) : (
                  <CardDescription>Acesse o curso</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {lastAccessedLesson ? (
                  <Box>
                    <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                      {lastAccessedLesson.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      {lastAccessedModule?.title || "Módulo"}
                    </Typography>
                    <Link href={`/aluno/aula/${lastAccessedLesson._id}`} style={{ textDecoration: 'none' }}>
                      <Button fullWidth sx={{ mt: 1 }}>
                        <Play size={16} style={{ marginRight: 8 }} />
                        Continuar Estudando
                      </Button>
                    </Link>
                    <Link href="/aluno/curso" style={{ textDecoration: 'none' }}>
                      <Button variant="outline" fullWidth sx={{ mt: 1 }}>
                        Ver Todas as Aulas
                      </Button>
                    </Link>
                  </Box>
                ) : (
                  <Link href="/aluno/curso" style={{ textDecoration: 'none' }}>
                    <Button fullWidth sx={{ mt: 2 }}>
                      Acessar Curso
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
