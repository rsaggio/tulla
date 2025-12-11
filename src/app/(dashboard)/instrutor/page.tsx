import { auth } from "@/auth";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Submission from "@/models/Submission";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function InstrutorPage() {
  const session = await auth();

  let totalStudents = 0;
  let pendingReviews = 0;
  let approvalRate = 0;
  let recentSubmissions: any[] = [];

  try {
    await connectDB();

    // Total de alunos
    totalStudents = await User.countDocuments({ role: "aluno" });

    // Revisões pendentes
    pendingReviews = await Submission.countDocuments({
      status: { $in: ["pendente", "em_revisao"] },
    });

    // Taxa de aprovação
    const totalReviewed = await Submission.countDocuments({
      status: { $in: ["aprovado", "reprovado"] },
    });
    const approved = await Submission.countDocuments({ status: "aprovado" });
    if (totalReviewed > 0) {
      approvalRate = Math.round((approved / totalReviewed) * 100);
    }

    // Atividades recentes (últimas 5 submissões)
    recentSubmissions = await Submission.find()
      .populate("studentId", "name email")
      .populate("projectId", "title")
      .sort({ submittedAt: -1 })
      .limit(5)
      .lean();
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "success";
      case "reprovado":
        return "error";
      case "em_revisao":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aprovado":
        return "Aprovado";
      case "reprovado":
        return "Reprovado";
      case "em_revisao":
        return "Em Revisão";
      default:
        return "Pendente";
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" fontWeight="bold">
          Dashboard do Instrutor
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Olá, {session?.user?.name}! Acompanhe o progresso dos seus alunos
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <PeopleIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" fontWeight="medium">
                  Total de Alunos
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Alunos ativos
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>
                {totalStudents}
              </Typography>
              <Link href="/instrutor/alunos" style={{ textDecoration: "none" }}>
                <Button variant="outlined" size="small" fullWidth>
                  Ver Alunos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <AssignmentIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" fontWeight="medium">
                  Revisões Pendentes
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Projetos aguardando
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>
                {pendingReviews}
              </Typography>
              <Link href="/instrutor/revisoes" style={{ textDecoration: "none" }}>
                <Button variant="outlined" size="small" fullWidth>
                  Ver Fila
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <TrendingUpIcon sx={{ color: "primary.main" }} />
                <Typography variant="h6" fontWeight="medium">
                  Taxa de Aprovação
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Média geral
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ my: 2 }}>
                {approvalRate > 0 ? `${approvalRate}%` : "-"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {approvalRate > 0 ? "Projetos aprovados" : "Dados insuficientes"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Atividades Recentes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Últimas submissões de projetos
          </Typography>

          {recentSubmissions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 8 }}>
              Nenhuma atividade recente
            </Typography>
          ) : (
            <Stack spacing={2} divider={<Divider />}>
              {recentSubmissions.map((submission: any) => (
                <Paper
                  key={submission._id.toString()}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    "&:hover": { bgcolor: "action.hover" },
                    transition: "all 0.2s",
                  }}
                  elevation={0}
                  variant="outlined"
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography fontWeight="medium" noWrap>
                        {submission.studentId?.name || "Aluno desconhecido"}
                      </Typography>
                      <Chip
                        label={getStatusLabel(submission.status)}
                        color={getStatusColor(submission.status) as any}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {submission.projectId?.title || "Projeto"}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatDistanceToNow(new Date(submission.submittedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </Typography>
                    {submission.githubUrl && (
                      <Button
                        component="a"
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                        sx={{ mt: 0.5, fontSize: "0.75rem" }}
                      >
                        GitHub
                      </Button>
                    )}
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
