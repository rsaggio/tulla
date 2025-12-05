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

interface Lesson {
  _id: string;
  title: string;
  content: string;
  type: string;
  order: number;
  videoUrl?: string;
  resources?: { title: string; url: string }[];
  moduleId: string;
}

export default function EditarAulaPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>;
}) {
  const router = useRouter();
  const { courseId, moduleId, lessonId } = use(params);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLesson();
  }, [moduleId, lessonId]);

  async function loadLesson() {
    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        setLesson(data);
      } else {
        setError("Aula não encontrada");
      }
    } catch (error) {
      console.error("Erro ao carregar aula:", error);
      setError("Erro ao carregar aula");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const lessonData = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      type: formData.get("type") as string,
      order: parseInt(formData.get("order") as string),
      videoUrl: formData.get("videoUrl") as string || undefined,
    };

    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar aula");
      }

      router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao atualizar aula. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const res = await fetch(`/api/modules/${moduleId}/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
      } else {
        alert("Erro ao excluir aula");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir aula");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Carregando aula...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{error || "Aula não encontrada"}</p>
            <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`}>
              <Button variant="outline" className="mt-4">
                Voltar ao Módulo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Aula</h1>
          <p className="text-muted-foreground mt-1">
            Atualize o conteúdo da aula
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da Aula</CardTitle>
          <CardDescription>
            Modifique o conteúdo e propriedades da aula
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
              <Label htmlFor="title">Título da Aula *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={lesson.title}
                placeholder="Ex: Variáveis e Tipos de Dados"
                required
                minLength={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo *</Label>
                <select
                  id="type"
                  name="type"
                  defaultValue={lesson.type}
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="teoria">Teoria</option>
                  <option value="video">Vídeo</option>
                  <option value="leitura">Leitura</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Ordem *</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  defaultValue={lesson.order}
                  placeholder="Ex: 1"
                  required
                  min={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">URL do Vídeo (opcional)</Label>
              <Input
                id="videoUrl"
                name="videoUrl"
                type="url"
                defaultValue={lesson.videoUrl || ""}
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-muted-foreground">
                Link para vídeo do YouTube, Vimeo, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo (Markdown) *</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={lesson.content}
                placeholder="# Título da Seção&#10;&#10;Escreva o conteúdo da aula em Markdown...&#10;&#10;```javascript&#10;const exemplo = 'código';&#10;```"
                required
                minLength={10}
                rows={20}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use Markdown para formatar o conteúdo. Suporta código, listas, links, etc.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          <CardDescription>
            Ações irreversíveis que afetam esta aula
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Excluir Aula</p>
              <p className="text-sm text-muted-foreground">
                Remove a aula permanentemente
              </p>
            </div>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir Aula
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
