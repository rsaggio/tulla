import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPage() {
  const session = await auth();

  return (
    <div sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div>
        <h1 variant="h3" fontWeight="bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground mt-1">
          Olá, {session?.user?.name}! Gerencie a plataforma
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Usuários</CardTitle>
            <CardDescription>Todos os roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div variant="h3" fontWeight="bold">0</div>
            <p className="text-sm text-muted-foreground mt-2">
              Nenhum usuário cadastrado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alunos</CardTitle>
            <CardDescription>Estudantes ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div variant="h3" fontWeight="bold">0</div>
            <p className="text-sm text-muted-foreground mt-2">
              0 ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos</CardTitle>
            <CardDescription>Conteúdo disponível</CardDescription>
          </CardHeader>
          <CardContent>
            <div variant="h3" fontWeight="bold">0</div>
            <p className="text-sm text-muted-foreground mt-2">
              Nenhum curso criado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conclusão</CardTitle>
            <CardDescription>Média geral</CardDescription>
          </CardHeader>
          <CardContent>
            <div variant="h3" fontWeight="bold">-</div>
            <p className="text-sm text-muted-foreground mt-2">
              Dados insuficientes
            </p>
          </CardContent>
        </Card>
      </div>

      <div container spacing={3}>
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Tarefas administrativas comuns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                Criar novo curso
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                Adicionar usuário
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                Ver métricas detalhadas
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas do Sistema</CardTitle>
            <CardDescription>
              Notificações importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum alerta no momento
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
