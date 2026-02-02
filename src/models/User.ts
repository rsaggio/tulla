import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "aluno" | "instrutor" | "admin";
  profileImage?: string;
  createdAt: Date;
  lastLogin?: Date;
  // Campos específicos para alunos
  enrolledCourses?: mongoose.Types.ObjectId[];
  enrolledCohorts?: mongoose.Types.ObjectId[];
  completedModules?: mongoose.Types.ObjectId[];
  currentModule?: mongoose.Types.ObjectId;
  // Campos específicos para instrutores
  instructingCohorts?: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
    },
    password: {
      type: String,
      required: [true, "Senha é obrigatória"],
      minlength: [6, "Senha deve ter no mínimo 6 caracteres"],
    },
    role: {
      type: String,
      enum: ["aluno", "instrutor", "admin"],
      default: "aluno",
    },
    profileImage: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    // Campos específicos para alunos
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    enrolledCohorts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cohort",
      },
    ],
    completedModules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
    currentModule: {
      type: Schema.Types.ObjectId,
      ref: "Module",
    },
    // Campos específicos para instrutores
    instructingCohorts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cohort",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index para melhor performance
// UserSchema.index({ email: 1 }); // Desabilitado para compatibilidade com Turbopack
// UserSchema.index({ role: 1 }); // Desabilitado para compatibilidade com Turbopack

const UserModel = (mongoose.models?.User as any) || mongoose.model("User", UserSchema);
export default UserModel;
