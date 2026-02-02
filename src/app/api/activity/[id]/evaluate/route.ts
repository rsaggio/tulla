import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import OpenAI from "openai";
import connectDB from "@/lib/db/mongodb";
import Activity from "@/models/Activity";
import Submission from "@/models/Submission";
import Lesson from "@/models/Lesson";
import Course from "@/models/Course";
import Progress from "@/models/Progress";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/activity/[id]/evaluate - Enviar e avaliar atividade com IA
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return NextResponse.json(
        { error: "Atividade não encontrada" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Conteúdo da atividade é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se já existe uma submissão aprovada
    const existingApproved = await Submission.findOne({
      studentId: session.user.id,
      lessonId: activity.lessonId,
      status: "aprovado",
    });

    if (existingApproved) {
      return NextResponse.json(
        { error: "Você já possui uma submissão aprovada para esta atividade" },
        { status: 400 }
      );
    }

    // Chamar GPT para avaliar a resposta
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: `Você é um professor avaliador de exercícios práticos. Avalie a resposta do aluno considerando o enunciado do exercício. Seja justo, construtivo e educativo.

Responda APENAS com um JSON válido no formato:
{
  "grade": <número de 0 a 10>,
  "feedback": "<feedback construtivo com dicas básicas para melhorar>"
}

Critérios de avaliação:
- Relevância e adequação ao enunciado (peso maior)
- Clareza e organização da resposta
- Demonstração de compreensão do tema
- Nota > 7 significa aprovado

Seja encorajador mesmo quando a nota for baixa. Dê dicas práticas e específicas para o aluno melhorar.`,
        },
        {
          role: "user",
          content: `## Exercício: ${activity.title}

### Descrição:
${activity.description}

### Instruções:
${activity.instructions}

---

### Resposta do aluno:
${content}`,
        },
      ],
    });

    const responseText = completion.choices[0]?.message?.content || "";

    // Parsear resposta JSON do GPT
    let grade: number;
    let feedback: string;

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("JSON não encontrado");
      const parsed = JSON.parse(jsonMatch[0]);
      grade = Math.min(10, Math.max(0, Number(parsed.grade) || 0));
      feedback = parsed.feedback || "Avaliação concluída.";
    } catch {
      grade = 5;
      feedback = "Não foi possível gerar uma avaliação detalhada. Tente novamente.";
    }

    const passed = grade > 7;
    const status = passed ? "aprovado" : "reprovado";

    // Remover submissões pendentes/reprovadas anteriores para esta atividade
    await Submission.deleteMany({
      studentId: session.user.id,
      lessonId: activity.lessonId,
      status: { $in: ["pendente", "reprovado"] },
    });

    // Criar submissão com avaliação
    const submission = await Submission.create({
      studentId: session.user.id,
      lessonId: activity.lessonId,
      content,
      status,
      grade: Math.round(grade * 10), // Converter para escala 0-100
      feedback,
    });

    // Se aprovado, marcar aula como concluída
    if (passed) {
      const lesson = await Lesson.findById(activity.lessonId);
      if (lesson) {
        const course = await Course.findOne({
          modules: { $in: [lesson.moduleId] },
        });

        if (course) {
          let progress = await Progress.findOne({
            studentId: session.user.id,
            courseId: course._id,
          });

          if (!progress) {
            progress = await Progress.create({
              studentId: session.user.id,
              courseId: course._id,
              completedLessons: [activity.lessonId],
              completedProjects: [],
              overallProgress: 0,
            });
          } else if (
            !progress.completedLessons.includes(activity.lessonId as any)
          ) {
            progress.completedLessons.push(activity.lessonId as any);
            progress.lastActivityAt = new Date();
            await progress.save();
          }

          // Recalcular progresso
          const totalLessons = await Lesson.countDocuments({
            moduleId: { $in: course.modules },
          });
          const completedCount = progress.completedLessons.length;
          progress.overallProgress = Math.min(
            100,
            Math.round((completedCount / (totalLessons || 1)) * 100)
          );
          await progress.save();
        }
      }
    }

    return NextResponse.json({
      success: true,
      grade,
      feedback,
      status,
      submission: {
        _id: submission._id,
        status: submission.status,
        submittedAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error("Erro ao avaliar atividade:", error);
    return NextResponse.json(
      { error: "Erro ao avaliar atividade" },
      { status: 500 }
    );
  }
}
