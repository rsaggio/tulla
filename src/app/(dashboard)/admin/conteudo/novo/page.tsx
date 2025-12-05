"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function NovoCursoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const courseData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      duration: parseInt(formData.get("duration") as string),
      prerequisites: (formData.get("prerequisites") as string)
        .split("\n")
        .filter((p) => p.trim()),
      isActive: true,
    };

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar curso");
      }

      const course = await res.json();
      router.push(`/admin/conteudo/${course._id}`);
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao criar curso. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/conteudo">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Curso</h1>
          <p className="text-muted-foreground mt-1">
            Preencha as informações básicas do curso
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Curso</CardTitle>
          <CardDescription>
            Após criar o curso, você poderá adicionar módulos, aulas e projetos
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
                placeholder="Ex:&#10;Conhecimento básico de HTML&#10;Noções de programação"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Digite cada pré-requisito em uma linha separada
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Criando..." : "Criar Curso"}
              </Button>
              <Link href="/admin/conteudo">
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
