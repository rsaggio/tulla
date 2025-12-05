import mongoose, { Document, Schema } from "mongoose";

export interface IModule extends Document {
  _id: string;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  order: number;
  lessons: mongoose.Types.ObjectId[];
  estimatedHours: number;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "ID do curso é obrigatório"],
    },
    title: {
      type: String,
      required: [true, "Título do módulo é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Descrição do módulo é obrigatória"],
    },
    order: {
      type: Number,
      required: [true, "Ordem do módulo é obrigatória"],
      min: [1, "Ordem deve ser maior que 0"],
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    estimatedHours: {
      type: Number,
      required: [true, "Horas estimadas são obrigatórias"],
      min: [0, "Horas estimadas devem ser maior ou igual a 0"],
    },
    skills: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
// ModuleSchema.index({ courseId: 1, order: 1 }); // Desabilitado para compatibilidade com Turbopack

export default mongoose.models.Module ||
  mongoose.model<IModule>("Module", ModuleSchema);
