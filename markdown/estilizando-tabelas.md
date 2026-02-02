# Estilizando Tabelas — thead, tbody, tfoot e nth-child

## Estrutura semântica da tabela

Uma tabela HTML pode ser dividida em três partes semânticas:

```
┌────────────────────────────────────┐
│  thead — Cabeçalho                 │
├────────────────────────────────────┤
│  tbody — Corpo (dados)             │
│  tbody — Corpo (dados)             │
│  tbody — Corpo (dados)             │
├────────────────────────────────────┤
│  tfoot — Rodapé (total, resumo)    │
└────────────────────────────────────┘
```

### As tags semânticas

| Tag | Significado | Conteúdo |
|---|---|---|
| `<thead>` | Table Head | Cabeçalho (primeira linha com títulos) |
| `<tbody>` | Table Body | Corpo (linhas de dados/produtos) |
| `<tfoot>` | Table Foot | Rodapé (total, resumo) |

```html
<table>
  <thead>
    <tr>
      <td>Produto</td>
      <td>Qtd</td>
      <td>Preço Unit.</td>
      <td>Subtotal</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Camiseta Polo Azul</td>
      <td>2</td>
      <td>R$ 199</td>
      <td>R$ 398</td>
    </tr>
    <tr>
      <td>Camiseta Polo Verde</td>
      <td>1</td>
      <td>R$ 199</td>
      <td>R$ 199</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Total</td>
      <td>R$ 597</td>
    </tr>
  </tfoot>
</table>
```

Visualmente não muda nada, mas o navegador agora sabe qual parte é cabeçalho, corpo e rodapé. Isso melhora a acessibilidade e permite estilizar cada parte separadamente.

---

## Espaçamento com padding no td

Por padrão, o conteúdo das células fica grudado. Adicionamos `padding` para dar respiro:

```css
table td {
  padding: 8px;
}
```

O padding cria distância entre o conteúdo e a borda da célula, tornando a tabela mais legível.

---

## `border-collapse: collapse`

Por padrão, cada célula tem sua própria borda separada, criando um espaço de 1px entre as bordas:

```
Sem border-collapse:
┌───┐ ┌───┐ ┌───┐
│ A │ │ B │ │ C │    ← espaço entre bordas
└───┘ └───┘ └───┘

Com border-collapse: collapse:
┌───┬───┬───┐
│ A │ B │ C │         ← bordas grudam
└───┴───┴───┘
```

```css
table {
  width: 100%;
  border-collapse: collapse;    /* gruda as bordas */
}
```

---

## Estilizando o cabeçalho (thead)

Usamos o seletor `table thead` para estilizar o cabeçalho:

```css
table thead {
  background-color: green;
  color: white;
  font-weight: bold;
}
```

Resultado: a primeira linha fica com fundo verde, texto branco e negrito — destacando visualmente o cabeçalho.

---

## Bordas na tabela

Para adicionar bordas e dar margem entre tabelas:

```css
table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;       /* borda cinza clara */
  margin: 16px 0;               /* 16px acima/abaixo, 0 esquerda/direita */
}
```

---

## Alinhamento com `text-align` e `nth-child`

### O problema

Em uma tabela de carrinho, colunas como "Qtd" e "Subtotal" ficam melhor centralizadas ou alinhadas à direita. Mas se aplicarmos `text-align` em todas as `<td>`, alinhamos tudo — incluindo o nome do produto.

### A solução: `nth-child()`

O pseudo-seletor `:nth-child()` permite selecionar um elemento específico pela sua posição:

```css
/* Centraliza a 2ª coluna (Qtd) */
tbody tr td:nth-child(2) {
  text-align: center;
}

/* Alinha à direita a 4ª coluna (Subtotal) */
tbody tr td:nth-child(4) {
  text-align: right;
}
```

| Seletor | O que seleciona |
|---|---|
| `td:nth-child(1)` | Primeira célula (Produto) |
| `td:nth-child(2)` | Segunda célula (Qtd) |
| `td:nth-child(3)` | Terceira célula (Preço Unit.) |
| `td:nth-child(4)` | Quarta célula (Subtotal) |

### Alinhando thead e tbody juntos

Para que o cabeçalho e o corpo compartilhem o mesmo alinhamento, podemos usar vírgula para agrupar seletores:

```css
/* Centraliza a 2ª coluna no cabeçalho E no corpo */
thead tr td:nth-child(2),
tbody tr td:nth-child(2) {
  text-align: center;
}

/* Alinha à direita a 4ª coluna no cabeçalho E no corpo */
thead tr td:nth-child(4),
tbody tr td:nth-child(4) {
  text-align: right;
}
```

---

## Classes utilitárias

Classes genéricas e reutilizáveis são chamadas de **classes utilitárias**. Elas fazem uma coisa só:

```css
/* Largura fixa */
.w-200 {
  width: 200px;
}

/* Remover fundo */
.no-background {
  background-color: transparent !important;
}
```

```html
<a href="#" class="button w-200">Finalizar Compra</a>

<div id="products" class="no-background">
  <!-- produtos sem fundo -->
</div>
```

A vantagem é que podemos combinar classes sem criar estilos específicos para cada elemento.

---

## Especificidade CSS: id vs classe vs `!important`

### O problema

Se um `id` define `background-color` e uma classe tenta mudar, o id vence:

```css
#products {
  background-color: #f5f5f5;    /* id — mais forte */
}

.no-background {
  background-color: transparent; /* classe — mais fraca, NÃO funciona */
}
```

### A hierarquia de especificidade

| Nível | Seletor | Força |
|---|---|---|
| 1 (mais fraco) | Tag (`td`, `div`) | Baixa |
| 2 | Classe (`.content`) | Média |
| 3 | ID (`#products`) | Alta |
| 4 (mais forte) | `!important` | Máxima |

### A solução: `!important`

Quando precisamos que uma classe sobrescreva um id, usamos `!important`:

```css
.no-background {
  background-color: transparent !important;  /* força a aplicação */
}
```

**Atenção:** use `!important` com moderação. Se tudo for `!important`, nada é importante. Prefira resolver conflitos ajustando a especificidade dos seletores.

---

## Centralizando conteúdo com flex-direction: column

Para centralizar verticalmente uma área de conteúdo:

```css
.content {
  display: flex;
  flex-direction: column;    /* empilha os filhos verticalmente */
  align-items: center;       /* centraliza horizontalmente */
  padding: 0 20px;
}
```

Com `flex-direction: column`, os filhos ficam empilhados de cima para baixo (em vez de lado a lado). O `align-items: center` centraliza todos no eixo horizontal.

---

## Exemplo completo: Carrinho estilizado

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carrinho</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" />

    <style>
      body {
        margin: 0;
        padding-top: 78px;
        font-family: "Open Sans", sans-serif;
      }

      .menu {
        position: fixed;
        top: 0;
        width: 100%;
        padding: 15px 30px;
        background-color: white;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
      }

      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 20px;
      }

      .default-title {
        color: darkgreen;
        text-align: center;
        padding-bottom: 10px;
      }

      /* Tabela estilizada */
      table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #ddd;
        margin: 16px 0;
      }

      table td {
        padding: 8px;
      }

      table thead {
        background-color: green;
        color: white;
        font-weight: bold;
      }

      /* Alinhamento por coluna */
      thead tr td:nth-child(2),
      tbody tr td:nth-child(2) {
        text-align: center;
      }

      thead tr td:nth-child(4),
      tbody tr td:nth-child(4) {
        text-align: right;
      }

      /* Classes utilitárias */
      .w-200 {
        width: 200px;
      }

      .no-background {
        background-color: transparent !important;
      }

      /* Botão */
      .button {
        display: block;
        padding: 12px;
        background-color: darkgreen;
        color: white;
        text-align: center;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="menu">
      <h2>Minha Loja</h2>
      <nav>
        <a href="home.html">Home</a>
        <a href="carrinho.html">Carrinho</a>
        <a href="contato.html">Contato</a>
      </nav>
    </div>

    <div class="content">
      <h2 class="default-title">Seu Carrinho</h2>

      <table>
        <thead>
          <tr>
            <td>Produto</td>
            <td>Qtd</td>
            <td>Preço Unit.</td>
            <td>Subtotal</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Camiseta Polo Azul</td>
            <td>2</td>
            <td>R$ 199</td>
            <td>R$ 398</td>
          </tr>
          <tr>
            <td>Camiseta Polo Verde</td>
            <td>1</td>
            <td>R$ 199</td>
            <td>R$ 199</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3">Total</td>
            <td>R$ 597</td>
          </tr>
        </tfoot>
      </table>

      <a href="#" class="button w-200">Finalizar Compra</a>

      <h2 class="default-title">Outras pessoas também compraram</h2>

      <div id="products" class="no-background">
        <!-- cards de produtos -->
      </div>
    </div>
  </body>
</html>
```

---

## Resumo visual

```
<!-- Estrutura semântica da tabela -->
<table>
  <thead>...</thead>       ← cabeçalho
  <tbody>...</tbody>       ← corpo (dados)
  <tfoot>...</tfoot>       ← rodapé (total)
</table>

/* Estilos da tabela */
table {
  border-collapse: collapse;   /* gruda as bordas */
  border: 1px solid #ddd;      /* borda cinza */
  margin: 16px 0;              /* espaço acima/abaixo */
}

table td {
  padding: 8px;                /* respiro nas células */
}

table thead {
  background-color: green;     /* fundo colorido */
  color: white;
  font-weight: bold;
}

/* Selecionar coluna específica */
td:nth-child(2) ................. 2ª coluna
td:nth-child(4) ................. 4ª coluna

/* Especificidade CSS */
tag .............. fraca
.classe .......... média
#id .............. forte
!important ....... máxima (usar com moderação!)

/* Classes utilitárias */
.w-200 { width: 200px; }
.no-background { background-color: transparent !important; }
```

---

## Exercício rápido

Pegue a tabela da aula anterior e:

- Divida em `<thead>`, `<tbody>` e `<tfoot>`
- Adicione `border-collapse: collapse` e `border: 1px solid #ddd`
- Estilize o cabeçalho com fundo colorido, texto branco e negrito
- Adicione `padding: 8px` nas células
- Use `nth-child(2)` para centralizar a coluna de quantidade
- Use `nth-child(4)` para alinhar o subtotal à direita
- Crie um botão "Finalizar Compra" com uma classe utilitária de largura
