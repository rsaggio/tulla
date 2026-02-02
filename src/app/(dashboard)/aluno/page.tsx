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
import User from "@/models/User";
import Cohort from "@/models/Cohort";
import LiveClass from "@/models/LiveClass";
import { BookOpen, FolderKanban, TrendingUp, Play, Users, Video } from "lucide-react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

export default async function AlunoPage() {
  const session = await auth();

  let progressData = null;
  let course: any = null;
  let pendingSubmissions = 0;
  let lastAccessedLesson = null;
  let lastAccessedModule = null;
  let cohortData = null;
  let classmatesCount = 0;
  let recentLiveClasses: any[] = [];

  try {
    await connectDB();

    course = await Course.findOne({ isActive: true });

    if (course && session?.user?.id) {
      progressData = await Progress.findOne({
        studentId: session.user.id,
        courseId: course._id,
      }).populate("currentModuleId");

      if (!progressData) {
        progressData = await Progress.create({
          studentId: session.user.id,
          courseId: course._id,
          completedLessons: [],
          overallProgress: 0,
        });
      }

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

      const user = await User.findById(session.user.id).select("enrolledCohorts");

      if (user && user.enrolledCohorts && user.enrolledCohorts.length > 0) {
        let cohort = await Cohort.findOne({
          _id: { $in: user.enrolledCohorts },
          status: "active",
        }).select("name code students");

        if (!cohort) {
          cohort = await Cohort.findOne({
            _id: { $in: user.enrolledCohorts },
          }).select("name code students status");
        }

        if (cohort) {
          cohortData = {
            _id: cohort._id.toString(),
            name: cohort.name,
            code: cohort.code,
            topStudents: [] as any[],
          };
          classmatesCount = cohort.students ? cohort.students.length - 1 : 0;

          // Buscar progresso de todos os alunos para o ranking
          if (course && cohort.students && cohort.students.length > 0) {
            const studentsWithProgress = await Promise.all(
              cohort.students.map(async (studentId: any) => {
                const student = await User.findById(studentId).select("name profileImage");
                const progress = await Progress.findOne({
                  studentId: studentId,
                  courseId: course._id,
                }).select("completedLessons");

                return {
                  _id: studentId.toString(),
                  name: student?.name || "Aluno",
                  profileImage: student?.profileImage,
                  completedLessons: progress?.completedLessons?.length || 0,
                };
              })
            );

            // Ordenar por atividades concluídas e pegar top 3
            studentsWithProgress.sort((a, b) => b.completedLessons - a.completedLessons);
            cohortData.topStudents = studentsWithProgress.slice(0, 3);
          }

          const liveClasses = await LiveClass.find({
            cohortId: cohort._id,
          })
            .populate("instructor", "name profileImage")
            .sort({ date: -1 })
            .limit(3)
            .lean();

          recentLiveClasses = liveClasses.map((lc: any) => ({
            _id: lc._id.toString(),
            title: lc.title,
            date: lc.date,
            recordingUrl: lc.recordingUrl,
            instructor: lc.instructor,
            duration: lc.duration,
          }));
        }
      }
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }

  const overallProgress = progressData?.overallProgress || 0;
  const completedLessons = progressData?.completedLessons?.length || 0;

  return (
    <Box sx={{ py: { xs: 1, sm: 2, md: 3 } }}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Header */}
          <Grid item xs={12}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ mb: 0.5, fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.5rem' } }}
            >
              Olá, {session?.user?.name}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
              {course ? `Bem-vindo de volta ao ${course.title}` : "Bem-vindo ao seu dashboard"}
            </Typography>
          </Grid>
          {/* Continue Aprendendo - Card Destaque com Gradiente */}
          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                minHeight: { xs: 'auto', sm: '280px' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                p: { xs: 2, sm: 3, md: 4 },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-10%',
                  right: '-10%',
                  width: '400px',
                  height: '400px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                },
              }}
            >
              <Stack spacing={{ xs: 2, sm: 3 }} sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.25)',
                      p: { xs: 1, sm: 1.5, md: 2 },
                      borderRadius: 2,
                      display: 'flex',
                      backdropFilter: 'blur(10px)',
                      flexShrink: 0,
                    }}
                  >
                    <BookOpen size={24} strokeWidth={2} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight="bold" sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.75rem' } }}>
                      Continue Aprendendo
                    </Typography>
                    <Typography sx={{ opacity: 0.95, mt: 0.25, fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                      {lastAccessedLesson ? "Retome de onde parou" : "Comece sua jornada"}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ flex: 1 }} />

                {lastAccessedLesson ? (
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      p: { xs: 1.5, sm: 2, md: 3 },
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <Typography sx={{ opacity: 0.9, textTransform: 'uppercase', fontWeight: 600, letterSpacing: 1, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                      Última aula
                    </Typography>
                    <Typography fontWeight="bold" sx={{ mt: 0.5, mb: 0.25, fontSize: { xs: '0.85rem', sm: '1rem', md: '1.15rem' } }}>
                      {lastAccessedLesson.title}
                    </Typography>
                    <Typography sx={{ opacity: 0.9, mb: { xs: 1.5, sm: 2, md: 3 }, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                      {lastAccessedModule?.title || "Módulo"}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                      <Link href={`/aluno/aula/${lastAccessedLesson._id}`} style={{ textDecoration: 'none', flex: 1 }}>
                        <Button
                          fullWidth
                          sx={{
                            bgcolor: 'white',
                            color: '#667eea',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.95)', transform: 'translateY(-2px)' },
                            fontWeight: 'bold',
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                        >
                          <Play size={16} style={{ marginRight: 6 }} />
                          Continuar Estudando
                        </Button>
                      </Link>
                      <Link href="/aluno/curso" style={{ textDecoration: 'none', flex: 1 }}>
                        <Button
                          fullWidth
                          sx={{
                            bgcolor: 'transparent',
                            color: 'white',
                            border: '2px solid rgba(255, 255, 255, 0.4)',
                            '&:hover': {
                              bgcolor: 'rgba(255, 255, 255, 0.15)',
                              borderColor: 'rgba(255, 255, 255, 0.6)',
                            },
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                            fontWeight: 600,
                          }}
                        >
                          Todas as Aulas
                        </Button>
                      </Link>
                    </Stack>
                  </Box>
                ) : (
                  <Link href="/aluno/curso" style={{ textDecoration: 'none' }}>
                    <Button
                      fullWidth
                      sx={{
                        bgcolor: 'white',
                        color: '#667eea',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.95)' },
                        fontWeight: 'bold',
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    >
                      Começar Curso
                    </Button>
                  </Link>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Progresso - Card com gradiente rosa */}
          <Grid item xs={12} sm={6} lg={4}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                minHeight: { xs: 'auto', sm: '280px' },
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 3,
                p: { xs: 2, sm: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: { xs: 2, sm: 3 } }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    p: { xs: 1, sm: 1.5 },
                    borderRadius: 2,
                    display: 'flex',
                    backdropFilter: 'blur(10px)',
                    flexShrink: 0,
                  }}
                >
                  <TrendingUp size={24} strokeWidth={2} />
                </Box>
                <Box>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.95rem', sm: '1.15rem' } }}>
                    Seu Progresso
                  </Typography>
                  <Typography sx={{ opacity: 0.95, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
                    Continue assim!
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                    fontWeight: 900,
                    lineHeight: 1,
                    textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  }}
                >
                  {overallProgress}%
                </Typography>
                <Typography sx={{ mt: 1.5, opacity: 0.95, fontWeight: 500, fontSize: { xs: '0.85rem', sm: '1rem', md: '1.15rem' } }}>
                  {completedLessons > 0
                    ? `${completedLessons} ${completedLessons === 1 ? 'aula concluída' : 'aulas concluídas'}`
                    : "Comece suas aulas"}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Minha Turma */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                minHeight: { xs: 'auto', sm: '200px' },
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                borderRadius: 3,
                p: { xs: 2.5, sm: 3 },
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <Stack spacing={2} sx={{ height: '100%' }}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    width: 'fit-content',
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                  }}
                >
                  <Users size={24} strokeWidth={2} />
                </Box>
                <Box>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.95rem', sm: '1.15rem' } }}>
                    Minha Turma
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {cohortData ? cohortData.name : "Sem turma ativa"}
                  </Typography>
                </Box>

                {cohortData ? (
                  <>
                    {cohortData.topStudents && cohortData.topStudents.length > 0 ? (
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="caption" fontWeight="bold" sx={{ mb: 1.5, textAlign: 'center', opacity: 0.8 }}>
                          TOP 3 DO RANKING
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent="center" alignItems="flex-end" sx={{ mb: 2 }}>
                          {/* 2º Lugar */}
                          {cohortData.topStudents[1] && (
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                              <Box
                                sx={{
                                  bgcolor: 'rgba(192, 192, 192, 0.4)',
                                  borderRadius: 2,
                                  p: 1,
                                  mb: 1,
                                  height: '60px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography variant="h4" sx={{ mb: -0.5 }}>🥈</Typography>
                                <Typography variant="caption" fontWeight="bold">
                                  {cohortData.topStudents[1].completedLessons}
                                </Typography>
                              </Box>
                              <Typography variant="caption" fontWeight="600" sx={{ display: 'block', fontSize: '0.65rem' }}>
                                {cohortData.topStudents[1].name.split(' ')[0]}
                              </Typography>
                            </Box>
                          )}

                          {/* 1º Lugar */}
                          {cohortData.topStudents[0] && (
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                              <Box
                                sx={{
                                  bgcolor: 'rgba(255, 215, 0, 0.4)',
                                  borderRadius: 2,
                                  p: 1,
                                  mb: 1,
                                  height: '80px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography variant="h3" sx={{ mb: -0.5 }}>🥇</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  {cohortData.topStudents[0].completedLessons}
                                </Typography>
                              </Box>
                              <Typography variant="caption" fontWeight="800" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                {cohortData.topStudents[0].name.split(' ')[0]}
                              </Typography>
                            </Box>
                          )}

                          {/* 3º Lugar */}
                          {cohortData.topStudents[2] && (
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                              <Box
                                sx={{
                                  bgcolor: 'rgba(205, 127, 50, 0.4)',
                                  borderRadius: 2,
                                  p: 1,
                                  mb: 1,
                                  height: '50px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography variant="h5" sx={{ mb: -0.5 }}>🥉</Typography>
                                <Typography variant="caption" fontWeight="bold">
                                  {cohortData.topStudents[2].completedLessons}
                                </Typography>
                              </Box>
                              <Typography variant="caption" fontWeight="600" sx={{ display: 'block', fontSize: '0.65rem' }}>
                                {cohortData.topStudents[2].name.split(' ')[0]}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    ) : (
                      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                          {classmatesCount}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {classmatesCount === 1 ? "Colega de turma" : "Colegas de turma"}
                        </Typography>
                      </Box>
                    )}

                    <Link href="/aluno/turma" style={{ textDecoration: 'none' }}>
                      <Button
                        variant="outline"
                        fullWidth
                        sx={{
                          borderColor: 'rgba(0,0,0,0.2)',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
                        }}
                      >
                        Ver Ranking Completo
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
                    Você ainda não está matriculado
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Projetos */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={0}
              sx={{
                height: '100%',
                minHeight: { xs: 'auto', sm: '200px' },
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                borderRadius: 3,
                p: { xs: 2.5, sm: 3 },
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <Stack spacing={2}>
                <Box
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    width: 'fit-content',
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                  }}
                >
                  <FolderKanban size={24} strokeWidth={2} />
                </Box>
                <Box>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.95rem', sm: '1.15rem' } }}>
                    Projetos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Submissões pendentes
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
                    {pendingSubmissions}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Aguardando revisão
                  </Typography>
                  <Link href="/aluno/projetos" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="outline"
                      fullWidth
                      sx={{
                        borderColor: 'rgba(0,0,0,0.2)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
                      }}
                    >
                      Ver Projetos
                    </Button>
                  </Link>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Aulas Gravadas */}
          {recentLiveClasses.length > 0 && (
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  minHeight: { xs: 'auto', sm: '200px' },
                  background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                  borderRadius: 3,
                  p: { xs: 2.5, sm: 3 },
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <Stack spacing={2} sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.5)',
                      width: 'fit-content',
                      p: 1.5,
                      borderRadius: 2,
                      display: 'flex',
                    }}
                  >
                    <Video size={24} strokeWidth={2} />
                  </Box>
                  <Box>
                    <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.95rem', sm: '1.15rem' } }}>
                      Aulas Gravadas
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Gravações recentes
                    </Typography>
                  </Box>

                  <Stack spacing={1.5} sx={{ flex: 1 }}>
                    {recentLiveClasses.slice(0, 2).map((liveClass: any) => (
                      <Box
                        key={liveClass._id}
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: 2,
                          p: 1.5,
                          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.7)' },
                          transition: 'all 0.2s',
                        }}
                      >
                        <Typography variant="body2" fontWeight="600" sx={{ mb: 0.5 }}>
                          {liveClass.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          {new Date(liveClass.date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })}
                          {liveClass.duration && ` • ${liveClass.duration}min`}
                        </Typography>
                        <Link href={liveClass.recordingUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                          <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            sx={{
                              borderColor: 'rgba(0,0,0,0.2)',
                              fontSize: '0.75rem',
                            }}
                          >
                            <Play size={12} style={{ marginRight: 4 }} />
                            Assistir
                          </Button>
                        </Link>
                      </Box>
                    ))}
                  </Stack>

                  <Link href="/aluno/aulas-gravadas" style={{ textDecoration: 'none' }}>
                    <Button
                      variant="outline"
                      fullWidth
                      sx={{
                        borderColor: 'rgba(0,0,0,0.2)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.5)' },
                      }}
                    >
                      Ver Todas ({recentLiveClasses.length})
                    </Button>
                  </Link>
                </Stack>
              </Paper>
            </Grid>
          )}
        </Grid>
    </Box>
  );
}
