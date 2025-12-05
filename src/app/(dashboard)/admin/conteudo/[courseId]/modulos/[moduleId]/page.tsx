"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Plus, BookOpen, Clock } from "lucide-react";

interface Lesson {
  _id: string;
  title: string;
  type: string;
  order: number;
  content?: string;
}

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  courseId: string;
  lessons: Lesson[];
}

export default function ModuloDetalhesPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const { courseId, moduleId } = use(params);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModule();
  }, [courseId, moduleId]);

  async function loadModule() {
    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons`);
      if (res.ok) {
        const lessons = await res.json();
        const moduleRes = await fetch(`/api/courses/${courseId}/modules/${moduleId}`);
        if (moduleRes.ok) {
          const moduleData = await moduleRes.json();
          setModule({ ...moduleData, lessons });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar módulo:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando módulo...</p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Módulo não encontrado</p>
            <Link href={`/admin/conteudo/${courseId}`}>
              <Button variant="outline" className="mt-4">
                Voltar ao Curso
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/admin/conteudo/${courseId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              Módulo {module.order}: {module.title}
            </h1>
            <p className="text-muted-foreground mt-1">{module.description}</p>
          </div>
        </div>
        <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/editar`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Editar Módulo
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horas Estimadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{module.estimatedHours}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Total de Aulas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{module.lessons?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aulas do Módulo</CardTitle>
              <CardDescription>
                Gerencie o conteúdo das aulas
              </CardDescription>
            </div>
            <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/aulas/nova`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Aula
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!module.lessons || module.lessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhuma aula criada ainda
              </p>
              <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/aulas/nova`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Aula
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {module.lessons
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                  <div
                    key={lesson._id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">
                          {lesson.order}. {lesson.title}
                        </h3>
                        <Badge variant="outline">
                          {lesson.type === "teoria"
                            ? "Teoria"
                            : lesson.type === "video"
                            ? "Vídeo"
                            : "Leitura"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {lesson.content
                          ? `${lesson.content.length} caracteres`
                          : "Sem conteúdo"}
                      </p>
                    </div>
                    <Link
                      href={`/admin/conteudo/${courseId}/modulos/${moduleId}/aulas/${lesson._id}/editar`}
                    >
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projetos do Módulo</CardTitle>
              <CardDescription>
                Projetos práticos para os alunos
              </CardDescription>
            </div>
            <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}/projetos/novo`}>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Projetos serão exibidos aqui
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
