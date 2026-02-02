import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Project from "@/models/Project";
import Module from "@/models/Module";
import Lesson from "@/models/Lesson";
import Progress from "@/models/Progress";
import Course from "@/models/Course";

// GET /api/modules/[moduleId]/projects - Listar projetos do módulo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await auth();
    const { moduleId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const projects = await Project.find({ moduleId });

    // Buscar o módulo para saber quantas aulas ele tem
    const module = await Module.findById(moduleId).populate("lessons");

    if (!module) {
      return NextResponse.json(projects.map((p: any) => ({ ...p.toObject(), isLocked: false, completedLessons: 0, totalLessons: 0 })));
    }

    const totalLessons = module.lessons.length;

    // Buscar o progresso do aluno
    const course = await Course.findOne({ modules: { $in: [moduleId] } });
    let completedLessonsInModule = 0;

    if (course) {
      const progress = await Progress.findOne({
        studentId: session.user.id,
        courseId: course._id,
      });

      if (progress) {
        // Contar quantas aulas deste módulo foram completadas
        const moduleLessonIds = module.lessons.map((l: any) => l._id.toString());
        completedLessonsInModule = progress.completedLessons.filter((lessonId: any) =>
          moduleLessonIds.includes(lessonId.toString())
        ).length;
      }
    }

    // Verificar se o módulo está completo
    const isModuleComplete = completedLessonsInModule >= totalLessons && totalLessons > 0;

    // Adicionar informação de bloqueio a cada projeto
    const projectsWithLockStatus = projects.map((project: any) => ({
      ...project.toObject(),
      isLocked: !isModuleComplete,
      completedLessons: completedLessonsInModule,
      totalLessons,
      moduleName: module.title,
    }));

    return NextResponse.json(projectsWithLockStatus);
  } catch (error) {
    console.error("Erro ao listar projetos:", error);
    return NextResponse.json(
      { error: "Erro ao listar projetos" },
      { status: 500 }
    );
  }
}

// POST /api/modules/[moduleId]/projects - Criar novo projeto
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await auth();
    const { moduleId } = await params;

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    await connectDB();

    const body = await request.json();

    const project = await Project.create({
      ...body,
      moduleId,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}
