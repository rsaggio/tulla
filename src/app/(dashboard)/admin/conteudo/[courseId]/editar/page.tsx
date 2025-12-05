"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  duration: number;
  prerequisites: string[];
  isActive: boolean;
}

export default function EditarCursoPage({ params }: { params: Promise<{ courseId: string }> }) {
  const router = useRouter();
  const { courseId } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCourse();
  }, [id]);

  async function loadCourse() {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
      } else {
        setError("Curso não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar curso:", error);
      setError("Erro ao carregar curso");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const courseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      duration: parseInt(formData.get("duration") as string),
      prerequisites: (formData.get("prerequisites") as string)
        .split("\n")
        .filter((p) => p.trim()),
      isActive: formData.get("isActive") === "true",
    };

    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar curso");
      }

      router.push(`/admin/conteudo/${courseId}`);
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao atualizar curso. Tente novamente.");
    } finally {
      setSaving(false);
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
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{error || "Curso não encontrado"}</p>
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
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/conteudo/${courseId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Curso</h1>
          <p className="text-muted-foreground mt-1">
            Atualize as informações do curso
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Curso</CardTitle>
          <CardDescription>
            Modifique os dados do curso conforme necessário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/50">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Título do Curso *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={course.title}
                placeholder="Ex: Desenvolvimento Web Full-Stack"
                required
                minLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={course.description}
                placeholder="Descreva o que os alunos vão aprender neste curso..."
                required
                minLength={10}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (em horas) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                defaultValue={course.duration}
                placeholder="Ex: 120"
                required
                min={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prerequisites">
                Pré-requisitos (um por linha)
              </Label>
              <Textarea
                id="prerequisites"
                name="prerequisites"
                defaultValue={course.prerequisites.join("\n")}
                placeholder="Ex:&#10;Conhecimento básico de HTML&#10;Noções de programação"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Digite cada pré-requisito em uma linha separada
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">Status do Curso</Label>
              <select
                id="isActive"
                name="isActive"
                defaultValue={course.isActive ? "true" : "false"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Cursos inativos não aparecem para os alunos
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Link href={`/admin/conteudo/${courseId}`}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
