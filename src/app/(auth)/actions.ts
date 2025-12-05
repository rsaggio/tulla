"use server";

import { signIn } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou senha inválidos" };
        default:
          return { error: "Erro ao fazer login" };
      }
    }
    throw error;
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validações básicas
  if (!name || !email || !password || !confirmPassword) {
    return { error: "Todos os campos são obrigatórios" };
  }

  if (password !== confirmPassword) {
    return { error: "As senhas não coincidem" };
  }

  if (password.length < 6) {
    return { error: "A senha deve ter no mínimo 6 caracteres" };
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return { error: "Email inválido" };
  }

  try {
    await connectDB();

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return { error: "Este email já está cadastrado" };
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "aluno", // Por padrão, novos usuários são alunos
    });

    // Fazer login automático
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return { error: "Erro ao criar conta. Tente novamente." };
  }
}
