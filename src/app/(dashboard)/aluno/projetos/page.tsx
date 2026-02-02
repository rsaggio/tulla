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
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import FolderIcon from "@mui/icons-material/Folder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelIcon from "@mui/icons-material/Cancel";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ReactMarkdown from "react-markdown";

interface Project {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  rubric?: { criterion: string; points: number; description: string }[];
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
  const [showSubmitForm, setShowSubmitForm] = useState(false);
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
        setShowSubmitForm(false);
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

  function getDescriptionExcerpt(description: string) {
    const plainText = description
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[-*]\s/g, "")
      .replace(/\n+/g, " ")
      .trim();
    return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Detail view for a selected project
  if (selectedProject) {
    const submission = getProjectSubmission(selectedProject._id);
    const statusConfig = submission ? getStatusConfig(submission.status) : null;

    return (
      <Stack spacing={3}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => { setSelectedProject(null); setShowSubmitForm(false); }}
            sx={{ mb: 1 }}
          >
            Voltar aos projetos
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <FolderIcon sx={{ color: "primary.main", fontSize: 32 }} />
              <Typography variant="h4" fontWeight="bold">
                {selectedProject.title}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Chip icon={<ScheduleIcon />} label={`${selectedProject.estimatedHours}h estimadas`} />
              {submission && (
                <Chip
                  icon={statusConfig?.icon}
                  label={statusConfig?.text}
                  color={statusConfig?.color}
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
          {selectedProject.moduleName && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 6 }}>
              Módulo: {selectedProject.moduleName}
            </Typography>
          )}
        </Box>

        {/* Description rendered as markdown */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                "& h1, & h2, & h3, & h4, & h5, & h6": { mt: 2, mb: 1, fontWeight: "bold" },
                "& h2": { fontSize: "1.3rem" },
                "& h3": { fontSize: "1.15rem" },
                "& h4": { fontSize: "1.05rem" },
                "& p": { mb: 1.5, lineHeight: 1.7, color: "text.secondary" },
                "& ul, & ol": { pl: 3, mb: 1.5 },
                "& li": { mb: 0.5, color: "text.secondary" },
                "& code": {
                  bgcolor: "action.hover",
                  px: 0.8,
                  py: 0.2,
                  borderRadius: 0.5,
                  fontSize: "0.875em",
                  fontFamily: "monospace",
                },
                "& strong": { color: "text.primary" },
              }}
            >
              <ReactMarkdown>{selectedProject.description}</ReactMarkdown>
            </Box>
          </CardContent>
        </Card>

        {/* Requirements */}
        {selectedProject.requirements.length > 0 && (
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <ChecklistIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Requisitos
                </Typography>
              </Box>
              <Stack spacing={1}>
                {selectedProject.requirements.map((req, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    <Chip label={i + 1} size="small" color="primary" variant="outlined" sx={{ minWidth: 28, mt: 0.2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {req}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Deliverables */}
        {selectedProject.deliverables.length > 0 && (
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <AssignmentIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Entregáveis
                </Typography>
              </Box>
              <Stack spacing={1}>
                {selectedProject.deliverables.map((del, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: "text.disabled", fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {del}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Rubric */}
        {selectedProject.rubric && selectedProject.rubric.length > 0 && (
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Critérios de Avaliação
              </Typography>
              <Stack spacing={2} divider={<Divider />}>
                {selectedProject.rubric.map((item, i) => (
                  <Box key={i}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {item.criterion}
                      </Typography>
                      <Chip label={`${item.points} pts`} size="small" color="primary" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Submission feedback */}
        {submission && submission.feedback && (
          <Card sx={{ borderLeft: 4, borderColor: statusConfig?.color + ".main" }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                {statusConfig?.icon}
                <Typography variant="h6" fontWeight="bold">
                  Feedback do Instrutor
                </Typography>
                {submission.grade !== undefined && submission.grade !== null && (
                  <Chip label={`Nota: ${submission.grade}/100`} size="small" color={statusConfig?.color} sx={{ ml: "auto" }} />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                {submission.feedback}
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Submit form or submit button */}
        {!selectedProject.isLocked && (
          <>
            {showSubmitForm ? (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Submeter Projeto
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <TextField
                        label="URL do projeto"
                        type="url"
                        placeholder="https://github.com/seu-usuario/projeto ou link do arquivo .zip"
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
                        <Button variant="outlined" onClick={() => setShowSubmitForm(false)}>
                          Cancelar
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Box>
                {submission ? (
                  <Stack direction="row" spacing={2}>
                    <Button
                      component="a"
                      href={submission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      startIcon={<OpenInNewIcon />}
                    >
                      Ver Submissão
                    </Button>
                    {submission.status === "reprovado" && (
                      <Button variant="contained" onClick={() => setShowSubmitForm(true)}>
                        Resubmeter Projeto
                      </Button>
                    )}
                  </Stack>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setShowSubmitForm(true)}
                  >
                    Submeter Projeto
                  </Button>
                )}
              </Box>
            )}
          </>
        )}
      </Stack>
    );
  }

  // Projects listing
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

      {projects.length === 0 ? (
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
      ) : (
        <Stack spacing={2}>
          {projects.map((project) => {
            const submission = getProjectSubmission(project._id);
            const statusConfig = submission ? getStatusConfig(submission.status) : null;
            const isLocked = project.isLocked;

            return (
              <Card
                key={project._id}
                sx={{
                  opacity: isLocked ? 0.7 : 1,
                  cursor: isLocked ? "default" : "pointer",
                  transition: "box-shadow 0.2s",
                  "&:hover": isLocked ? {} : { boxShadow: 4 },
                }}
                onClick={() => !isLocked && setSelectedProject(project)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                    <Box sx={{ pt: 0.3 }}>
                      {isLocked ? (
                        <LockIcon sx={{ color: "text.disabled", fontSize: 28 }} />
                      ) : submission?.status === "aprovado" ? (
                        <CheckCircleIcon sx={{ color: "success.main", fontSize: 28 }} />
                      ) : (
                        <FolderIcon sx={{ color: "primary.main", fontSize: 28 }} />
                      )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {project.title}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            icon={<ScheduleIcon />}
                            label={`${project.estimatedHours}h`}
                            size="small"
                            variant="outlined"
                          />
                          {isLocked && (
                            <Chip label="Bloqueado" size="small" color="warning" variant="outlined" />
                          )}
                          {submission && (
                            <Chip
                              label={statusConfig?.text}
                              size="small"
                              color={statusConfig?.color}
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Box>

                      {project.moduleName && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                          Módulo: {project.moduleName}
                        </Typography>
                      )}

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {getDescriptionExcerpt(project.description)}
                      </Typography>

                      {isLocked && project.totalLessons !== undefined && (
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Complete as aulas para desbloquear
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {project.completedLessons}/{project.totalLessons}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={project.totalLessons > 0 ? ((project.completedLessons || 0) / project.totalLessons) * 100 : 0}
                            sx={{ borderRadius: 1 }}
                          />
                        </Box>
                      )}

                      {!isLocked && !submission && (
                        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                          Clique para ver detalhes e submeter
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
