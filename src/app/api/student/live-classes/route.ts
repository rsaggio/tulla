import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Cohort from "@/models/Cohort";
import LiveClass from "@/models/LiveClass";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    if (session.user.role !== "aluno") {
      return NextResponse.json(
        { error: "Acesso permitido apenas para alunos" },
        { status: 403 }
      );
    }

    await connectDB();

    // Buscar o usuário e suas turmas
    const user = await User.findById(session.user.id).select("enrolledCohorts");

    if (!user || !user.enrolledCohorts || user.enrolledCohorts.length === 0) {
      return NextResponse.json({
        liveClasses: [],
        message: "Você ainda não está matriculado em nenhuma turma",
      });
    }

    // Buscar aulas gravadas das turmas do aluno
    const liveClasses = await LiveClass.find({
      cohortId: { $in: user.enrolledCohorts },
    })
      .populate("instructor", "name profileImage")
      .populate("cohortId", "name code")
      .sort({ date: -1 }) // Mais recentes primeiro
      .lean();

    return NextResponse.json({
      liveClasses,
    });
  } catch (error) {
    console.error("Erro ao buscar aulas gravadas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar aulas gravadas" },
      { status: 500 }
    );
  }
}
