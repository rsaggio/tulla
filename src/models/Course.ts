import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: number; // em horas
  prerequisites?: string[];
  modules: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "Título do curso é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Descrição do curso é obrigatória"],
    },
    thumbnail: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, "Duração do curso é obrigatória"],
      min: [1, "Duração deve ser maior que 0"],
    },
    prerequisites: [
      {
        type: String,
      },
    ],
    modules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
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
// CourseSchema.index({ isActive: 1 }); // Desabilitado para compatibilidade com Turbopack
// CourseSchema.index({ createdAt: -1 }); // Desabilitado para compatibilidade com Turbopack

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
