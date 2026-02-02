import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Cohort from "@/models/Cohort";
import Progress from "@/models/Progress";

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
    console.log('[DEBUG] User:', { id: session.user.id, enrolledCohorts: user?.enrolledCohorts });

    if (!user || !user.enrolledCohorts || user.enrolledCohorts.length === 0) {
      console.log('[DEBUG] User has no enrolled cohorts');
      return NextResponse.json({
        classmates: [],
        cohort: null,
        message: "Você ainda não está matriculado em nenhuma turma",
      });
    }

    // Pegar a primeira turma (priorizar ativa, mas aceitar qualquer uma)
    let cohort = await Cohort.findOne({
      _id: { $in: user.enrolledCohorts },
      status: "active",
    })
      .populate({
        path: "students",
        select: "name email profileImage",
        match: { _id: { $ne: session.user.id } }, // Excluir o próprio aluno
      })
      .select("name code students");

    // Se não houver turma ativa, buscar qualquer turma
    if (!cohort) {
      cohort = await Cohort.findOne({
        _id: { $in: user.enrolledCohorts },
      })
        .populate({
          path: "students",
          select: "name email profileImage",
          match: { _id: { $ne: session.user.id } }, // Excluir o próprio aluno
        })
        .select("name code students");
    }

    console.log('[DEBUG] Cohort found:', cohort ? { id: cohort._id, name: cohort.name } : null);

    if (!cohort) {
      return NextResponse.json({
        classmates: [],
        cohort: null,
        message: "Nenhuma turma encontrada",
      });
    }

    // Buscar progresso de cada aluno
    const classmatesWithProgress = await Promise.all(
      (cohort.students || []).map(async (student: any) => {
        const progress = await Progress.findOne({
          studentId: student._id,
          courseId: cohort.courseId,
        }).select("completedLessons");

        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          profileImage: student.profileImage,
          completedActivities: progress?.completedLessons?.length || 0,
        };
      })
    );

    // Ordenar por atividades concluídas (decrescente)
    classmatesWithProgress.sort((a, b) => b.completedActivities - a.completedActivities);

    return NextResponse.json({
      classmates: classmatesWithProgress,
      cohort: {
        _id: cohort._id,
        name: cohort.name,
        code: cohort.code,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar colegas de turma:", error);
    return NextResponse.json(
      { error: "Erro ao buscar colegas de turma" },
      { status: 500 }
    );
  }
}
