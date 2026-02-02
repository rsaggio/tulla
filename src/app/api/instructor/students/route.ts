import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Progress from "@/models/Progress";
import Course from "@/models/Course";

// GET /api/instructor/students - Listar todos os alunos com progresso
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "instrutor" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    // Buscar todos os alunos
    const students = await User.find({ role: "aluno" })
      .select("name email createdAt lastLogin")
      .lean();

    // Buscar curso ativo
    const course = await Course.findOne({ isActive: true });

    if (!course) {
      return NextResponse.json([]);
    }

    // Buscar progresso de cada aluno
    const studentsWithProgress = await Promise.all(
      students.map(async (student: any) => {
        const progress = await Progress.findOne({
          studentId: student._id,
          courseId: course._id,
        })
          .select("overallProgress completedLessons lastActivityAt currentModuleId")
          .populate("currentModuleId", "title")
          .lean();

        return {
          ...student,
          progress: progress || {
            overallProgress: 0,
            completedLessons: [],
            lastActivityAt: null,
            currentModuleId: null,
          },
        };
      })
    );

    // Ordenar por último acesso (mais recente primeiro)
    studentsWithProgress.sort((a: any, b: any) => {
      const dateA = a.progress?.lastActivityAt || a.createdAt;
      const dateB = b.progress?.lastActivityAt || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return NextResponse.json(studentsWithProgress);
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    return NextResponse.json(
      { error: "Erro ao listar alunos" },
      { status: 500 }
    );
  }
}
