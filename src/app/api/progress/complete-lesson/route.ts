import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Progress from "@/models/Progress";
import Lesson from "@/models/Lesson";
import Course from "@/models/Course";

// POST /api/progress/complete-lesson - Marcar aula como concluída
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const { lessonId, courseId } = await request.json();

    if (!lessonId || !courseId) {
      return NextResponse.json(
        { error: "lessonId e courseId são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se a aula existe
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    // Buscar ou criar progresso
    let progress = await Progress.findOne({
      studentId: session.user.id,
      courseId,
    });

    if (!progress) {
      progress = await Progress.create({
        studentId: session.user.id,
        courseId,
        completedLessons: [],
        completedProjects: [],
        overallProgress: 0,
      });
    }

    // Adicionar aula se ainda não estiver marcada
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      progress.lastActivityAt = new Date();

      // Calcular progresso geral
      const course = await Course.findById(courseId).populate({
        path: "modules",
        populate: {
          path: "lessons",
        },
      });

      if (course) {
        const totalLessons = course.modules.reduce(
          (acc: number, module: any) => acc + (module.lessons?.length || 0),
          0
        );

        if (totalLessons > 0) {
          progress.overallProgress = Math.round(
            (progress.completedLessons.length / totalLessons) * 100
          );
        }
      }

      await progress.save();
    }

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Erro ao marcar aula como concluída:", error);
    return NextResponse.json(
      { error: "Erro ao marcar aula como concluída" },
      { status: 500 }
    );
  }
}
