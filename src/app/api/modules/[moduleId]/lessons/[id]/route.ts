import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Lesson from "@/models/Lesson";
import Module from "@/models/Module";
import Activity from "@/models/Activity";
import Submission from "@/models/Submission";

// GET /api/modules/[moduleId]/lessons/[id] - Buscar aula por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    const result: any = lesson.toObject();

    // Para aulas do tipo "activity", buscar atividade e submissão do aluno
    if (lesson.type === "activity") {
      const activity = await Activity.findOne({ lessonId: id });
      if (activity) {
        result.activity = activity;
      }

      if (session.user.role === "aluno") {
        const submission = await Submission.findOne({
          lessonId: id,
          studentId: session.user.id,
        }).sort({ createdAt: -1 });

        if (submission) {
          result.activitySubmission = submission;
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar aula:", error);
    return NextResponse.json(
      { error: "Erro ao buscar aula" },
      { status: 500 }
    );
  }
}

// PUT /api/modules/[moduleId]/lessons/[id] - Atualizar aula
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();

    // Validar quiz
    if (body.type === "quiz" && (!body.quiz || body.quiz.length === 0)) {
      return NextResponse.json(
        { error: "Quiz deve ter pelo menos uma pergunta" },
        { status: 400 }
      );
    }

    // Extrair dados de atividade antes de atualizar a aula
    const { activity: activityData, ...lessonBody } = body;

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { ...lessonBody },
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    // Se for activity, atualizar ou criar documento de Activity
    if (body.type === "activity" && activityData) {
      await Activity.findOneAndUpdate(
        { lessonId: id },
        {
          lessonId: id,
          title: lessonBody.title,
          description: activityData.description || lessonBody.content || "",
          instructions: activityData.instructions,
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Erro ao atualizar aula:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar aula" },
      { status: 500 }
    );
  }
}

// DELETE /api/modules/[moduleId]/lessons/[id] - Deletar aula
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; id: string }> }
) {
  try {
    const session = await auth();
    const { moduleId, id } = await params;

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    // Remover aula do módulo
    await Module.findByIdAndUpdate(moduleId, {
      $pull: { lessons: id },
    });

    await lesson.deleteOne();

    return NextResponse.json({ message: "Aula deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar aula:", error);
    return NextResponse.json(
      { error: "Erro ao deletar aula" },
      { status: 500 }
    );
  }
}
