import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Cohort from "@/models/Cohort";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

// GET - Listar todos os usuários (apenas admin)
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Sem permissão" },
        { status: 403 }
      );
    }

    await connectDB();

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}

// POST - Criar novo usuário (apenas admin)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Sem permissão" },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const { name, email, password, role, cohortId } = body;

    // Verificar se email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "aluno",
    });

    // Matricular na turma se cohortId foi informado
    if (cohortId && (role === "aluno" || !role)) {
      try {
        const cohort = await Cohort.findById(cohortId);
        if (cohort) {
          cohort.students.push(user._id);
          await cohort.save();

          user.enrolledCohorts = [cohortId];
          user.enrolledCourses = [cohort.courseId];
          await user.save();
        }
      } catch (cohortError) {
        console.error("Erro ao matricular aluno na turma:", cohortError);
      }
    }

    // Enviar email de boas-vindas
    try {
      await sendWelcomeEmail(
        user.email,
        user.name,
        user.role,
        password // Enviar senha original (temporária)
      );
    } catch (emailError) {
      console.error("Erro ao enviar email de boas-vindas:", emailError);
      // Não falhar a requisição se o email falhar
    }

    // Retornar sem a senha
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
