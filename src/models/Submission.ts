import mongoose, { Document, Schema } from "mongoose";

export interface ISubmission extends Document {
  _id: string;
  projectId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  submittedAt: Date;
  githubUrl?: string;
  fileUrl?: string;
  notes?: string;
  status: "pendente" | "em_revisao" | "aprovado" | "reprovado";
  feedback?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  grade?: number;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "ID do projeto é obrigatório"],
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ID do aluno é obrigatório"],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pendente", "em_revisao", "aprovado", "reprovado"],
      default: "pendente",
    },
    feedback: {
      type: String,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    grade: {
      type: Number,
      min: [0, "Nota deve ser maior ou igual a 0"],
      max: [100, "Nota deve ser menor ou igual a 100"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// SubmissionSchema.index({ projectId: 1, studentId: 1 }); // Desabilitado para compatibilidade com Turbopack
// SubmissionSchema.index({ status: 1, submittedAt: 1 }); // Desabilitado para compatibilidade com Turbopack
// SubmissionSchema.index({ studentId: 1, submittedAt: -1 }); // Desabilitado para compatibilidade com Turbopack

export default mongoose.models.Submission ||
  mongoose.model<ISubmission>("Submission", SubmissionSchema);
