import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Submission from "@/models/Submission";
import Progress from "@/models/Progress";
import User from "@/models/User";
import Project from "@/models/Project";
import { sendProjectReviewEmail } from "@/lib/email";

// PUT /api/instructor/reviews/[id] - Revisar submissão
export async function PUT(
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

    const body = await request.json();
    const { status, feedback, grade } = body;

    if (!status || !["aprovado", "reprovado"].includes(status)) {
      return NextResponse.json(
        { error: "Status inválido. Use 'aprovado' ou 'reprovado'" },
        { status: 400 }
      );
    }

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar submissão com populate
    const submission = await Submission.findById(id)
      .populate("studentId", "name email")
      .populate("projectId", "title");

    if (!submission) {
      return NextResponse.json(
        { error: "Submissão não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar submissão
    submission.status = status;
    submission.feedback = feedback;
    submission.grade = grade || (status === "aprovado" ? 100 : 0);
    submission.reviewedBy = session.user.id;
    submission.reviewedAt = new Date();

    await submission.save();

    // Se aprovado, marcar projeto como concluído no progresso do aluno
    if (status === "aprovado") {
      const progress = await Progress.findOne({
        studentId: submission.studentId,
      });

      if (progress && !progress.completedProjects.includes(submission.projectId)) {
        progress.completedProjects.push(submission.projectId);
        await progress.save();
      }
    }

    // Enviar email de notificação
    try {
      const student = submission.studentId as any;
      const project = submission.projectId as any;

      await sendProjectReviewEmail(
        student.email,
        student.name,
        project.title,
        status,
        feedback,
        submission.grade
      );
    } catch (emailError) {
      console.error("Erro ao enviar email:", emailError);
      // Não falhar a requisição se o email falhar
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Erro ao revisar submissão:", error);
    return NextResponse.json(
      { error: "Erro ao revisar submissão" },
      { status: 500 }
    );
  }
}
