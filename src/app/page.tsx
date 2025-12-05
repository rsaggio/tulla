import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    // Se está logado, redireciona para o dashboard apropriado
    redirect(`/${session.user.role}`);
  }

  // Se não está logado, redireciona para login
  redirect("/login");
}
