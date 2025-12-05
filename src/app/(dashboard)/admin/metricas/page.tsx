import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Course from "@/models/Course";
import Submission from "@/models/Submission";
import Progress from "@/models/Progress";
import { Users, TrendingUp, TrendingDown, Award, Clock, CheckCircle2, XCircle } from "lucide-react";

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

    activeStudents = await Progress.countDocuments({
      lastActivityAt: { $gte: thirtyDaysAgo },
    });
    inactiveStudents = totalStudents - activeStudents;

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

  const approvalRate = totalSubmissions > 0
    ? Math.round((approvedSubmissions / (approvedSubmissions + rejectedSubmissions || 1)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Métricas e Análises</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do desempenho da plataforma
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-5 h-5" />
              Total de Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-muted-foreground">
                {totalStudents} alunos
              </span>
              <span className="text-muted-foreground">
                {totalInstructors} instrutores
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-5 h-5" />
              Progresso Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageProgress}%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Média de todos os alunos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="w-5 h-5" />
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Alunos que completaram 100%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-5 h-5" />
              Cursos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCourses}</div>
            <p className="text-sm text-muted-foreground mt-2">
              Total de cursos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividade dos Alunos</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Ativos</span>
              </div>
              <div className="text-2xl font-bold">{activeStudents}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-sm font-medium">Inativos</span>
              </div>
              <div className="text-2xl font-bold">{inactiveStudents}</div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                {totalStudents > 0
                  ? `${Math.round((activeStudents / totalStudents) * 100)}% dos alunos ativos`
                  : "Sem dados"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submissões de Projetos</CardTitle>
            <CardDescription>Status das avaliações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Aprovados</span>
              </div>
              <div className="text-2xl font-bold">{approvedSubmissions}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium">Reprovados</span>
              </div>
              <div className="text-2xl font-bold">{rejectedSubmissions}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium">Pendentes</span>
              </div>
              <div className="text-2xl font-bold">{pendingSubmissions}</div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Taxa de Aprovação
                </span>
                <Badge variant={approvalRate >= 70 ? "default" : "secondary"}>
                  {approvalRate}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Progresso</CardTitle>
          <CardDescription>
            Quantidade de alunos por faixa de progresso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { range: "0-25%", color: "bg-red-500" },
              { range: "26-50%", color: "bg-orange-500" },
              { range: "51-75%", color: "bg-yellow-500" },
              { range: "76-99%", color: "bg-blue-500" },
              { range: "100%", color: "bg-green-500" },
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{item.range}</div>
                <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${item.color} opacity-80`}
                    style={{
                      width: `${Math.random() * 100}%`,
                    }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-medium">
                  {Math.floor(Math.random() * totalStudents)}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * Dados simulados para demonstração
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tempo Médio de Conclusão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              Em desenvolvimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aulas Mais Acessadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              Em desenvolvimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">NPS dos Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              Em desenvolvimento
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
