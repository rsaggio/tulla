import mongoose, { Document, Schema } from "mongoose";

export interface ILesson extends Document {
  moduleId: mongoose.Types.ObjectId;
  title: string;
  content: string; // Markdown
  videoUrl?: string; // URL do vídeo após upload
  videoFileName?: string; // Nome original do arquivo
  order: number;
  type: "teoria" | "video" | "leitura" | "quiz" | "activity";
  duration?: number; // Duração estimada em minutos
  resources?: { title: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: [true, "ID do módulo é obrigatório"],
    },
    title: {
      type: String,
      required: [true, "Título da aula é obrigatório"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Conteúdo da aula é obrigatório"],
    },
    videoUrl: {
      type: String,
    },
    videoFileName: {
      type: String,
    },
    order: {
      type: Number,
      required: [true, "Ordem da aula é obrigatória"],
      min: [1, "Ordem deve ser maior que 0"],
    },
    type: {
      type: String,
      enum: ["teoria", "video", "leitura", "quiz", "activity"],
      default: "teoria",
    },
    duration: {
      type: Number,
      min: [1, "Duração deve ser maior que 0"],
    },
    resources: [
      {
        title: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
// LessonSchema.index({ moduleId: 1, order: 1 }); // Desabilitado para compatibilidade com Turbopack

export default mongoose.models.Lesson ||
  mongoose.model<ILesson>("Lesson", LessonSchema);
