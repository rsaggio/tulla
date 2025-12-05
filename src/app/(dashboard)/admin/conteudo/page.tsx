"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: number;
  isActive: boolean;
  modules: any[];
  createdAt: string;
}

export default function AdminConteudoPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCourse(id: string) {
    if (!confirm("Tem certeza que deseja deletar este curso? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        loadCourses();
      }
    } catch (error) {
      console.error("Erro ao deletar curso:", error);
      alert("Erro ao deletar curso");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Conteúdo</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie cursos, módulos, aulas e projetos
          </p>
        </div>
        <Link href="/admin/conteudo/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Curso
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum curso criado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comece criando seu primeiro curso
            </p>
            <Link href="/admin/conteudo/novo">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Curso
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </div>
                  <Badge variant={course.isActive ? "default" : "outline"}>
                    {course.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duração:</span>
                    <span className="font-medium">{course.duration}h</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Módulos:</span>
                    <span className="font-medium">{course.modules?.length || 0}</span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Link href={`/admin/conteudo/${course._id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCourse(course._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
