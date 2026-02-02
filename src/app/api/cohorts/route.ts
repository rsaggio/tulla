import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Cohort from "@/models/Cohort";
import "@/models/Course";
import "@/models/User";

// GET /api/cohorts - Listar todas as turmas
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");
    const status = searchParams.get("status");
    const instructorId = searchParams.get("instructorId");

    let query: any = {};

    if (courseId) {
      query.courseId = courseId;
    }

    if (status) {
      query.status = status;
    }

    if (instructorId) {
      query.instructors = instructorId;
    }

    // Se for instrutor, mostrar apenas suas turmas
    if (session.user.role === "instrutor") {
      query.instructors = session.user.id;
    }

    const cohorts = await Cohort.find(query)
      .populate("courseId", "title thumbnail duration")
      .populate("instructors", "name email profileImage")
      .populate("students", "name email profileImage")
      .sort({ startDate: -1 });

    return NextResponse.json(cohorts);
  } catch (error) {
    console.error("Erro ao listar turmas:", error);
    return NextResponse.json(
      { error: "Erro ao listar turmas" },
      { status: 500 }
    );
  }
}

// POST /api/cohorts - Criar nova turma
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();

    // Validar datas
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "Data de término deve ser posterior à data de início" },
        { status: 400 }
      );
    }

    const cohort = await Cohort.create({
      ...body,
      createdBy: session.user.id,
    });

    const populatedCohort = await Cohort.findById(cohort._id)
      .populate("courseId", "title thumbnail duration")
      .populate("instructors", "name email profileImage")
      .populate("students", "name email profileImage");

    return NextResponse.json(populatedCohort, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar turma:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Código da turma já existe" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erro ao criar turma" },
      { status: 500 }
    );
  }
}
