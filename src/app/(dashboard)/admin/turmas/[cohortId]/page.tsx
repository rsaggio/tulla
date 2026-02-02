"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  scheduled: { label: "Agendada", color: "info" as const },
  active: { label: "Ativa", color: "success" as const },
  completed: { label: "Concluída", color: "default" as const },
  cancelled: { label: "Cancelada", color: "error" as const },
};

export default function CohortDetailPage() {
  const params = useParams();
  const cohortId = params.cohortId as string;
  const [cohort, setCohort] = useState<any>(null);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCohort();
    loadLiveClasses();
  }, [cohortId]);

  async function loadCohort() {
    try {
      const res = await fetch(`/api/cohorts/${cohortId}`);
      if (res.ok) {
        const data = await res.json();
        setCohort(data);
      }
    } catch (error) {
      console.error("Erro ao carregar turma:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadLiveClasses() {
    try {
      const res = await fetch(`/api/admin/live-classes?cohortId=${cohortId}`);
      if (res.ok) {
        const data = await res.json();
        setLiveClasses(data.liveClasses || []);
      }
    } catch (error) {
      console.error("Erro ao carregar aulas gravadas:", error);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!cohort) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Turma não encontrada
        </Typography>
        <Link href="/admin/turmas" passHref style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ mt: 2 }}>
            Voltar para Turmas
          </Button>
        </Link>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Link href="/admin/turmas" passHref style={{ textDecoration: "none" }}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h3" fontWeight="bold">
            {cohort.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Código: {cohort.code}
          </Typography>
        </Box>
        <Chip
          label={statusConfig[cohort.status].label}
          color={statusConfig[cohort.status].color}
        />
        <Link href={`/admin/turmas/${cohortId}/editar`} passHref style={{ textDecoration: "none" }}>
          <Button variant="outlined" startIcon={<EditIcon />}>
            Editar
          </Button>
        </Link>
      </Box>

      <Grid container spacing={3}>
        {/* Informações Gerais */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Informações Gerais
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Curso
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {cohort.courseId.title}
                  </Typography>
                </Box>

                {cohort.description && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Descrição
                    </Typography>
                    <Typography variant="body1">
                      {cohort.description}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 4 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Data de Início
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {format(new Date(cohort.startDate), "dd/MM/yyyy", { locale: ptBR })}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Data de Término
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {format(new Date(cohort.endDate), "dd/MM/yyyy", { locale: ptBR })}
                    </Typography>
                  </Box>
                </Box>

                {cohort.timezone && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fuso Horário
                    </Typography>
                    <Typography variant="body1">
                      {cohort.timezone}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Lista de Alunos */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Alunos ({cohort.students.length}
                  {cohort.maxStudents ? ` / ${cohort.maxStudents}` : ""})
                </Typography>
                <Link href={`/admin/turmas/${cohortId}/alunos`} passHref style={{ textDecoration: "none" }}>
                  <Button variant="outlined" size="small" startIcon={<PeopleIcon />}>
                    Gerenciar
                  </Button>
                </Link>
              </Box>
              <Divider sx={{ mb: 2 }} />

              {cohort.students.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                  Nenhum aluno matriculado ainda
                </Typography>
              ) : (
                <List>
                  {cohort.students.slice(0, 5).map((student: any) => (
                    <ListItem key={student._id}>
                      <ListItemAvatar>
                        <Avatar src={student.profileImage}>
                          {student.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={student.name}
                        secondary={student.email}
                      />
                    </ListItem>
                  ))}
                </List>
              )}

              {cohort.students.length > 5 && (
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Link href={`/admin/turmas/${cohortId}/alunos`} passHref style={{ textDecoration: "none" }}>
                    <Button size="small">
                      Ver todos os {cohort.students.length} alunos
                    </Button>
                  </Link>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Instrutores */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Instrutores
              </Typography>
              <Divider sx={{ my: 2 }} />

              {cohort.instructors.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum instrutor atribuído
                </Typography>
              ) : (
                <List>
                  {cohort.instructors.map((instructor: any) => (
                    <ListItem key={instructor._id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar src={instructor.profileImage}>
                          {instructor.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={instructor.name}
                        secondary={instructor.email}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>

          {/* Aulas Gravadas */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Aulas Gravadas
                </Typography>
                <Chip
                  label={liveClasses.length}
                  color="primary"
                  size="small"
                />
              </Box>
              <Divider sx={{ mb: 2 }} />

              {liveClasses.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Nenhuma gravação adicionada ainda
                </Typography>
              ) : (
                <>
                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    {liveClasses.slice(0, 3).map((liveClass: any) => (
                      <Box
                        key={liveClass._id}
                        sx={{
                          p: 1.5,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <Stack spacing={0.5}>
                          <Typography variant="body2" fontWeight="medium">
                            {liveClass.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(liveClass.date), "dd/MM/yyyy", { locale: ptBR })}
                            {liveClass.duration && ` • ${liveClass.duration} min`}
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                  {liveClasses.length > 3 && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
                      +{liveClasses.length - 3} {liveClasses.length - 3 === 1 ? "aula" : "aulas"}
                    </Typography>
                  )}
                </>
              )}

              <Link
                href={`/admin/aulas-gravadas/nova?cohortId=${cohortId}`}
                passHref
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<AddIcon />}
                  sx={{ mb: 1 }}
                >
                  Adicionar Aula Gravada
                </Button>
              </Link>

              <Link
                href={`/admin/aulas-gravadas?cohortId=${cohortId}`}
                passHref
                style={{ textDecoration: "none" }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<VideoLibraryIcon />}
                >
                  Ver Todas ({liveClasses.length})
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Estatísticas
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Alunos Matriculados
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {cohort.students.length}
                  </Typography>
                </Box>

                {cohort.graduatedStudents && cohort.graduatedStudents.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Alunos Formados
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {cohort.graduatedStudents.length}
                    </Typography>
                  </Box>
                )}

                {cohort.droppedStudents && cohort.droppedStudents.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Alunos que Desistiram
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="error.main">
                      {cohort.droppedStudents.length}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
