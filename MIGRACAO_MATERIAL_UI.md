# Migração Tailwind CSS → Material-UI

## ✅ Migração Concluída

### Componentes Base Convertidos
Todos os componentes em `src/components/ui/` foram convertidos para wrappers do Material-UI:

- **button.tsx** → MUI Button + IconButton
- **card.tsx** → MUI Card + subcomponentes
- **input.tsx** → MUI TextField
- **textarea.tsx** → MUI TextField (multiline)
- **badge.tsx** → MUI Chip
- **label.tsx** → MUI FormLabel

### Infraestrutura
- ✅ **src/lib/theme.ts** - Tema customizado mantendo cores originais
- ✅ **src/components/providers/ThemeProvider.tsx** - Provider MUI + CssBaseline
- ✅ **src/app/layout.tsx** - Layout raiz com ThemeProvider
- ✅ **src/app/(dashboard)/layout.tsx** - Layout dashboard com Box e Container

### Páginas Convertidas
#### Autenticação
- ✅ `src/app/(auth)/login/page.tsx`
- ✅ `src/app/(auth)/cadastro/page.tsx`

#### Dashboard
- ✅ `src/components/shared/DashboardNav.tsx` - Navegação lateral
- ✅ `src/app/(dashboard)/aluno/page.tsx` - Dashboard principal do aluno
- ✅ `src/app/(dashboard)/aluno/curso/page.tsx` - Página de curso com módulos

### Limpeza Realizada
- ✅ Removido Tailwind CSS, PostCSS, Autoprefixer do package.json
- ✅ Removido `tailwind.config.ts`
- ✅ Removido `src/app/globals.css`
- ✅ Removido `src/lib/utils.ts` (cn function)
- ✅ Instalado @mui/material, @emotion/react, @emotion/styled, @mui/icons-material

## 🔄 Páginas Pendentes de Conversão

### Aluno (3 páginas)
- [ ] `src/app/(dashboard)/aluno/curso/aula/[id]/page.tsx` - Visualização de aula
- [ ] `src/app/(dashboard)/aluno/projetos/page.tsx` - Lista de projetos
- [ ] `src/app/(dashboard)/aluno/perfil/page.tsx` - Perfil do aluno (se existir)

### Instrutor (3 páginas)
- [ ] `src/app/(dashboard)/instrutor/page.tsx` - Dashboard instrutor
- [ ] `src/app/(dashboard)/instrutor/alunos/page.tsx` - Lista de alunos
- [ ] `src/app/(dashboard)/instrutor/revisoes/page.tsx` - Revisões pendentes

### Admin (10+ páginas)
- [ ] `src/app/(dashboard)/admin/page.tsx` - Dashboard admin
- [ ] `src/app/(dashboard)/admin/metricas/page.tsx` - Métricas
- [ ] `src/app/(dashboard)/admin/usuarios/page.tsx` - Gerenciar usuários
- [ ] `src/app/(dashboard)/admin/conteudo/page.tsx` - Lista de cursos
- [ ] `src/app/(dashboard)/admin/conteudo/novo/page.tsx` - Criar curso
- [ ] `src/app/(dashboard)/admin/conteudo/[courseId]/page.tsx` - Detalhes do curso
- [ ] `src/app/(dashboard)/admin/conteudo/[courseId]/editar/page.tsx` - Editar curso
- [ ] `src/app/(dashboard)/admin/conteudo/[courseId]/modulos/[moduleId]/page.tsx` - Detalhes módulo
- [ ] `src/app/(dashboard)/admin/conteudo/[courseId]/modulos/[moduleId]/editar/page.tsx` - Editar módulo
- [ ] `src/app/(dashboard)/admin/conteudo/[courseId]/modulos/[moduleId]/aulas/[lessonId]/editar/page.tsx` - Editar aula

## 📖 Guia de Conversão

### Padrão de Conversão: Tailwind → Material-UI

#### 1. Imports Necessários
```typescript
// Adicione no topo do arquivo:
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress"; // para loading
```

#### 2. Classes Tailwind → Props MUI

**Layout Flex:**
```tsx
// Antes:
<div className="flex items-center justify-between gap-4">

// Depois:
<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
```

**Espaçamento Vertical (Stack):**
```tsx
// Antes:
<div className="space-y-4">

// Depois:
<Stack spacing={2}>
```

**Grid:**
```tsx
// Antes:
<div className="grid gap-6 md:grid-cols-3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Depois:
<Grid container spacing={3}>
  <Grid item xs={12} md={4}>Item 1</Grid>
  <Grid item xs={12} md={4}>Item 2</Grid>
</Grid>
```

**Tipografia:**
```tsx
// Antes:
<h1 className="text-3xl font-bold">Título</h1>
<p className="text-sm text-muted-foreground">Descrição</p>

// Depois:
<Typography variant="h3" fontWeight="bold">Título</Typography>
<Typography variant="body2" color="text.secondary">Descrição</Typography>
```

**Padding/Margin:**
```tsx
// Antes:
<div className="mt-4 p-6">

// Depois:
<Box sx={{ mt: 2, p: 3 }}>

// Nota: MUI usa escala 8px (1 = 8px, 2 = 16px, 3 = 24px, etc)
```

**Background/Border:**
```tsx
// Antes:
<div className="bg-primary/10 border border-primary/30 rounded-lg">

// Depois:
<Paper sx={{ bgcolor: "primary.light", border: 1, borderColor: "primary.main", borderRadius: 2 }}>
```

**Hover States:**
```tsx
// Antes:
<div className="hover:bg-muted transition-colors cursor-pointer">

// Depois:
<Box sx={{
  "&:hover": { bgcolor: "action.hover" },
  cursor: "pointer",
  transition: "background-color 0.2s"
}}>
```

**Loading States:**
```tsx
// Antes:
<div className="flex items-center justify-center min-h-[400px]">
  <p>Carregando...</p>
</div>

// Depois:
<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
  <CircularProgress />
</Box>
```

#### 3. Conversão de Cores

| Tailwind | Material-UI |
|----------|-------------|
| `text-primary` | `color="primary.main"` |
| `text-muted-foreground` | `color="text.secondary"` |
| `bg-primary` | `bgcolor="primary.main"` |
| `bg-secondary` | `bgcolor="secondary.main"` |
| `bg-muted` | `bgcolor="action.hover"` |
| `border-border` | `borderColor="divider"` |

#### 4. Template de Conversão de Página

```typescript
"use client"; // se necessário

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Adicionar imports MUI necessários:
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

export default function MinhaPage() {
  // ... lógica existente

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h3" fontWeight="bold">Título</Typography>
        <Typography color="text.secondary">Descrição</Typography>
      </Box>

      {/* Conteúdo */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader>
              <CardTitle>Card</CardTitle>
            </CardHeader>
            <CardContent>
              {/* conteúdo */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
```

## 🚀 Como Continuar a Migração

### Opção 1: Conversão Manual (Recomendado)
1. Abra um arquivo por vez
2. Adicione os imports MUI necessários
3. Substitua as classes Tailwind seguindo os padrões acima
4. Teste a página no navegador
5. Ajuste conforme necessário

### Opção 2: Conversão em Lote
Use o padrão das páginas já convertidas como referência e faça find/replace para padrões comuns:

```bash
# Exemplo: substituir className em múltiplos arquivos
find src/app/\(dashboard\) -name "*.tsx" -exec sed -i 's/className="flex items-center"/sx={{ display: "flex", alignItems: "center" }}/g' {} +
```

### Opção 3: Converter Conforme Uso
Converta apenas as páginas que você estiver usando ativamente. Como a infraestrutura e componentes base estão prontos, cada página funciona independentemente.

## 🔧 Comandos Úteis

### Iniciar Servidor (dentro do WSL)
```bash
cd ~/tulla2
npm install  # instalar dependências atualizadas
npm run dev
```

### Verificar Compilação
```bash
npm run build
```

### Procurar Classes Tailwind Restantes
```bash
grep -r "className=" src/app/\(dashboard\) | grep -E "text-|bg-|flex|grid" | wc -l
```

## 📝 Notas Importantes

1. **Componentes UI**: Os wrappers em `src/components/ui/` mantêm compatibilidade com a API antiga, então a maioria dos códigos funcionará sem mudanças nos componentes

2. **Ícones**: Lucide React continua funcionando normalmente, não precisa mudar

3. **Links**: Next.js Link continua igual, apenas retire `className` e use `style={{ textDecoration: "none" }}` se necessário

4. **Responsividade**: Use Grid com breakpoints:
   - `xs={12}` - 100% em mobile
   - `md={6}` - 50% em tablet+
   - `lg={4}` - 33% em desktop

5. **Theme**: Todas as cores e estilos estão em `src/lib/theme.ts`. Você pode personalizar lá.

## 🎨 Referência Rápida de Cores

As cores do tema mantêm as mesmas do Tailwind original:
- **primary**: Azul (#4263EB)
- **secondary**: Verde (#10B981)
- **error**: Vermelho (para destructive)
- **success**: Verde (para aprovações)

Use via `color="primary.main"` ou `bgcolor="secondary.light"`.

## 📚 Recursos Adicionais

- [Material-UI Docs](https://mui.com/material-ui/getting-started/)
- [MUI Box Component](https://mui.com/material-ui/react-box/)
- [MUI Typography](https://mui.com/material-ui/react-typography/)
- [MUI Grid](https://mui.com/material-ui/react-grid/)
- [MUI sx prop](https://mui.com/system/getting-started/the-sx-prop/)

---

**Status da Migração**: ✅ Infraestrutura completa | ⚠️ 16 páginas pendentes | 🎯 Pronto para uso
