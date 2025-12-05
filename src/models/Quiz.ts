import mongoose, { Document, Schema } from "mongoose";

export interface IQuizQuestion {
  question: string;
  options: string[]; // Array de opções (A, B, C, D)
  correctAnswer: number; // Índice da resposta correta (0-3)
  explanation?: string; // Explicação da resposta correta
}

export interface IQuiz extends Document {
  _id: string;
  lessonId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  questions: IQuizQuestion[];
  passingScore: number; // Percentual mínimo para passar (0-100)
  timeLimit?: number; // Tempo limite em minutos (opcional)
  createdAt: Date;
  updatedAt: Date;
}

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  question: {
    type: String,
    required: [true, "Pergunta é obrigatória"],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, "Opções são obrigatórias"],
    validate: {
      validator: function(v: string[]) {
        return v.length >= 2 && v.length <= 6;
      },
      message: "Deve haver entre 2 e 6 opções",
    },
  },
  correctAnswer: {
    type: Number,
    required: [true, "Resposta correta é obrigatória"],
    min: [0, "Índice da resposta deve ser >= 0"],
  },
  explanation: {
    type: String,
    trim: true,
  },
}, { _id: false });

const QuizSchema = new Schema<IQuiz>(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "ID da aula é obrigatório"],
    },
    title: {
      type: String,
      required: [true, "Título do quiz é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    questions: {
      type: [QuizQuestionSchema],
      required: [true, "Perguntas são obrigatórias"],
      validate: {
        validator: function(v: IQuizQuestion[]) {
          return v.length > 0;
        },
        message: "Deve haver pelo menos 1 pergunta",
      },
    },
    passingScore: {
      type: Number,
      default: 70,
      min: [0, "Nota mínima deve ser >= 0"],
      max: [100, "Nota mínima deve ser <= 100"],
    },
    timeLimit: {
      type: Number,
      min: [1, "Tempo limite deve ser >= 1 minuto"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Quiz ||
  mongoose.model<IQuiz>("Quiz", QuizSchema);
