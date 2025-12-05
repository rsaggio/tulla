"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  X as CancelIcon,
  BookOpen,
  CheckCircle,
  TrendingUp,
  Award,
  Key as KeyIcon,
} from "lucide-react";

interface ProfileStats {
  overallProgress: number;
  completedLessons: number;
  totalLessons: number;
  completedProjects: number;
  pendingSubmissions: number;
  startedAt: string;
}

export default function PerfilPage() {
  const { data: session, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);

  // Password change states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
    loadStats();
  }, [session]);

  const loadStats = async () => {
    try {
      // Buscar estatísticas do aluno
      const progressRes = await fetch("/api/progress");
      const progressData = await progressRes.json();

      if (progressData.progress) {
        const coursesRes = await fetch("/api/courses");
        const courses = await coursesRes.json();

        let totalLessons = 0;
        if (courses && courses.length > 0) {
          const courseRes = await fetch(`/api/courses/${courses[0]._id}`);
          const course = await courseRes.json();

          if (course.modules) {
            course.modules.forEach((module: any) => {
              if (module.lessons) {
                totalLessons += module.lessons.length;
              }
            });
          }
        }

        const submissionsRes = await fetch("/api/submissions");
        const submissions = await submissionsRes.json();

        const completedProjects = submissions.filter(
          (s: any) => s.status === "aprovado"
        ).length;

        const pendingSubmissions = submissions.filter(
          (s: any) => s.status === "pendente" || s.status === "em_revisao"
        ).length;

        setStats({
          overallProgress: progressData.progress.overallProgress || 0,
          completedLessons: progressData.progress.completedLessons?.length || 0,
          totalLessons,
          completedProjects,
          pendingSubmissions,
          startedAt: progressData.progress.startedAt,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao atualizar perfil");
      }

      // Atualizar sessão
      await updateSession({ name });

      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(session?.user?.name || "");
    setIsEditing(false);
    setMessage(null);
  };

  const handlePasswordChange = async () => {
    setPasswordLoading(true);
    setMessage(null);

    // Validações
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Preencha todos os campos de senha" });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "A nova senha deve ter pelo menos 6 caracteres" });
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "As senhas não coincidem" });
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao alterar senha");
      }

      setMessage({ type: "success", text: "Senha alterada com sucesso!" });
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
    setMessage(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Meu Perfil
      </Typography>

      {message && (
        <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Informações Pessoais */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: "2.5rem",
                    bgcolor: "primary.main",
                  }}
                >
                  {session?.user?.name ? getInitials(session.user.name) : "?"}
                </Avatar>

                {isEditing ? (
                  <>
                    <TextField
                      fullWidth
                      label="Nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon size={16} />}
                        onClick={handleSave}
                        disabled={loading}
                        fullWidth
                      >
                        Salvar
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon size={16} />}
                        onClick={handleCancel}
                        disabled={loading}
                        fullWidth
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Box sx={{ textAlign: "center", width: "100%" }}>
                      <Typography variant="h6" fontWeight="bold">
                        {session?.user?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {session?.user?.email}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon size={16} />}
                      onClick={() => setIsEditing(true)}
                      fullWidth
                    >
                      Editar Perfil
                    </Button>
                  </>
                )}

                <Divider sx={{ width: "100%" }} />

                <Box sx={{ width: "100%" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Função
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {session?.user?.role === "admin" ? "Administrador" : "Aluno"}
                  </Typography>
                </Box>

                {stats && (
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Membro desde
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(stats.startedAt)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Estatísticas */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Progresso Geral */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <TrendingUp size={24} />
                  <Typography variant="h6" fontWeight="bold">
                    Progresso Geral
                  </Typography>
                </Stack>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progresso do Curso
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {stats?.overallProgress || 0}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "100%",
                      height: 8,
                      bgcolor: "grey.200",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        width: `${stats?.overallProgress || 0}%`,
                        height: "100%",
                        bgcolor: "primary.main",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Estatísticas em Grid */}
            <Grid container spacing={2}>
              {/* Aulas Completadas */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "success.light",
                          color: "success.dark",
                        }}
                      >
                        <BookOpen size={24} />
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stats?.completedLessons || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Aulas Completadas
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          de {stats?.totalLessons || 0} aulas
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Projetos Aprovados */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "primary.light",
                          color: "primary.dark",
                        }}
                      >
                        <CheckCircle size={24} />
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stats?.completedProjects || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Projetos Aprovados
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Submissões Pendentes */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "warning.light",
                          color: "warning.dark",
                        }}
                      >
                        <Award size={24} />
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stats?.pendingSubmissions || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Aguardando Revisão
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              {/* Taxa de Conclusão */}
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: "info.light",
                          color: "info.dark",
                        }}
                      >
                        <TrendingUp size={24} />
                      </Box>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {stats?.totalLessons
                            ? Math.round(((stats.completedLessons / stats.totalLessons) * 100))
                            : 0}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Taxa de Conclusão
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Alterar Senha */}
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <KeyIcon size={24} />
                  <Typography variant="h6" fontWeight="bold">
                    Segurança
                  </Typography>
                </Stack>

                {isChangingPassword ? (
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Senha Atual"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    <TextField
                      fullWidth
                      label="Nova Senha"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      variant="outlined"
                      size="small"
                      helperText="Mínimo de 6 caracteres"
                    />
                    <TextField
                      fullWidth
                      label="Confirmar Nova Senha"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon size={16} />}
                        onClick={handlePasswordChange}
                        disabled={passwordLoading}
                        fullWidth
                      >
                        Salvar Senha
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<CancelIcon size={16} />}
                        onClick={handleCancelPasswordChange}
                        disabled={passwordLoading}
                        fullWidth
                      >
                        Cancelar
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<KeyIcon size={16} />}
                    onClick={() => setIsChangingPassword(true)}
                    fullWidth
                  >
                    Alterar Senha
                  </Button>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}
