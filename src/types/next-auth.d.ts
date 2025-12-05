import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "aluno" | "instrutor" | "admin";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "aluno" | "instrutor" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: "aluno" | "instrutor" | "admin";
  }
}
