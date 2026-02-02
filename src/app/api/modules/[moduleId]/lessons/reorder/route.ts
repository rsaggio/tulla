import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Lesson from "@/models/Lesson";

// PUT /api/modules/[moduleId]/lessons/reorder - Reordenar aulas
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const { moduleId } = await params;
    const { lessonIds } = await request.json();

    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      return NextResponse.json(
        { error: "Lista de IDs de aulas é obrigatória" },
        { status: 400 }
      );
    }

    // Atualizar ordem de cada aula usando bulkWrite
    const operations = lessonIds.map((id: string, index: number) => ({
      updateOne: {
        filter: { _id: id, moduleId },
        update: { $set: { order: index + 1 } },
      },
    }));

    await Lesson.bulkWrite(operations);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao reordenar aulas:", error);
    return NextResponse.json(
      { error: "Erro ao reordenar aulas" },
      { status: 500 }
    );
  }
}
