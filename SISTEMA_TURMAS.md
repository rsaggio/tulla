# Sistema de Turmas (Cohorts) - Documentação

## 📚 Visão Geral

O sistema de turmas permite organizar cursos em múltiplas turmas (cohorts), cada uma com:
- Datas de início e término específicas
- Grupo de alunos matriculados
- Instrutores responsáveis
- Status de andamento (Agendada, Ativa, Concluída, Cancelada)

## 🗄️ Modelo de Dados

### Model: Cohort

**Localização:** `src/models/Cohort.ts`

**Campos:**
- `courseId`: Referência ao curso
- `name`: Nome da turma (ex: "Turma 2026.1 - Manhã")
- `code`: Código único (ex: "DW-2026-1-M")
- `description`: Descrição opcional
- `startDate`: Data de início
- `endDate`: Data de término
- `status`: "scheduled" | "active" | "completed" | "cancelled"
- `students`: Array de IDs de alunos
- `instructors`: Array de IDs de instrutores
- `maxStudents`: Limite de alunos (opcional)
- `timezone`: Fuso horário
- `graduatedStudents`: Alunos formados
- `droppedStudents`: Alunos que desistiram

### Alterações em Models Existentes

**User.ts:**
- `enrolledCohorts`: Turmas do aluno
- `instructingCohorts`: Turmas do instrutor

**Progress.ts:**
- `cohortId`: Vínculo de progresso com turma

**Submission.ts:**
- `cohortId`: Vínculo de submissão com turma

## 🔌 APIs REST

### GET /api/cohorts
Lista todas as turmas (com filtros opcionais)

**Query params:**
- `courseId`: Filtrar por curso
- `status`: Filtrar por status
- `instructorId`: Filtrar por instrutor

**Resposta:** Array de turmas com populate de curso, instrutores e alunos

---

### POST /api/cohorts
Criar nova turma (apenas admin)

**Body:**
```json
{
  "courseId": "...",
  "name": "Turma 2026.1",
  "code": "DW-2026-1",
  "startDate": "2026-02-01",
  "endDate": "2026-08-01",
  "status": "scheduled",
  "instructors": ["instructor_id1", "instructor_id2"],
  "maxStudents": 30
}
```

---

### GET /api/cohorts/[cohortId]
Obter detalhes de uma turma

**Permissões:**
- Admin: vê tudo
- Instrutor: apenas suas turmas
- Aluno: apenas turmas onde está matriculado

---

### PATCH /api/cohorts/[cohortId]
Atualizar turma (apenas admin)

---

### DELETE /api/cohorts/[cohortId]
Deletar turma (apenas admin)
- Remove turma dos arrays `enrolledCohorts` e `instructingCohorts` dos usuários

---

### POST /api/cohorts/[cohortId]/students
Adicionar aluno à turma (apenas admin)

**Body:**
```json
{
  "studentId": "student_id"
}
```

**Validações:**
- Verifica se usuário é aluno
- Verifica limite de alunos
- Verifica duplicatas

---

### DELETE /api/cohorts/[cohortId]/students
Remover aluno da turma (apenas admin)

**Body:**
```json
{
  "studentId": "student_id"
}
```

## 🎨 Páginas Admin

### 1. /admin/turmas
Lista todas as turmas em cards com:
- Nome e código
- Status (chip colorido)
- Curso
- Datas de início/término
- Quantidade de alunos e instrutores
- Botões: Detalhes, Editar, Deletar

### 2. /admin/turmas/nova
Formulário para criar nova turma:
- Seleção de curso
- Nome e código
- Datas
- Status
- Limite de alunos
- Seleção múltipla de instrutores
- Fuso horário

### 3. /admin/turmas/[cohortId]
Página de detalhes mostrando:
- Informações gerais da turma
- Lista de alunos (primeiros 5 + link ver todos)
- Lista de instrutores (sidebar)
- Estatísticas (alunos matriculados, formados, desistentes)
- Botões: Editar, Gerenciar Alunos

### 4. /admin/turmas/[cohortId]/editar
Formulário de edição (similar ao de criação, pré-preenchido)

### 5. /admin/turmas/[cohortId]/alunos
Gestão de alunos:
- Lista completa de alunos matriculados
- Botão para adicionar alunos (dialog com autocomplete)
- Botão para remover alunos (com confirmação)
- Mostra contador e vagas disponíveis

## 🧭 Navegação

Menu lateral admin agora inclui:
- **Turmas** (ícone: School)

Localização entre "Métricas" e "Usuários"

## 📝 Próximas Implementações Sugeridas

### Para Instrutores:
- [ ] Dashboard filtrado por turma(s) que leciona
- [ ] Ver progresso dos alunos da turma
- [ ] Revisar submissões apenas da turma

### Para Alunos:
- [ ] Mostrar informações da turma no dashboard
- [ ] Ver colegas de turma
- [ ] Ranking dentro da turma (gamificação)

### Funcionalidades Avançadas:
- [ ] Fórum/chat por turma
- [ ] Agendamento de aulas ao vivo
- [ ] Certificados personalizados por turma
- [ ] Relatórios de progresso por turma
- [ ] Exportar dados da turma (Excel/PDF)
- [ ] Email marketing para turmas (anúncios, lembretes)

## 🎯 Como Usar

### 1. Criar um Curso
Acesse `/admin/conteudo` e crie um curso

### 2. Criar uma Turma
1. Acesse `/admin/turmas`
2. Clique em "Nova Turma"
3. Selecione o curso
4. Preencha informações da turma
5. Atribua instrutores

### 3. Adicionar Alunos
1. Acesse a turma em `/admin/turmas/[cohortId]`
2. Clique em "Gerenciar Alunos"
3. Use o autocomplete para buscar e adicionar alunos

### 4. Acompanhar Progresso
- Acesse detalhes da turma
- Veja estatísticas de alunos matriculados, formados e desistentes

## ✅ Status da Implementação

**Backend (100% completo):**
- ✅ Model Cohort criado
- ✅ Models existentes atualizados
- ✅ APIs REST completas
- ✅ Validações e permissões

**Frontend Admin (100% completo):**
- ✅ Listagem de turmas
- ✅ Criar turma
- ✅ Detalhes da turma
- ✅ Editar turma
- ✅ Gerenciar alunos
- ✅ Navegação atualizada

**Frontend Instrutor/Aluno (0% - sugestões acima):**
- ⏳ Pendente de implementação

## 🔒 Segurança

- Todas as rotas de turma exigem autenticação
- Apenas admins podem criar/editar/deletar turmas
- Instrutores só veem suas turmas
- Alunos só veem turmas onde estão matriculados
- Validações de dados no backend
- Código de turma único (index no banco)

---

**Desenvolvido com:** Next.js, MongoDB, Material-UI
**Data:** Janeiro 2026
