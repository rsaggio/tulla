import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Course from "@/models/Course";
import Module from "@/models/Module";
import "@/models/Lesson"; // Importar para registrar o schema para populate

// GET /api/courses/[id] - Buscar curso por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    const { courseId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const course = await Course.findById(courseId).populate({
      path: "modules",
      populate: {
        path: "lessons",
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    return NextResponse.json(
      { error: "Erro ao buscar curso" },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Atualizar curso
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    const { courseId } = await params;

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();

    const course = await Course.findByIdAndUpdate(
      courseId,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Erro ao atualizar curso:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar curso" },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Deletar curso
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await auth();
    const { courseId } = await params;

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const course = await Course.findById(courseId);

    if (!course) {
      return NextResponse.json(
        { error: "Curso não encontrado" },
        { status: 404 }
      );
    }

    // Deletar todos os módulos associados
    if (course.modules && course.modules.length > 0) {
      await Module.deleteMany({ _id: { $in: course.modules } });
    }

    await course.deleteOne();

    return NextResponse.json({ message: "Curso deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar curso:", error);
    return NextResponse.json(
      { error: "Erro ao deletar curso" },
      { status: 500 }
    );
  }
}
