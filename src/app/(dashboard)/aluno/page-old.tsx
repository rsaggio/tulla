import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AlunoPage() {
  const session = await auth();

  return (
    <div sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div>
        <h1 variant="h3" fontWeight="bold">Olá, {session?.user?.name}!</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo ao seu dashboard de estudante
        </p>
      </div>

      <div container spacing={3}>
        <Card>
          <CardHeader>
            <CardTitle>Progresso Geral</CardTitle>
            <CardDescription>Seu avanço no curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div variant="h3" fontWeight="bold">0%</div>
            <p className="text-sm text-muted-foreground mt-2">
              Comece suas aulas para ver seu progresso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projetos</CardTitle>
            <CardDescription>Submissões pendentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div variant="h3" fontWeight="bold">0</div>
            <p className="text-sm text-muted-foreground mt-2">
              Nenhum projeto pendente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Módulo Atual</CardTitle>
            <CardDescription>Onde você está</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">Não iniciado</div>
            <p className="text-sm text-muted-foreground mt-2">
              Comece seu primeiro módulo
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Passos</CardTitle>
          <CardDescription>
            O que você deve fazer agora
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                1
              </div>
              <div>
                <h3 className="font-medium">Complete seu perfil</h3>
                <p variant="body2" color="text.secondary">
                  Adicione uma foto e informações sobre você
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                2
              </div>
              <div>
                <h3 className="font-medium">Comece o primeiro módulo</h3>
                <p variant="body2" color="text.secondary">
                  Acesse a área de Curso e comece a aprender
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                3
              </div>
              <div>
                <h3 className="font-medium">Submeta seu primeiro projeto</h3>
                <p variant="body2" color="text.secondary">
                  Complete as aulas e submeta seu projeto para revisão
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
