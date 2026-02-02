import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Lesson from "@/models/Lesson";
import Module from "@/models/Module";
import Activity from "@/models/Activity";

// GET /api/modules/[moduleId]/lessons - Listar aulas do módulo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await auth();
    const { moduleId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const lessons = await Lesson.find({ moduleId }).sort({ order: 1 });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Erro ao listar aulas:", error);
    return NextResponse.json(
      { error: "Erro ao listar aulas" },
      { status: 500 }
    );
  }
}

// POST /api/modules/[moduleId]/lessons - Criar nova aula
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await auth();
    const { moduleId } = await params;

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

    // Extrair dados de atividade antes de criar a aula
    const { activity: activityData, ...lessonBody } = body;

    // Criar aula
    const lesson = await Lesson.create({
      ...lessonBody,
      moduleId,
    });

    // Se for activity, criar documento de Activity
    if (body.type === "activity" && activityData) {
      await Activity.create({
        lessonId: lesson._id,
        title: lessonBody.title,
        description: activityData.description || lessonBody.content || "",
        instructions: activityData.instructions,
      });
    }

    // Adicionar aula ao módulo
    await Module.findByIdAndUpdate(moduleId, {
      $push: { lessons: lesson._id },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar aula:", error);
    return NextResponse.json({ error: "Erro ao criar aula" }, { status: 500 });
  }
}
