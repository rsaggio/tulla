import { auth } from "@/auth";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Course from "@/models/Course";
import Submission from "@/models/Submission";
import Progress from "@/models/Progress";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";

export default async function MetricasPage() {
  const session = await auth();

  let totalUsers = 0;
  let totalStudents = 0;
  let totalInstructors = 0;
  let totalCourses = 0;
  let totalSubmissions = 0;
  let approvedSubmissions = 0;
  let rejectedSubmissions = 0;
  let pendingSubmissions = 0;
  let averageProgress = 0;
  let activeStudents = 0;
  let inactiveStudents = 0;
  let completionRate = 0;

  try {
    await connectDB();

    // Contagens básicas
    totalUsers = await User.countDocuments();
    totalStudents = await User.countDocuments({ role: "aluno" });
    totalInstructors = await User.countDocuments({ role: "instrutor" });
    totalCourses = await Course.countDocuments();

    // Submissões
    totalSubmissions = await Submission.countDocuments();
    approvedSubmissions = await Submission.countDocuments({ status: "aprovado" });
    rejectedSubmissions = await Submission.countDocuments({ status: "reprovado" });
    pendingSubmissions = await Submission.countDocuments({
      status: { $in: ["pendente", "em_revisao"] },
    });

    // Progresso médio
    const progressDocs = await Progress.find();
    if (progressDocs.length > 0) {
      const totalProgress = progressDocs.reduce((acc, p) => acc + p.overallProgress, 0);
      averageProgress = Math.round(totalProgress / progressDocs.length);
    }

    // Estudantes ativos vs inativos (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalStudentsWithProgress = await Progress.countDocuments();
    activeStudents = await Progress.countDocuments({
      lastActivityAt: { $gte: thirtyDaysAgo },
    });
    inactiveStudents = Math.max(0, totalStudentsWithProgress - activeStudents);

    // Taxa de conclusão (alunos que completaram 100%)
    const completedStudents = await Progress.countDocuments({
      overallProgress: 100,
    });
    if (totalStudents > 0) {
      completionRate = Math.round((completedStudents / totalStudents) * 100);
    }
  } catch (error) {
    console.error("Erro ao carregar métricas:", error);
  }

  // Calcular distribuição de progresso
  let progressDistribution = {
    range0to25: 0,
    range26to50: 0,
    range51to75: 0,
    range76to99: 0,
    range100: 0,
  };

  try {
    await connectDB();
    const allProgress = await Progress.find();

    allProgress.forEach((p) => {
      const progress = p.overallProgress;
      if (progress === 100) {
        progressDistribution.range100++;
      } else if (progress >= 76) {
        progressDistribution.range76to99++;
      } else if (progress >= 51) {
        progressDistribution.range51to75++;
      } else if (progress >= 26) {
        progressDistribution.range26to50++;
      } else {
        progressDistribution.range0to25++;
      }
    });
  } catch (error) {
    console.error("Erro ao calcular distribuição:", error);
  }

  const approvalRate = totalSubmissions > 0
    ? Math.round((approvedSubmissions / (approvedSubmissions + rejectedSubmissions || 1)) * 100)
    : 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h3" fontWeight="bold">
          Métricas e Análises
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Visão geral do desempenho da plataforma
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <PeopleIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Total de Usuários
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {totalUsers}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {totalStudents} alunos
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {totalInstructors} instrutores
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <TrendingUpIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Progresso Médio
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {averageProgress}%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Média de todos os alunos
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <EmojiEventsIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Taxa de Conclusão
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {completionRate}%
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Alunos que completaram 100%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Cursos Ativos
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {totalCourses}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                Total de cursos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Atividade dos Alunos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Últimos 30 dias
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "success.main" }} />
                    <Typography variant="body2" fontWeight="medium">
                      Ativos
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {activeStudents}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "grey.500" }} />
                    <Typography variant="body2" fontWeight="medium">
                      Inativos
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {inactiveStudents}
                  </Typography>
                </Box>
                <Divider />
                <Typography variant="caption" color="text.secondary">
                  {totalStudents > 0
                    ? `${Math.round((activeStudents / totalStudents) * 100)}% dos alunos ativos`
                    : "Sem dados"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Submissões de Projetos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Status das avaliações
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon fontSize="small" sx={{ color: "success.main" }} />
                    <Typography variant="body2" fontWeight="medium">
                      Aprovados
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {approvedSubmissions}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CancelIcon fontSize="small" sx={{ color: "error.main" }} />
                    <Typography variant="body2" fontWeight="medium">
                      Reprovados
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {rejectedSubmissions}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PendingIcon fontSize="small" sx={{ color: "warning.main" }} />
                    <Typography variant="body2" fontWeight="medium">
                      Pendentes
                    </Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    {pendingSubmissions}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    Taxa de Aprovação
                  </Typography>
                  <Chip
                    label={`${approvalRate}%`}
                    color={approvalRate >= 70 ? "primary" : "default"}
                    size="small"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Distribuição de Progresso
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Quantidade de alunos por faixa de progresso
          </Typography>
          <Stack spacing={2}>
            {[
              { range: "0-25%", color: "#ef4444", count: progressDistribution.range0to25 },
              { range: "26-50%", color: "#f97316", count: progressDistribution.range26to50 },
              { range: "51-75%", color: "#eab308", count: progressDistribution.range51to75 },
              { range: "76-99%", color: "#3b82f6", count: progressDistribution.range76to99 },
              { range: "100%", color: "#22c55e", count: progressDistribution.range100 },
            ].map((item) => {
              const totalWithProgress = progressDistribution.range0to25 +
                progressDistribution.range26to50 +
                progressDistribution.range51to75 +
                progressDistribution.range76to99 +
                progressDistribution.range100;
              const percentage = totalWithProgress > 0 ? (item.count / totalWithProgress) * 100 : 0;
              return (
                <Box key={item.range} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 80 }}>
                    {item.range}
                  </Typography>
                  <Box sx={{ flex: 1, bgcolor: "grey.200", borderRadius: 1, height: 32, overflow: "hidden" }}>
                    <Box
                      sx={{
                        height: "100%",
                        bgcolor: item.color,
                        opacity: 0.8,
                        width: `${percentage}%`,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" fontWeight="medium" sx={{ minWidth: 40, textAlign: "right" }}>
                    {item.count}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
          {totalStudents === 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
              Sem dados de progresso disponíveis
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
