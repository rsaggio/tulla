import mongoose, { Document, Schema } from "mongoose";

export interface ILiveClass extends Document {
  _id: string;
  cohortId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  recordingUrl: string; // URL do Google Drive
  date: Date;
  duration?: number; // em minutos
  instructor: mongoose.Types.ObjectId;
  thumbnail?: string;
  topics?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LiveClassSchema = new Schema<ILiveClass>(
  {
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: "Cohort",
      required: [true, "ID da turma é obrigatório"],
    },
    title: {
      type: String,
      required: [true, "Título da aula é obrigatório"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    recordingUrl: {
      type: String,
      required: [true, "URL da gravação é obrigatória"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Data da aula é obrigatória"],
    },
    duration: {
      type: Number,
      min: [1, "Duração deve ser maior que 0"],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instrutor é obrigatório"],
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    topics: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.LiveClass ||
  mongoose.model<ILiveClass>("LiveClass", LiveClassSchema);
