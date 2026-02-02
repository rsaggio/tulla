import mongoose, { Document, Schema } from "mongoose";

export interface IProgress extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  cohortId?: mongoose.Types.ObjectId;
  completedLessons: mongoose.Types.ObjectId[];
  completedProjects: mongoose.Types.ObjectId[];
  currentModuleId?: mongoose.Types.ObjectId;
  lastAccessedLessonId?: mongoose.Types.ObjectId;
  startedAt: Date;
  lastActivityAt: Date;
  overallProgress: number; // Percentual de 0 a 100
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ID do aluno é obrigatório"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "ID do curso é obrigatório"],
    },
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: "Cohort",
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    completedProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    currentModuleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
    },
    lastAccessedLessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    overallProgress: {
      type: Number,
      default: 0,
      min: [0, "Progresso deve ser maior ou igual a 0"],
      max: [100, "Progresso deve ser menor ou igual a 100"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// ProgressSchema.index({ studentId: 1, courseId: 1 }, { unique: true }); // Desabilitado para compatibilidade com Turbopack
// ProgressSchema.index({ lastActivityAt: -1 }); // Desabilitado para compatibilidade com Turbopack

// Forçar recompilação do modelo para incluir novos campos
if (mongoose.models.Progress) {
  delete mongoose.models.Progress;
}

export default mongoose.model<IProgress>("Progress", ProgressSchema);
