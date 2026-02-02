import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Cohort from "@/models/Cohort";
import User from "@/models/User";

// POST /api/cohorts/[cohortId]/students - Adicionar aluno à turma
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const { cohortId } = await params;
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { error: "ID do aluno é obrigatório" },
        { status: 400 }
      );
    }

    const cohort = await Cohort.findById(cohortId);

    if (!cohort) {
      return NextResponse.json(
        { error: "Turma não encontrada" },
        { status: 404 }
      );
    }

    const student = await User.findById(studentId);

    if (!student) {
      return NextResponse.json(
        { error: "Aluno não encontrado" },
        { status: 404 }
      );
    }

    if (student.role !== "aluno") {
      return NextResponse.json(
        { error: "Usuário não é um aluno" },
        { status: 400 }
      );
    }

    // Verificar se já está na turma
    if (cohort.students.includes(studentId)) {
      return NextResponse.json(
        { error: "Aluno já está matriculado nesta turma" },
        { status: 400 }
      );
    }

    // Verificar limite de alunos
    if (cohort.maxStudents && cohort.students.length >= cohort.maxStudents) {
      return NextResponse.json(
        { error: "Turma já atingiu o limite de alunos" },
        { status: 400 }
      );
    }

    // Adicionar aluno à turma
    cohort.students.push(studentId);
    await cohort.save();

    // Adicionar turma ao aluno
    if (!student.enrolledCohorts) {
      student.enrolledCohorts = [];
    }
    if (!student.enrolledCohorts.includes(cohortId)) {
      student.enrolledCohorts.push(cohortId as any);
    }
    if (!student.enrolledCourses) {
      student.enrolledCourses = [];
    }
    if (!student.enrolledCourses.includes(cohort.courseId)) {
      student.enrolledCourses.push(cohort.courseId);
    }
    await student.save();

    const updatedCohort = await Cohort.findById(cohortId)
      .populate("students", "name email profileImage");

    return NextResponse.json(updatedCohort);
  } catch (error) {
    console.error("Erro ao adicionar aluno à turma:", error);
    return NextResponse.json(
      { error: "Erro ao adicionar aluno à turma" },
      { status: 500 }
    );
  }
}

// DELETE /api/cohorts/[cohortId]/students - Remover aluno da turma
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const { cohortId } = await params;
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { error: "ID do aluno é obrigatório" },
        { status: 400 }
      );
    }

    const cohort = await Cohort.findById(cohortId);

    if (!cohort) {
      return NextResponse.json(
        { error: "Turma não encontrada" },
        { status: 404 }
      );
    }

    // Remover aluno da turma
    cohort.students = cohort.students.filter(
      (id: any) => id.toString() !== studentId
    );
    await cohort.save();

    // Remover turma do aluno
    await User.findByIdAndUpdate(studentId, {
      $pull: { enrolledCohorts: cohortId },
    });

    const updatedCohort = await Cohort.findById(cohortId)
      .populate("students", "name email profileImage");

    return NextResponse.json(updatedCohort);
  } catch (error) {
    console.error("Erro ao remover aluno da turma:", error);
    return NextResponse.json(
      { error: "Erro ao remover aluno da turma" },
      { status: 500 }
    );
  }
}
