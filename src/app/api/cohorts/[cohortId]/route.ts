import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Cohort from "@/models/Cohort";
import User from "@/models/User";
import "@/models/Course";

// GET /api/cohorts/[cohortId] - Obter detalhes da turma
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ cohortId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const { cohortId } = await params;
    console.log('[DEBUG GET Cohort] Looking for cohort ID:', cohortId);

    const cohort = await Cohort.findById(cohortId)
      .populate("courseId")
      .populate("instructors", "name email profileImage role")
      .populate("students", "name email profileImage role")
      .populate("graduatedStudents", "name email profileImage")
      .populate("droppedStudents", "name email profileImage")
      .populate("createdBy", "name email");

    console.log('[DEBUG GET Cohort] Found cohort:', cohort ? { id: cohort._id, name: cohort.name } : null);

    if (!cohort) {
      return NextResponse.json(
        { error: "Turma não encontrada" },
        { status: 404 }
      );
    }

    // Verificar permissão: admin vê tudo, instrutor vê suas turmas, aluno vê turmas onde está matriculado
    if (
      session.user.role !== "admin" &&
      session.user.role === "instrutor" &&
      !cohort.instructors.some((i: any) => i._id.toString() === session.user.id)
    ) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    if (
      session.user.role === "aluno" &&
      !cohort.students.some((s: any) => s._id.toString() === session.user.id)
    ) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    return NextResponse.json(cohort);
  } catch (error) {
    console.error("Erro ao buscar turma:", error);
    return NextResponse.json(
      { error: "Erro ao buscar turma" },
      { status: 500 }
    );
  }
}

// PATCH /api/cohorts/[cohortId] - Atualizar turma
export async function PATCH(
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
    const body = await request.json();

    // Buscar a turma atual para validar datas corretamente
    const existingCohort = await Cohort.findById(cohortId);

    if (!existingCohort) {
      return NextResponse.json(
        { error: "Turma não encontrada" },
        { status: 404 }
      );
    }

    // Validar datas considerando valores atuais e novos
    const startDate = body.startDate ? new Date(body.startDate) : existingCohort.startDate;
    const endDate = body.endDate ? new Date(body.endDate) : existingCohort.endDate;

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "Data de término deve ser posterior à data de início" },
        { status: 400 }
      );
    }

    const cohort = await Cohort.findByIdAndUpdate(
      cohortId,
      { $set: body },
      { new: true, runValidators: false }
    )
      .populate("courseId", "title thumbnail duration")
      .populate("instructors", "name email profileImage")
      .populate("students", "name email profileImage");

    if (!cohort) {
      return NextResponse.json(
        { error: "Turma não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(cohort);
  } catch (error: any) {
    console.error("Erro ao atualizar turma:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Código da turma já existe" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao atualizar turma" },
      { status: 500 }
    );
  }
}

// DELETE /api/cohorts/[cohortId] - Deletar turma
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
    const cohort = await Cohort.findByIdAndDelete(cohortId);

    if (!cohort) {
      return NextResponse.json(
        { error: "Turma não encontrada" },
        { status: 404 }
      );
    }

    // Remover turma dos alunos e instrutores
    await User.updateMany(
      { enrolledCohorts: cohortId },
      { $pull: { enrolledCohorts: cohortId } }
    );

    await User.updateMany(
      { instructingCohorts: cohortId },
      { $pull: { instructingCohorts: cohortId } }
    );

    return NextResponse.json({ message: "Turma deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar turma:", error);
    return NextResponse.json(
      { error: "Erro ao deletar turma" },
      { status: 500 }
    );
  }
}
