import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Module from "@/models/Module";
import Course from "@/models/Course";

// GET /api/courses/[courseId]/modules - Listar módulos do curso
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

    const modules = await Module.find({ courseId })
      .populate("lessons")
      .sort({ order: 1 });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Erro ao listar módulos:", error);
    return NextResponse.json(
      { error: "Erro ao listar módulos" },
      { status: 500 }
    );
  }
}

// POST /api/courses/[courseId]/modules - Criar novo módulo
export async function POST(
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

    // Criar módulo
    const module = await Module.create({
      ...body,
      courseId,
    });

    // Adicionar módulo ao curso
    await Course.findByIdAndUpdate(courseId, {
      $push: { modules: module._id },
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar módulo:", error);
    return NextResponse.json(
      { error: "Erro ao criar módulo" },
      { status: 500 }
    );
  }
}
