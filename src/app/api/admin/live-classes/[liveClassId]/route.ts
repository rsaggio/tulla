import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import LiveClass from "@/models/LiveClass";

// GET /api/admin/live-classes/[liveClassId] - Obter detalhes de uma aula gravada
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ liveClassId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const { liveClassId } = await params;

    const liveClass = await LiveClass.findById(liveClassId)
      .populate("instructor", "name email profileImage")
      .populate("cohortId", "name code");

    if (!liveClass) {
      return NextResponse.json(
        { error: "Aula gravada não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error("Erro ao buscar aula gravada:", error);
    return NextResponse.json(
      { error: "Erro ao buscar aula gravada" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/live-classes/[liveClassId] - Atualizar aula gravada
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ liveClassId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "instrutor")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const { liveClassId } = await params;
    const body = await request.json();

    const liveClass = await LiveClass.findByIdAndUpdate(
      liveClassId,
      { $set: body },
      { new: true, runValidators: true }
    )
      .populate("instructor", "name email profileImage")
      .populate("cohortId", "name code");

    if (!liveClass) {
      return NextResponse.json(
        { error: "Aula gravada não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(liveClass);
  } catch (error: any) {
    console.error("Erro ao atualizar aula gravada:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar aula gravada" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/live-classes/[liveClassId] - Deletar aula gravada
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ liveClassId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "admin" && session.user.role !== "instrutor")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const { liveClassId } = await params;

    const liveClass = await LiveClass.findByIdAndDelete(liveClassId);

    if (!liveClass) {
      return NextResponse.json(
        { error: "Aula gravada não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Aula gravada deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar aula gravada:", error);
    return NextResponse.json(
      { error: "Erro ao deletar aula gravada" },
      { status: 500 }
    );
  }
}
