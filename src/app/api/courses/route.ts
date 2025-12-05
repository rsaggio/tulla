import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Course from "@/models/Course";
import "@/models/Module"; // Importar para registrar o schema para populate

// GET /api/courses - Listar todos os cursos
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const courses = await Course.find()
      .populate("modules")
      .sort({ createdAt: -1 });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Erro ao listar cursos:", error);
    return NextResponse.json(
      { error: "Erro ao listar cursos" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Criar novo curso
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();

    const course = await Course.create({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    return NextResponse.json(
      { error: "Erro ao criar curso" },
      { status: 500 }
    );
  }
}
