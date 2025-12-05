"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Plus, BookOpen, FolderKanban, Clock } from "lucide-react";

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  lessons: any[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: number;
  prerequisites: string[];
  isActive: boolean;
  modules: Module[];
}

export default function CursoDetalhesPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function loadCourse() {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
      }
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando curso...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Curso não encontrado</p>
            <Link href="/admin/conteudo">
              <Button variant="outline" className="mt-4">
                Voltar para Cursos
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
          <Link href="/admin/conteudo">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <Badge variant={course.isActive ? "default" : "secondary"}>
                {course.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{course.description}</p>
          </div>
        </div>
        <Link href={`/admin/conteudo/${courseId}/editar`}>
          <Button>
            <Edit className="w-4 h-4 mr-2" />
            Editar Curso
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Duração Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{course.duration}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Módulos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{course.modules?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5" />
              Aulas Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {course.prerequisites && course.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pré-requisitos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1">
              {course.prerequisites.map((prereq, index) => (
                <li key={index} className="text-sm">
                  {prereq}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Módulos do Curso</CardTitle>
              <CardDescription>
                Organize o conteúdo em módulos e aulas
              </CardDescription>
            </div>
            <Link href={`/admin/conteudo/${courseId}/modulos/novo`}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Módulo
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!course.modules || course.modules.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum módulo criado ainda
              </p>
              <Link href={`/admin/conteudo/${courseId}/modulos/novo`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Módulo
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {course.modules
                .sort((a, b) => a.order - b.order)
                .map((module) => (
                  <div
                    key={module._id}
                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">
                          Módulo {module.order}: {module.title}
                        </h3>
                        <Badge variant="outline">
                          {module.estimatedHours}h
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {module.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {module.lessons?.length || 0} aulas
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/admin/conteudo/${courseId}/modulos/${module._id}`}>
                        <Button variant="outline" size="sm">
                          Ver Detalhes
                        </Button>
                      </Link>
                      <Link href={`/admin/conteudo/${courseId}/modulos/${module._id}/editar`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
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
