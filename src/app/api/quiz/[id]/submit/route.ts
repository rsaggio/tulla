import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Quiz from "@/models/Quiz";
import QuizSubmission from "@/models/QuizSubmission";
import Progress from "@/models/Progress";
import Lesson from "@/models/Lesson";
import Course from "@/models/Course";

// POST /api/quiz/[id]/submit - Enviar respostas do quiz
export async function POST(
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
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return NextResponse.json(
        { error: "Quiz não encontrado" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { answers, score, passed } = body;

    // Validar respostas
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Respostas inválidas" },
        { status: 400 }
      );
    }

    // Criar array de respostas com verificação de corretude
    const quizAnswers = quiz.questions.map((question: any, index: number) => ({
      questionIndex: index,
      selectedAnswer: answers[index],
      isCorrect: answers[index] === question.correctAnswer,
    }));

    // Criar submissão
    const submission = await QuizSubmission.create({
      quizId: id,
      studentId: session.user.id,
      lessonId: quiz.lessonId,
      answers: quizAnswers,
      score,
      passed,
    });

    // Se passou, marcar aula como completa
    if (passed) {
      const lesson = await Lesson.findById(quiz.lessonId);

      if (lesson) {
        const course = await Course.findOne({
          modules: { $in: [lesson.moduleId] },
        });

        if (course) {
          let progress = await Progress.findOne({
            studentId: session.user.id,
            courseId: course._id,
          });

          if (!progress) {
            progress = await Progress.create({
              studentId: session.user.id,
              courseId: course._id,
              completedLessons: [quiz.lessonId],
              completedProjects: [],
              overallProgress: 0,
            });
          } else {
            if (!progress.completedLessons.includes(quiz.lessonId as any)) {
              progress.completedLessons.push(quiz.lessonId as any);
              progress.lastActivityAt = new Date();
              await progress.save();
            }
          }

          // Atualizar progresso geral
          const totalLessons = await Lesson.countDocuments({
            moduleId: { $in: course.modules },
          });
          const completedCount = progress.completedLessons.length;
          const overallProgress = Math.round(
            (completedCount / totalLessons) * 100
          );

          progress.overallProgress = overallProgress;
          await progress.save();
        }
      }
    }

    return NextResponse.json({
      success: true,
      submission: {
        score: submission.score,
        passed: submission.passed,
        completedAt: submission.completedAt,
      },
    });
  } catch (error) {
    console.error("Erro ao enviar quiz:", error);
    return NextResponse.json(
      { error: "Erro ao enviar quiz" },
      { status: 500 }
    );
  }
}
