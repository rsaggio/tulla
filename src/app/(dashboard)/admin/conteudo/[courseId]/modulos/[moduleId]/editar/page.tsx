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

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
  courseId: string;
}

export default function EditarModuloPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const router = useRouter();
  const { courseId, moduleId } = use(params);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadModule();
  }, [courseId, moduleId]);

  async function loadModule() {
    try {
      const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}`);
      if (res.ok) {
        const data = await res.json();
        setModule(data);
      } else {
        setError("Módulo não encontrado");
      }
    } catch (error) {
      console.error("Erro ao carregar módulo:", error);
      setError("Erro ao carregar módulo");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const formData = new FormData(e.currentTarget);

    const moduleData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      order: parseInt(formData.get("order") as string),
      estimatedHours: parseInt(formData.get("estimatedHours") as string),
    };

    try {
      const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(moduleData),
      });

      if (!res.ok) {
        throw new Error("Erro ao atualizar módulo");
      }

      router.push(`/admin/conteudo/${courseId}/modulos/${moduleId}`);
    } catch (error) {
      console.error("Erro:", error);
      setError("Erro ao atualizar módulo. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este módulo? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push(`/admin/conteudo/${courseId}`);
      } else {
        alert("Erro ao excluir módulo");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao excluir módulo");
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
      <div className="max-w-3xl space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{error || "Módulo não encontrado"}</p>
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
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/conteudo/${courseId}/modulos/${moduleId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Módulo</h1>
          <p className="text-muted-foreground mt-1">
            Atualize as informações do módulo
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Módulo</CardTitle>
          <CardDescription>
            Modifique os dados do módulo conforme necessário
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
              <Label htmlFor="title">Título do Módulo *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={module.title}
                placeholder="Ex: Introdução ao JavaScript"
                required
                minLength={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={module.description}
                placeholder="Descreva o conteúdo do módulo..."
                required
                minLength={10}
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order">Ordem *</Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  defaultValue={module.order}
                  placeholder="Ex: 1"
                  required
                  min={1}
                />
                <p className="text-xs text-muted-foreground">
                  Define a ordem de exibição do módulo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Horas Estimadas *</Label>
                <Input
                  id="estimatedHours"
                  name="estimatedHours"
                  type="number"
                  defaultValue={module.estimatedHours}
                  placeholder="Ex: 8"
                  required
                  min={1}
                />
              </div>
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
            Ações irreversíveis que afetam este módulo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Excluir Módulo</p>
              <p className="text-sm text-muted-foreground">
                Remove o módulo e todas as suas aulas permanentemente
              </p>
            </div>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir Módulo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
