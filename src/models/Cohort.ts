import mongoose, { Document, Schema } from "mongoose";

export interface ICohort extends Document {
  courseId: mongoose.Types.ObjectId;
  name: string;
  code: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: "scheduled" | "active" | "completed" | "cancelled";

  // Pessoas
  students: mongoose.Types.ObjectId[];
  instructors: mongoose.Types.ObjectId[];

  // Configurações
  maxStudents?: number;
  timezone?: string;
  meetingSchedule?: {
    day: string;
    time: string;
  };

  // Progresso
  graduatedStudents?: mongoose.Types.ObjectId[];
  droppedStudents?: mongoose.Types.ObjectId[];

  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CohortSchema = new Schema<ICohort>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "ID do curso é obrigatório"],
    },
    name: {
      type: String,
      required: [true, "Nome da turma é obrigatório"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Código da turma é obrigatório"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Data de início é obrigatória"],
    },
    endDate: {
      type: Date,
      required: [true, "Data de término é obrigatória"],
      validate: {
        validator: function (this: ICohort, value: Date) {
          return value > this.startDate;
        },
        message: "Data de término deve ser posterior à data de início",
      },
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    instructors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxStudents: {
      type: Number,
      min: [1, "Máximo de alunos deve ser maior que 0"],
    },
    timezone: {
      type: String,
      default: "America/Sao_Paulo",
    },
    meetingSchedule: {
      day: String,
      time: String,
    },
    graduatedStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    droppedStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// CohortSchema.index({ code: 1 }, { unique: true }); // Desabilitado para compatibilidade com Turbopack
// CohortSchema.index({ courseId: 1, status: 1 }); // Desabilitado para compatibilidade com Turbopack
// CohortSchema.index({ startDate: -1 }); // Desabilitado para compatibilidade com Turbopack

export default mongoose.models.Cohort ||
  mongoose.model<ICohort>("Cohort", CohortSchema);
