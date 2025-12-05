import mongoose, { Document, Schema } from "mongoose";

export interface IActivity extends Document {
  _id: string;
  lessonId: mongoose.Types.ObjectId;
  title: string;
  description: string; // Descrição da atividade em markdown
  instructions: string; // Instruções específicas
  expectedFormat?: string; // Formato esperado da resposta
  minWords?: number; // Número mínimo de palavras
  maxWords?: number; // Número máximo de palavras
  resources?: { title: string; url: string }[]; // Recursos adicionais
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: [true, "ID da aula é obrigatório"],
    },
    title: {
      type: String,
      required: [true, "Título da atividade é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Descrição da atividade é obrigatória"],
    },
    instructions: {
      type: String,
      required: [true, "Instruções são obrigatórias"],
    },
    expectedFormat: {
      type: String,
      trim: true,
    },
    minWords: {
      type: Number,
      min: [1, "Número mínimo de palavras deve ser >= 1"],
    },
    maxWords: {
      type: Number,
      min: [1, "Número máximo de palavras deve ser >= 1"],
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

export default mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);
