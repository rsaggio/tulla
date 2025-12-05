import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Module from "@/models/Module";
import Lesson from "@/models/Lesson";
import Course from "@/models/Course";

// GET /api/courses/[courseId]/modules/[id] - Buscar módulo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const module = await Module.findById(id).populate("lessons");

    if (!module) {
      return NextResponse.json(
        { error: "Módulo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(module);
  } catch (error) {
    console.error("Erro ao buscar módulo:", error);
    return NextResponse.json(
      { error: "Erro ao buscar módulo" },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId]/modules/[id] - Atualizar módulo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();

    const module = await Module.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!module) {
      return NextResponse.json(
        { error: "Módulo não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(module);
  } catch (error) {
    console.error("Erro ao atualizar módulo:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar módulo" },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId]/modules/[id] - Deletar módulo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; id: string }> }
) {
  try {
    const session = await auth();
    const { courseId, id } = await params;

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const module = await Module.findById(id);

    if (!module) {
      return NextResponse.json(
        { error: "Módulo não encontrado" },
        { status: 404 }
      );
    }

    // Deletar todas as aulas associadas
    if (module.lessons && module.lessons.length > 0) {
      await Lesson.deleteMany({ _id: { $in: module.lessons } });
    }

    // Remover módulo do curso
    await Course.findByIdAndUpdate(courseId, {
      $pull: { modules: id },
    });

    await module.deleteOne();

    return NextResponse.json({ message: "Módulo deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar módulo:", error);
    return NextResponse.json(
      { error: "Erro ao deletar módulo" },
      { status: 500 }
    );
  }
}
