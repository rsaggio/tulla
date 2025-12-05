"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, TrendingUp, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  progress: {
    overallProgress: number;
    completedLessons: any[];
    lastActivityAt: string | null;
    currentModuleId: { title: string } | null;
  };
}

export default function InstrutorAlunosPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = students.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [search, students]);

  async function loadStudents() {
    try {
      const res = await fetch("/api/instructor/students");
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
        setFilteredStudents(data);
      }
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  }

  function getActivityStatus(lastActivity: string | null, createdAt: string) {
    if (!lastActivity) {
      return { color: "bg-gray-500", text: "Nunca acessou" };
    }

    const daysSince = Math.floor(
      (new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSince === 0) return { color: "bg-green-500", text: "Ativo hoje" };
    if (daysSince <= 3) return { color: "bg-green-500", text: "Ativo" };
    if (daysSince <= 7) return { color: "bg-yellow-500", text: "Moderado" };
    return { color: "bg-red-500", text: "Em risco" };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando alunos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alunos</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe o progresso e atividade de todos os alunos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Progresso Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {students.length > 0
                ? Math.round(
                    students.reduce((acc, s) => acc + s.progress.overallProgress, 0) /
                      students.length
                  )
                : 0}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Alunos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {
                students.filter((s) => {
                  if (!s.progress.lastActivityAt) return false;
                  const daysSince = Math.floor(
                    (new Date().getTime() -
                      new Date(s.progress.lastActivityAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                  return daysSince <= 7;
                }).length
              }
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Ativos nos últimos 7 dias
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar aluno por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {search ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => {
                const activityStatus = getActivityStatus(
                  student.progress.lastActivityAt,
                  student.createdAt
                );

                return (
                  <div
                    key={student._id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{student.name}</h3>
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-2 h-2 rounded-full ${activityStatus.color}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {activityStatus.text}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {student.email}
                      </p>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Progresso:
                        </span>
                        <Badge variant="outline">
                          {student.progress.overallProgress}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {student.progress.completedLessons.length} aulas concluídas
                      </p>
                      {student.progress.lastActivityAt && (
                        <p className="text-xs text-muted-foreground">
                          Último acesso:{" "}
                          {formatDistanceToNow(
                            new Date(student.progress.lastActivityAt),
                            { addSuffix: true, locale: ptBR }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
