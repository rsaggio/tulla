import mongoose, { Document, Schema } from "mongoose";

export interface IQuizAnswer {
  questionIndex: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

export interface IQuizSubmission extends Document {
  quizId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  lessonId: mongoose.Types.ObjectId;
  answers: IQuizAnswer[];
  score: number; // Percentual de acertos (0-100)
  passed: boolean; // Se passou ou não
  completedAt: Date;
  timeSpent?: number; // Tempo gasto em minutos
  createdAt: Date;
  updatedAt: Date;
}

const QuizAnswerSchema = new Schema<IQuizAnswer>({
  questionIndex: {
    type: Number,
    required: true,
  },
  selectedAnswer: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
}, { _id: false });

const QuizSubmissionSchema = new Schema<IQuizSubmission>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "ID do quiz é obrigatório"],
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ID do aluno é obrigatório"],
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "ID da aula é obrigatório"],
    },
    answers: {
      type: [QuizAnswerSchema],
      required: [true, "Respostas são obrigatórias"],
    },
    score: {
      type: Number,
      required: [true, "Nota é obrigatória"],
      min: [0, "Nota deve ser >= 0"],
      max: [100, "Nota deve ser <= 100"],
    },
    passed: {
      type: Boolean,
      required: [true, "Status de aprovação é obrigatório"],
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    timeSpent: {
      type: Number,
      min: [0, "Tempo gasto deve ser >= 0"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.QuizSubmission ||
  mongoose.model<IQuizSubmission>("QuizSubmission", QuizSubmissionSchema);
