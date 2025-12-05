import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Lesson from "@/models/Lesson";
import Quiz from "@/models/Quiz";
import Activity from "@/models/Activity";
import QuizSubmission from "@/models/QuizSubmission";
import Submission from "@/models/Submission";
import Course from "@/models/Course";
import Progress from "@/models/Progress";
import mongoose from "mongoose";

// GET /api/lessons/[id] - Buscar detalhes da aula
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const { id } = await params;
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      return NextResponse.json(
        { error: "Aula não encontrada" },
        { status: 404 }
      );
    }

    // Atualizar última aula acessada no progresso
    const course = await Course.findOne({
      modules: { $in: [lesson.moduleId] },
    });

    if (course) {
      const lessonObjectId = new mongoose.Types.ObjectId(id);

      await Progress.findOneAndUpdate(
        {
          studentId: session.user.id,
          courseId: course._id,
        },
        {
          $set: {
            lastAccessedLessonId: lessonObjectId,
            lastActivityAt: new Date(),
          }
        },
        { upsert: true, new: true }
      );
    }

    let quiz = null;
    let activity = null;
    let quizSubmission = null;
    let activitySubmission = null;

    // Se for quiz, buscar o quiz associado
    if (lesson.type === "quiz") {
      quiz = await Quiz.findOne({ lessonId: id });

      // Buscar submissão anterior do aluno
      quizSubmission = await QuizSubmission.findOne({
        lessonId: id,
        studentId: session.user.id,
      }).sort({ createdAt: -1 });
    }

    // Se for activity, buscar a activity associada
    if (lesson.type === "activity") {
      activity = await Activity.findOne({ lessonId: id });

      // Buscar submissão anterior do aluno
      activitySubmission = await Submission.findOne({
        lessonId: id,
        studentId: session.user.id,
      }).sort({ createdAt: -1 });
    }

    return NextResponse.json({
      lesson,
      quiz,
      activity,
      quizSubmission,
      activitySubmission,
    });
  } catch (error) {
    console.error("Erro ao buscar aula:", error);
    return NextResponse.json(
      { error: "Erro ao buscar aula" },
      { status: 500 }
    );
  }
}
