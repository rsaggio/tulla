import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Progress from "@/models/Progress";
import Submission from "@/models/Submission";
import Course from "@/models/Course";

// GET /api/instructor/students/[id] - Detalhes do aluno
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user || (session.user.role !== "instrutor" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    // Buscar aluno
    const student = await User.findById(id)
      .select("name email createdAt lastLogin profileImage")
      .lean();

    if (!student) {
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    // Buscar curso ativo
    const course = await Course.findOne({ isActive: true })
      .populate({
        path: "modules",
        populate: {
          path: "lessons",
        },
      })
      .lean();

    if (!course) {
      return NextResponse.json({ student, progress: null, submissions: [] });
    }

    // Buscar progresso
    const progress = await Progress.findOne({
      studentId: id,
      courseId: course._id,
    })
      .populate("completedLessons")
      .populate("completedProjects")
      .populate("currentModuleId")
      .lean();

    // Buscar todas as submissões
    const submissions = await Submission.find({ studentId: id })
      .populate("projectId")
      .populate("reviewedBy", "name")
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json({
      student,
      course,
      progress,
      submissions,
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes do aluno:", error);
    return NextResponse.json(
      { error: "Erro ao buscar detalhes do aluno" },
      { status: 500 }
    );
  }
}
