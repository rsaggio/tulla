"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, ExternalLink, CheckCircle2, Clock, XCircle, Lock } from "lucide-react";

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

            setProjects(allProjects);
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

  function getStatusIcon(status: string) {
    switch (status) {
      case "aprovado":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "reprovado":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "em_revisao":
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  }

  function getStatusText(status: string) {
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
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando projetos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meus Projetos</h1>
        <p className="text-muted-foreground mt-1">
          Submeta seus projetos e acompanhe o feedback dos instrutores
        </p>
      </div>

      {selectedProject ? (
        <Card>
          <CardHeader>
            <CardTitle>Submeter Projeto: {selectedProject.title}</CardTitle>
            <CardDescription>{selectedProject.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Requisitos:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedProject.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Entregáveis:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {selectedProject.deliverables.map((del, i) => (
                      <li key={i}>{del}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">URL do GitHub *</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  placeholder="https://github.com/seu-usuario/projeto"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione qualquer informação adicional sobre seu projeto..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Submetendo..." : "Submeter Projeto"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedProject(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => {
            const submission = getProjectSubmission(project._id);

            return (
              <Card key={project._id} className={project.isLocked ? "opacity-75" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {project.isLocked ? (
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <FolderKanban className="w-5 h-5" />
                        )}
                        {project.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {project.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline">{project.estimatedHours}h</Badge>
                      {project.isLocked && (
                        <Badge variant="secondary" className="text-xs">
                          Bloqueado
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.isLocked ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                        <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                            Projeto Bloqueado
                          </p>
                          <p className="text-sm text-amber-700 dark:text-amber-300">
                            Complete todas as aulas do módulo <strong>{project.moduleName}</strong> para desbloquear este projeto.
                          </p>
                          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium mt-2">
                            Progresso: {project.completedLessons}/{project.totalLessons} aulas completadas
                          </p>
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        disabled
                        variant="secondary"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Projeto Bloqueado
                      </Button>
                    </div>
                  ) : submission ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(submission.status)}
                        <span className="font-medium">
                          {getStatusText(submission.status)}
                        </span>
                      </div>

                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Ver no GitHub
                      </a>

                      {submission.feedback && (
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium mb-1">
                            Feedback do Instrutor:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {submission.feedback}
                          </p>
                          {submission.grade !== undefined && (
                            <p className="text-sm font-medium mt-2">
                              Nota: {submission.grade}/100
                            </p>
                          )}
                        </div>
                      )}

                      {submission.status === "reprovado" && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSelectedProject(project)}
                        >
                          Resubmeter Projeto
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => setSelectedProject(project)}
                    >
                      Submeter Projeto
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {projects.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderKanban className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum projeto disponível</h3>
            <p className="text-sm text-muted-foreground">
              Complete as aulas para desbloquear os projetos
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
