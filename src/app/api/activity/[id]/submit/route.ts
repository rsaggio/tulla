import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Activity from "@/models/Activity";
import Submission from "@/models/Submission";

// POST /api/activity/[id]/submit - Enviar atividade de texto
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

    // Validar número de palavras
    const words = content.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    if (activity.minWords && wordCount < activity.minWords) {
      return NextResponse.json(
        {
          error: "A atividade deve ter pelo menos " + activity.minWords + " palavras",
        },
        { status: 400 }
      );
    }

    if (activity.maxWords && wordCount > activity.maxWords) {
      return NextResponse.json(
        {
          error: "A atividade deve ter no máximo " + activity.maxWords + " palavras",
        },
        { status: 400 }
      );
    }

    // Verificar se já existe uma submissão em revisão ou aprovada
    const existingSubmission = await Submission.findOne({
      studentId: session.user.id,
      lessonId: activity.lessonId,
      status: { $in: ["em_revisao", "aprovado"] },
    });

    if (existingSubmission) {
      return NextResponse.json(
        {
          error:
            "Você já possui uma submissão em revisão ou aprovada para esta atividade",
        },
        { status: 400 }
      );
    }

    // Criar submissão
    const submission = await Submission.create({
      studentId: session.user.id,
      lessonId: activity.lessonId,
      projectId: null, // Não é um projeto
      content,
      status: "pendente",
    });

    return NextResponse.json({
      success: true,
      submission: {
        _id: submission._id,
        status: submission.status,
        submittedAt: (submission as any).createdAt,
      },
    });
  } catch (error) {
    console.error("Erro ao enviar atividade:", error);
    return NextResponse.json(
      { error: "Erro ao enviar atividade" },
      { status: 500 }
    );
  }
}
