import { auth } from "@/auth";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Course from "@/models/Course";
import Progress from "@/models/Progress";

export default async function AdminPage() {
  const session = await auth();

  // Buscar dados do banco
  let totalUsers = 0;
  let totalStudents = 0;
  let activeStudents = 0;
  let totalCourses = 0;
  let completionRate = 0;

  try {
    await connectDB();

    // Contagens básicas
    totalUsers = await User.countDocuments();
    totalStudents = await User.countDocuments({ role: "aluno" });
    totalCourses = await Course.countDocuments();

    // Alunos ativos (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    activeStudents = await Progress.countDocuments({
      lastActivityAt: { $gte: thirtyDaysAgo },
    });

    // Taxa de conclusão
    const completedStudents = await Progress.countDocuments({
      overallProgress: 100,
    });
    if (totalStudents > 0) {
      completionRate = Math.round((completedStudents / totalStudents) * 100);
    }
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="h3" fontWeight="bold">
          Dashboard Administrativo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Olá, {session?.user?.name}! Gerencie a plataforma
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total de Usuários
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalUsers}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {totalUsers === 0 ? "Nenhum usuário cadastrado" : `${totalStudents} alunos`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Alunos
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalStudents}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {activeStudents} ativos (últimos 30 dias)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Cursos
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalCourses}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {totalCourses === 0 ? "Nenhum curso criado" : `${totalCourses} ${totalCourses === 1 ? "curso" : "cursos"}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Taxa de Conclusão
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalStudents > 0 ? `${completionRate}%` : "-"}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {totalStudents === 0 ? "Dados insuficientes" : "Alunos que completaram 100%"}
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
                Ações Rápidas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tarefas administrativas comuns
              </Typography>
              <Stack spacing={1}>
                <Link href="/admin/conteudo/novo" passHref>
                  <Button variant="text" fullWidth sx={{ justifyContent: "flex-start" }}>
                    Criar novo curso
                  </Button>
                </Link>
                <Link href="/admin/usuarios" passHref>
                  <Button variant="text" fullWidth sx={{ justifyContent: "flex-start" }}>
                    Adicionar usuário
                  </Button>
                </Link>
                <Link href="/admin/metricas" passHref>
                  <Button variant="text" fullWidth sx={{ justifyContent: "flex-start" }}>
                    Ver métricas detalhadas
                  </Button>
                </Link>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Alertas do Sistema
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Notificações importantes
              </Typography>
              <Box sx={{ py: 8, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Nenhum alerta no momento
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
