"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import FolderIcon from "@mui/icons-material/Folder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";

interface Project {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  estimatedHours: number;
  moduleId: string;
  isLocked?: boolean;
  completedLessons?: number;
  totalLessons?: number;
  moduleName?: string;
}

interface Submission {
  _id: string;
  projectId: any;
  githubUrl: string;
  notes?: string;
  status: "pendente" | "em_revisao" | "aprovado" | "reprovado";
  feedback?: string;
  grade?: number;
  submittedAt: string;
  reviewedAt?: string;
}

export default function AlunoProjetosPage() {
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("module");
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadProjects();
    loadSubmissions();
  }, []);

  async function loadProjects() {
    try {
      const coursesRes = await fetch("/api/courses");
      if (coursesRes.ok) {
        const courses = await coursesRes.json();
        if (courses.length > 0) {
          const courseRes = await fetch(`/api/courses/${courses[0]._id}`);
          if (courseRes.ok) {
            const course = await courseRes.json();
            const allProjects: Project[] = [];

            for (const module of course.modules) {
              const projectsRes = await fetch(`/api/modules/${module._id}/projects`);
              if (projectsRes.ok) {
                const moduleProjects = await projectsRes.json();
                allProjects.push(...moduleProjects);
              }
            }

            // Filtrar por módulo se especificado
            const filteredProjects = moduleId
              ? allProjects.filter(p => p.moduleId === moduleId)
              : allProjects;

            setProjects(filteredProjects);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadSubmissions() {
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        console.log("[DEBUG] Submissões carregadas:", data);
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Erro ao carregar submissões:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProject) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProject._id,
          githubUrl,
          notes,
        }),
      });

      if (res.ok) {
        setSelectedProject(null);
        setGithubUrl("");
        setNotes("");
        loadSubmissions();
        alert("Projeto submetido com sucesso!");
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao submeter projeto");
      }
    } catch (error) {
      console.error("Erro ao submeter:", error);
      alert("Erro ao submeter projeto");
    } finally {
      setSubmitting(false);
    }
  }

  function getProjectSubmission(projectId: string) {
    return submissions.find((s) => {
      const subProjectId = typeof s.projectId === "string" ? s.projectId : s.projectId?._id;
      return subProjectId === projectId;
    });
  }

  function getStatusConfig(status: string) {
    switch (status) {
      case "aprovado":
        return {
          icon: <CheckCircleIcon sx={{ color: "success.main" }} />,
          text: "Aprovado",
          color: "success" as const,
        };
      case "reprovado":
        return {
          icon: <CancelIcon sx={{ color: "error.main" }} />,
          text: "Reprovado",
          color: "error" as const,
        };
      case "em_revisao":
        return {
          icon: <AccessTimeIcon sx={{ color: "info.main" }} />,
          text: "Em Revisão",
          color: "info" as const,
        };
      default:
        return {
          icon: <AccessTimeIcon sx={{ color: "warning.main" }} />,
          text: "Pendente",
          color: "warning" as const,
        };
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" fontWeight="bold">
          Meus Projetos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Submeta seus projetos e acompanhe o feedback dos instrutores
        </Typography>
      </Box>

      {selectedProject ? (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Submeter Projeto: {selectedProject.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {selectedProject.description}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    Requisitos:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {selectedProject.requirements.map((req, i) => (
                      <Typography component="li" key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {req}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    Entregáveis:
                  </Typography>
                  <Box component="ul" sx={{ pl: 3, m: 0 }}>
                    {selectedProject.deliverables.map((del, i) => (
                      <Typography component="li" key={i} variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {del}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <TextField
                  label="URL do GitHub"
                  type="url"
                  placeholder="https://github.com/seu-usuario/projeto"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  required
                  fullWidth
                />

                <TextField
                  label="Notas (opcional)"
                  placeholder="Adicione qualquer informação adicional sobre seu projeto..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  rows={4}
                  fullWidth
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button type="submit" variant="contained" disabled={submitting}>
                    {submitting ? "Submetendo..." : "Submeter Projeto"}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setSelectedProject(null)}
                  >
                    Cancelar
                  </Button>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => {
            const submission = getProjectSubmission(project._id);
            const statusConfig = submission ? getStatusConfig(submission.status) : null;

            return (
              <Grid item xs={12} md={6} key={project._id}>
                <Card sx={{ height: "100%", opacity: project.isLocked ? 0.75 : 1 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                          {project.isLocked ? (
                            <LockIcon sx={{ color: "text.secondary" }} />
                          ) : (
                            <FolderIcon sx={{ color: "primary.main" }} />
                          )}
                          <Typography variant="h6" fontWeight="bold">
                            {project.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {project.description}
                        </Typography>
                      </Box>
                      <Stack spacing={0.5} alignItems="flex-end">
                        <Chip label={`${project.estimatedHours}h`} size="small" />
                        {project.isLocked && (
                          <Chip label="Bloqueado" size="small" color="default" />
                        )}
                      </Stack>
                    </Box>

                    <Stack spacing={2}>
                      {project.isLocked ? (
                        <>
                          <Alert severity="warning" icon={<LockIcon />}>
                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                              Projeto Bloqueado
                            </Typography>
                            <Typography variant="body2">
                              Complete todas as aulas do módulo <strong>{project.moduleName}</strong> para desbloquear este projeto.
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" sx={{ mt: 1 }}>
                              Progresso: {project.completedLessons}/{project.totalLessons} aulas completadas
                            </Typography>
                          </Alert>
                          <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            startIcon={<LockIcon />}
                          >
                            Projeto Bloqueado
                          </Button>
                        </>
                      ) : submission ? (
                        <>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {statusConfig?.icon}
                            <Typography variant="body1" fontWeight="medium">
                              {statusConfig?.text}
                            </Typography>
                          </Box>

                          <Button
                            component="a"
                            href={submission.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="text"
                            startIcon={<OpenInNewIcon />}
                            sx={{ justifyContent: "flex-start" }}
                          >
                            Ver no GitHub
                          </Button>

                          {submission.feedback && (
                            <Paper sx={{ p: 2, bgcolor: "action.hover" }}>
                              <Typography variant="body2" fontWeight="medium" gutterBottom>
                                Feedback do Instrutor:
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {submission.feedback}
                              </Typography>
                              {submission.grade !== undefined && submission.grade !== null && (
                                <Typography variant="body2" fontWeight="medium" sx={{ mt: 1 }}>
                                  Nota: {submission.grade}/100
                                </Typography>
                              )}
                            </Paper>
                          )}

                          {submission.status === "reprovado" && (
                            <Button
                              fullWidth
                              variant="outlined"
                              onClick={() => setSelectedProject(project)}
                            >
                              Resubmeter Projeto
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => setSelectedProject(project)}
                        >
                          Submeter Projeto
                        </Button>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {projects.length === 0 && (
        <Card>
          <CardContent>
            <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
              <FolderIcon sx={{ fontSize: 48, color: "text.secondary" }} />
              <Typography variant="h6" fontWeight="medium">
                Nenhum projeto disponível
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete as aulas para desbloquear os projetos
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
