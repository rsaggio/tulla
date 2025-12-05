import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Progress from "@/models/Progress";
import Lesson from "@/models/Lesson";
import Course from "@/models/Course";

// POST /api/lessons/[id]/complete - Marcar aula como completa
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
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    // Buscar o curso da aula
    const course = await Course.findOne({
      modules: { $in: [lesson.moduleId] },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    // Buscar ou criar progresso
    let progress = await Progress.findOne({
      studentId: session.user.id,
      courseId: course._id,
    });

    if (!progress) {
      progress = await Progress.create({
        studentId: session.user.id,
        courseId: course._id,
        completedLessons: [id],
        completedProjects: [],
        overallProgress: 0,
      });
    } else {
      // Adicionar aula aos completedLessons se ainda não estiver
      if (!progress.completedLessons.includes(id as any)) {
        progress.completedLessons.push(id as any);
        progress.lastActivityAt = new Date();
        await progress.save();
      }
    }

    // Calcular progresso geral
    const totalLessons = await Lesson.countDocuments({
      moduleId: { $in: course.modules },
    });
    const completedCount = progress.completedLessons.length;
    const overallProgress = Math.round((completedCount / totalLessons) * 100);

    progress.overallProgress = overallProgress;
    await progress.save();

    return NextResponse.json({
      success: true,
      progress: {
        completedLessons: progress.completedLessons.length,
        totalLessons,
        overallProgress,
      },
    });
  } catch (error) {
    console.error("Erro ao marcar aula como completa:", error);
    return NextResponse.json(
      { error: "Erro ao marcar aula como completa" },
      { status: 500 }
    );
  }
}
