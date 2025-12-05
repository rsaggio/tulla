"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle2, ExternalLink } from "lucide-react";

interface Lesson {
  _id: string;
  title: string;
  content: string;
  videoUrl?: string;
  type: string;
  resources?: { title: string; url: string }[];
  moduleId: string;
}

export default function AulaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadLesson();
    checkProgress();
  }, [id]);

  async function loadLesson() {
    try {
      const res = await fetch(`/api/modules/${id.split("_")[0]}/lessons/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLesson(data);
      }
    } catch (error) {
      console.error("Erro ao carregar aula:", error);
      // Tentar buscar de outra forma
      try {
        const coursesRes = await fetch("/api/courses");
        if (coursesRes.ok) {
          const courses = await coursesRes.json();
          if (courses.length > 0) {
            const courseRes = await fetch(`/api/courses/${courses[0]._id}`);
            if (courseRes.ok) {
              const course = await courseRes.json();
              for (const module of course.modules) {
                const lessonRes = await fetch(
                  `/api/modules/${module._id}/lessons/${id}`
                );
                if (lessonRes.ok) {
                  const data = await lessonRes.json();
                  setLesson(data);
                  break;
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Erro ao buscar aula:", err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function checkProgress() {
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        if (data.progress) {
          const completed = data.progress.completedLessons.some(
            (l: any) => (l._id || l) === id
          );
          setIsCompleted(completed);
        }
      }
    } catch (error) {
      console.error("Erro ao verificar progresso:", error);
    }
  }

  async function markAsComplete() {
    if (!lesson) return;

    setCompleting(true);
    try {
      // Buscar o curso
      const coursesRes = await fetch("/api/courses");
      if (!coursesRes.ok) throw new Error("Erro ao buscar curso");

      const courses = await coursesRes.json();
      if (courses.length === 0) throw new Error("Nenhum curso encontrado");

      const res = await fetch("/api/progress/complete-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: id,
          courseId: courses[0]._id,
        }),
      });

      if (res.ok) {
        setIsCompleted(true);
        router.push("/aluno/curso");
      }
    } catch (error) {
      console.error("Erro ao marcar como concluída:", error);
      alert("Erro ao marcar aula como concluída");
    } finally {
      setCompleting(false);
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
      <div className="space-y-6">
        <Link href="/aluno/curso">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Curso
          </Button>
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Aula não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link href="/aluno/curso">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Curso
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant={isCompleted ? "default" : "outline"}>
            {isCompleted ? "Concluída" : "Em progresso"}
          </Badge>
          <Badge variant="secondary">{lesson.type}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {lesson.videoUrl && (
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Vídeo: {lesson.videoUrl}
              </p>
            </div>
          )}

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                code: ({ node, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code
                      className="bg-muted px-1.5 py-0.5 rounded text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                h1: ({ node, ...props }: any) => (
                  <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />
                ),
                h2: ({ node, ...props }: any) => (
                  <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }: any) => (
                  <h3 className="text-xl font-bold mt-4 mb-2" {...props} />
                ),
                p: ({ node, ...props }: any) => (
                  <p className="mb-4 leading-relaxed" {...props} />
                ),
                ul: ({ node, ...props }: any) => (
                  <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
                ),
                ol: ({ node, ...props }: any) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
                ),
                a: ({ node, ...props }: any) => (
                  <a className="text-primary hover:underline" {...props} />
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>

          {lesson.resources && lesson.resources.length > 0 && (
            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-3">Recursos Adicionais</h3>
              <div className="space-y-2">
                {lesson.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1">{resource.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t flex justify-end">
            {!isCompleted ? (
              <Button
                size="lg"
                onClick={markAsComplete}
                disabled={completing}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {completing ? "Marcando..." : "Marcar como Concluída"}
              </Button>
            ) : (
              <Button size="lg" variant="outline" asChild>
                <Link href="/aluno/curso">
                  Voltar ao Curso
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
