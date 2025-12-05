import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Lesson from "@/models/Lesson";
import Module from "@/models/Module";

// GET /api/modules/[moduleId]/lessons/[id] - Buscar aula por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Erro ao buscar aula:", error);
    return NextResponse.json(
      { error: "Erro ao buscar aula" },
      { status: 500 }
    );
  }
}

// PUT /api/modules/[moduleId]/lessons/[id] - Atualizar aula
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Erro ao atualizar aula:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar aula" },
      { status: 500 }
    );
  }
}

// DELETE /api/modules/[moduleId]/lessons/[id] - Deletar aula
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string; id: string }> }
) {
  try {
    const session = await auth();
    const { moduleId, id } = await params;

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    // Remover aula do módulo
    await Module.findByIdAndUpdate(moduleId, {
      $pull: { lessons: id },
    });

    await lesson.deleteOne();

    return NextResponse.json({ message: "Aula deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar aula:", error);
    return NextResponse.json(
      { error: "Erro ao deletar aula" },
      { status: 500 }
    );
  }
}
