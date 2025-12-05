import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Submission from "@/models/Submission";

// GET /api/instructor/reviews - Fila de revisões (submissões pendentes)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "instrutor" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    // Buscar todas as submissões pendentes e em revisão, ordenadas por data (mais antigas primeiro)
    const submissions = await Submission.find({
      status: { $in: ["pendente", "em_revisao"] },
    })
      .populate("projectId", "title description estimatedHours")
      .populate("studentId", "name email")
      .sort({ submittedAt: 1 }) // Mais antigas primeiro (FIFO)
      .lean();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Erro ao listar submissões:", error);
    return NextResponse.json(
      { error: "Erro ao listar submissões" },
      { status: 500 }
    );
  }
}
