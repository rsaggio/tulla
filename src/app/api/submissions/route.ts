import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Submission from "@/models/Submission";

// GET /api/submissions - Listar submissões do aluno
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const submissions = await Submission.find({
      studentId: session.user.id,
    })
      .populate("projectId")
      .populate("reviewedBy", "name")
      .sort({ submittedAt: -1 });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Erro ao listar submissões:", error);
    return NextResponse.json(
      { error: "Erro ao listar submissões" },
      { status: 500 }
    );
  }
}

// POST /api/submissions - Submeter novo projeto
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();

    const { projectId, githubUrl, notes } = body;

    if (!projectId || !githubUrl) {
      return NextResponse.json(
        { error: "projectId e githubUrl são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se já existe uma submissão pendente ou em revisão
    const existingSubmission = await Submission.findOne({
      projectId,
      studentId: session.user.id,
      status: { $in: ["pendente", "em_revisao"] },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: "Você já tem uma submissão pendente para este projeto" },
        { status: 400 }
      );
    }

    const submission = await Submission.create({
      projectId,
      studentId: session.user.id,
      githubUrl,
      notes,
      status: "pendente",
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Erro ao submeter projeto:", error);
    return NextResponse.json(
      { error: "Erro ao submeter projeto" },
      { status: 500 }
    );
  }
}
