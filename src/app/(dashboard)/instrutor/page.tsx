import { auth } from "@/auth";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Submission from "@/models/Submission";
import { Users, ClipboardList, TrendingUp, ExternalLink } from "lucide-react";
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

  return (
    <div sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div>
        <h1 variant="h3" fontWeight="bold">Dashboard do Instrutor</h1>
        <p className="text-muted-foreground mt-1">
          Olá, {session?.user?.name}! Acompanhe o progresso dos seus alunos
        </p>
      </div>

      <div container spacing={3}>
        <Card>
          <CardHeader>
            <CardTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Users className="w-5 h-5" />
              Total de Alunos
            </CardTitle>
            <CardDescription>Alunos ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div variant="h3" fontWeight="bold">{totalStudents}</div>
            <Link href="/instrutor/alunos">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Ver Alunos
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ClipboardList className="w-5 h-5" />
              Revisões Pendentes
            </CardTitle>
            <CardDescription>Projetos aguardando</CardDescription>
          </CardHeader>
          <CardContent>
            <div variant="h3" fontWeight="bold">{pendingReviews}</div>
            <Link href="/instrutor/revisoes">
              <Button variant="outline" size="sm" className="mt-4 w-full">
                Ver Fila
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUp className="w-5 h-5" />
              Taxa de Aprovação
            </CardTitle>
            <CardDescription>Média geral</CardDescription>
          </CardHeader>
          <CardContent>
            <div variant="h3" fontWeight="bold">
              {approvalRate > 0 ? `${approvalRate}%` : "-"}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {approvalRate > 0 ? "Projetos aprovados" : "Dados insuficientes"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>
            Últimas submissões de projetos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentSubmissions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma atividade recente
            </p>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((submission: any) => (
                <div
                  key={submission._id.toString()}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">
                        {submission.studentId?.name || "Aluno desconhecido"}
                      </p>
                      <Badge
                        variant={
                          submission.status === "aprovado"
                            ? "default"
                            : submission.status === "reprovado"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {submission.status === "aprovado"
                          ? "Aprovado"
                          : submission.status === "reprovado"
                          ? "Reprovado"
                          : submission.status === "em_revisao"
                          ? "Em Revisão"
                          : "Pendente"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {submission.projectId?.title || "Projeto"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(submission.submittedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                    {submission.githubUrl && (
                      <a
                        href={submission.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
