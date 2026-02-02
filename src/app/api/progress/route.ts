import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Progress from "@/models/Progress";
import Course from "@/models/Course";
import Lesson from "@/models/Lesson";
import "@/models/Project"; // Importar para registrar o schema para populate
import "@/models/Module"; // Importar para registrar o schema para populate

// GET /api/progress - Buscar progresso do aluno logado
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    // Buscar o primeiro curso ativo (por enquanto assumimos 1 curso)
    const course = await Course.findOne({ isActive: true });

    if (!course) {
      return NextResponse.json({ progress: null, course: null });
    }

    // Buscar ou criar progresso do aluno
    let progress = await Progress.findOne({
      studentId: session.user.id,
      courseId: course._id,
    })
      .populate("completedLessons")
      .populate("completedProjects")
      .populate("currentModuleId");

    if (!progress) {
      // Criar progresso inicial
      progress = await Progress.create({
        studentId: session.user.id,
        courseId: course._id,
        completedLessons: [],
        completedProjects: [],
        overallProgress: 0,
      });
    } else {
      // Recalcular progresso com base no total atual de aulas
      const totalLessons = await Lesson.countDocuments({
        moduleId: { $in: course.modules },
      });

      if (totalLessons > 0) {
        const newProgress = Math.round(
          (progress.completedLessons.length / totalLessons) * 100
        );

        if (newProgress !== progress.overallProgress) {
          progress.overallProgress = newProgress;
          await progress.save();
        }
      }
    }

    return NextResponse.json({ progress, course });
  } catch (error) {
    console.error("Erro ao buscar progresso:", error);
    return NextResponse.json(
      { error: "Erro ao buscar progresso" },
      { status: 500 }
    );
  }
}
