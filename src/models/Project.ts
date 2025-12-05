import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  _id: string;
  moduleId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  rubric: { criterion: string; points: number; description: string }[];
  estimatedHours: number;
  githubRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "ID do módulo é obrigatório"],
    },
    title: {
      type: String,
      required: [true, "Título do projeto é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Descrição do projeto é obrigatória"],
    },
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    deliverables: [
      {
        type: String,
        required: true,
      },
    ],
    rubric: [
      {
        criterion: {
          type: String,
          required: true,
        },
        points: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    estimatedHours: {
      type: Number,
      required: [true, "Horas estimadas são obrigatórias"],
      min: [1, "Horas estimadas devem ser maior que 0"],
    },
    githubRequired: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// ProjectSchema.index({ moduleId: 1 }); // Desabilitado para compatibilidade com Turbopack

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
