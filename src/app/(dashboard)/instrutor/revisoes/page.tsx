"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ExternalLink, CheckCircle2, XCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Submission {
  _id: string;
  projectId: {
    _id: string;
    title: string;
    description: string;
    estimatedHours: number;
  };
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  githubUrl: string;
  notes?: string;
  status: "pendente" | "em_revisao" | "aprovado" | "reprovado";
  submittedAt: string;
}

export default function InstrutorRevisoesPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState<number>(0);
  const [reviewStatus, setReviewStatus] = useState<"aprovado" | "reprovado">("aprovado");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  async function loadSubmissions() {
    try {
      const res = await fetch("/api/instructor/reviews");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error("Erro ao carregar submissões:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(submissionId: string) {
    if (!feedback.trim()) {
      alert("Por favor, forneça um feedback para o aluno");
      return;
    }

    if (grade < 0 || grade > 100) {
      alert("A nota deve estar entre 0 e 100");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/instructor/reviews/${submissionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: reviewStatus,
          feedback,
          grade,
        }),
      });

      if (res.ok) {
        alert(`Projeto ${reviewStatus === "aprovado" ? "aprovado" : "reprovado"} com sucesso!`);
        setReviewing(null);
        setFeedback("");
        setGrade(0);
        setReviewStatus("aprovado");
        loadSubmissions();
      } else {
        const error = await res.json();
        alert(error.error || "Erro ao revisar projeto");
      }
    } catch (error) {
      console.error("Erro ao revisar:", error);
      alert("Erro ao revisar projeto");
    } finally {
      setSubmitting(false);
    }
  }

  function startReview(submissionId: string) {
    setReviewing(submissionId);
    setFeedback("");
    setGrade(reviewStatus === "aprovado" ? 100 : 0);
  }

  function cancelReview() {
    setReviewing(null);
    setFeedback("");
    setGrade(0);
    setReviewStatus("aprovado");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando submissões...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fila de Revisões</h1>
        <p className="text-muted-foreground mt-1">
          Revise os projetos submetidos pelos alunos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {submissions.filter((s) => s.status === "pendente").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Em Revisão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {submissions.filter((s) => s.status === "em_revisao").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Total na Fila
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{submissions.length}</div>
          </CardContent>
        </Card>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma submissão pendente</h3>
            <p className="text-sm text-muted-foreground">
              Todas as submissões foram revisadas!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {submission.projectId.title}
                      <Badge variant={submission.status === "pendente" ? "secondary" : "outline"}>
                        {submission.status === "pendente" ? "Pendente" : "Em Revisão"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {submission.projectId.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">
                    {submission.projectId.estimatedHours}h
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Aluno</h4>
                    <p className="text-sm">{submission.studentId.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {submission.studentId.email}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Submetido</h4>
                    <p className="text-sm">
                      {formatDistanceToNow(new Date(submission.submittedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Repositório</h4>
                  <a
                    href={submission.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {submission.githubUrl}
                  </a>
                </div>

                {submission.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Notas do Aluno</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                      {submission.notes}
                    </p>
                  </div>
                )}

                {reviewing === submission._id ? (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Status da Revisão</Label>
                      <div className="flex gap-3">
                        <Button
                          variant={reviewStatus === "aprovado" ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => {
                            setReviewStatus("aprovado");
                            setGrade(100);
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          variant={reviewStatus === "reprovado" ? "destructive" : "outline"}
                          className="flex-1"
                          onClick={() => {
                            setReviewStatus("reprovado");
                            setGrade(0);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reprovar
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Nota (0-100)</Label>
                      <Input
                        id="grade"
                        type="number"
                        min="0"
                        max="100"
                        value={grade}
                        onChange={(e) => setGrade(Number(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedback">Feedback *</Label>
                      <Textarea
                        id="feedback"
                        placeholder="Forneça um feedback detalhado sobre o projeto do aluno..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleReview(submission._id)}
                        disabled={submitting}
                        className="flex-1"
                      >
                        {submitting ? "Enviando..." : "Enviar Revisão"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={cancelReview}
                        disabled={submitting}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => startReview(submission._id)}
                    className="w-full"
                  >
                    Iniciar Revisão
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
