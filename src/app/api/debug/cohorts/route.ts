import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import Cohort from "@/models/Cohort";

export async function GET() {
  try {
    await connectDB();

    const alunos = await User.find({ role: 'aluno' })
      .select('name email enrolledCohorts')
      .lean();

    const turmas = await Cohort.find({})
      .select('name code status students')
      .lean();

    return NextResponse.json({
      alunos: alunos.map((a: any) => ({
        id: a._id,
        name: a.name,
        email: a.email,
        enrolledCohorts: a.enrolledCohorts || [],
      })),
      turmas: turmas.map((t: any) => ({
        id: t._id,
        name: t.name,
        code: t.code,
        status: t.status,
        studentsCount: t.students?.length || 0,
      })),
    });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
