import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import LiveClass from "@/models/LiveClass";

// GET /api/admin/live-classes - Listar todas as aulas gravadas
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "instrutor")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const cohortId = searchParams.get("cohortId");

    const query = cohortId ? { cohortId } : {};

    const liveClasses = await LiveClass.find(query)
      .populate("instructor", "name email profileImage")
      .populate("cohortId", "name code")
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ liveClasses });
  } catch (error) {
    console.error("Erro ao buscar aulas gravadas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar aulas gravadas" },
      { status: 500 }
    );
  }
}

// POST /api/admin/live-classes - Criar nova aula gravada
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "instrutor")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();
    const { cohortId, title, description, recordingUrl, date, duration, instructor, thumbnail, topics } = body;

    if (!cohortId || !title || !recordingUrl || !date) {
      return NextResponse.json(
        { error: "Campos obrigatórios: cohortId, title, recordingUrl, date" },
        { status: 400 }
      );
    }

    const liveClass = await LiveClass.create({
      cohortId,
      title,
      description,
      recordingUrl,
      date,
      duration,
      instructor: instructor || session.user.id,
      thumbnail,
      topics,
    });

    const populatedLiveClass = await LiveClass.findById(liveClass._id)
      .populate("instructor", "name email profileImage")
      .populate("cohortId", "name code");

    return NextResponse.json(populatedLiveClass, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar aula gravada:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar aula gravada" },
      { status: 500 }
    );
  }
}
