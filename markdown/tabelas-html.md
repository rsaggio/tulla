# Tabelas HTML e Páginas Múltiplas

## Navegando entre páginas

Quando temos múltiplas páginas no mesmo projeto (home.html, carrinho.html), conectamos com links:

```html
<!-- No menu -->
<a href="carrinho.html">Carrinho</a>
<a href="home.html">Home</a>
```

### Compartilhando estilos entre páginas

Cada página HTML tem seu próprio `<head>`. Para que o carrinho tenha os mesmos estilos da home, precisamos importar os mesmos recursos:

```html
<!-- carrinho.html -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Carrinho</title>

  <!-- Mesmas fontes e ícones da home -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" />

  <!-- Mesmo CSS -->
  <style>
    /* mesmos estilos ou importar arquivo CSS externo */
  </style>
</head>
```

Elementos comuns (menu, botão de suporte) podem ser copiados entre as páginas. Mais tarde, com JavaScript e frameworks, aprenderemos formas melhores de reaproveitar componentes.

---

## Criando uma área de conteúdo

Para organizar o conteúdo da página, criamos uma div com padding:

```html
<div class="content">
  <h2 class="default-title">Seu Carrinho</h2>
  <!-- conteúdo aqui -->
</div>
```

```css
.content {
  padding: 0 20px;     /* 0 cima/baixo, 20px esquerda/direita */
}

.default-title {
  color: darkgreen;
  text-align: left;
}
```

### Boa prática: nomes de classe em inglês

Use uma única língua (preferencialmente inglês) para todas as classes CSS:

```css
/* BOM — tudo em inglês */
.content { }
.product { }
.discount { }
.default-title { }

/* EVITAR — misturar línguas */
.conteudo { }
.produto { }
.desconto { }
```

---

## Tabelas HTML — `<table>`

Tabelas são usadas para exibir dados organizados em linhas e colunas — como um carrinho de compras, uma lista de preços ou uma tabela de frete.

### Estrutura básica

```html
<table>
  <tr>                          <!-- tr = table row (linha) -->
    <td>Camiseta Azul</td>     <!-- td = table data (célula) -->
    <td>2</td>
    <td>R$ 199</td>
    <td>R$ 398</td>
  </tr>
</table>
```

| Tag | Significado | Função |
|---|---|---|
| `<table>` | Table | Container da tabela |
| `<tr>` | Table Row | Uma linha da tabela |
| `<td>` | Table Data | Uma célula de dados |

### Múltiplas linhas

Cada `<tr>` cria uma nova linha. As `<td>` dentro de cada `<tr>` criam as colunas:

```html
<table>
  <!-- Linha 1: Cabeçalho -->
  <tr>
    <td>Produto</td>
    <td>Qtd</td>
    <td>Preço Unit.</td>
    <td>Subtotal</td>
  </tr>
  <!-- Linha 2: Produto 1 -->
  <tr>
    <td>Camiseta Polo Azul</td>
    <td>2</td>
    <td>R$ 199</td>
    <td>R$ 398</td>
  </tr>
  <!-- Linha 3: Produto 2 -->
  <tr>
    <td>Camiseta Polo Verde</td>
    <td>1</td>
    <td>R$ 199</td>
    <td>R$ 199</td>
  </tr>
</table>
```

Resultado visual:

```
| Produto             | Qtd | Preço Unit. | Subtotal |
| Camiseta Polo Azul  | 2   | R$ 199      | R$ 398   |
| Camiseta Polo Verde | 1   | R$ 199      | R$ 199   |
```

---

## `colspan` — Mesclando colunas

Quando uma célula precisa ocupar mais de uma coluna, usamos o atributo `colspan`:

```html
<tr>
  <td colspan="3">Total</td>    <!-- ocupa 3 colunas -->
  <td>R$ 597</td>
</tr>
```

Sem `colspan`, a célula "Total" ocuparia apenas uma coluna e a tabela ficaria desalinhada.

```
Sem colspan:
| Total |       |       | R$ 597 |   ← desalinhado, 2 células vazias

Com colspan="3":
| Total                 | R$ 597 |   ← "Total" ocupa 3 colunas
```

---

## `rowspan` — Mesclando linhas

Quando uma célula precisa ocupar mais de uma linha, usamos `rowspan`:

```html
<table>
  <tr>
    <td rowspan="2">Frete</td>   <!-- ocupa 2 linhas -->
    <td>São Paulo</td>
    <td>R$ 15</td>
  </tr>
  <tr>
    <!-- Não precisa de td para "Frete" — já está ocupando essa linha -->
    <td>Rio de Janeiro</td>
    <td>R$ 16</td>
  </tr>
</table>
```

Resultado:

```
| Frete | São Paulo      | R$ 15 |
|       | Rio de Janeiro | R$ 16 |
```

A célula "Frete" se estica para baixo, ocupando as duas linhas. Na segunda `<tr>`, **não** colocamos uma `<td>` para "Frete" porque ela já está sendo ocupada pelo `rowspan`.

### Diferença entre colspan e rowspan

| Atributo | Direção | Função |
|---|---|---|
| `colspan="3"` | Horizontal → | Célula ocupa 3 **colunas** |
| `rowspan="2"` | Vertical ↓ | Célula ocupa 2 **linhas** |

---

## Exemplo completo: Página do carrinho

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
        padding: 0 20px;
      }

      .default-title {
        color: darkgreen;
        text-align: left;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      table td {
        padding: 8px;
      }
    </style>
  </head>
  <body>
    <div class="menu">
      <h2>Minha Loja</h2>
      <nav>
        <a href="home.html">Home</a>
        <a href="carrinho.html">Carrinho</a>
      </nav>
    </div>

    <div class="content">
      <h2 class="default-title">Seu Carrinho</h2>

      <!-- Tabela de produtos -->
      <table>
        <tr>
          <td>Produto</td>
          <td>Qtd</td>
          <td>Preço Unit.</td>
          <td>Subtotal</td>
        </tr>
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
        <tr>
          <td colspan="3">Total</td>
          <td>R$ 597</td>
        </tr>
      </table>

      <!-- Tabela de frete -->
      <h2 class="default-title">Frete</h2>

      <table>
        <tr>
          <td rowspan="2">Frete</td>
          <td>São Paulo</td>
          <td>R$ 15</td>
        </tr>
        <tr>
          <td>Rio de Janeiro</td>
          <td>R$ 16</td>
        </tr>
      </table>
    </div>
  </body>
</html>
```

---

## Resumo visual

```
<!-- Tabela básica -->
<table>
  <tr>                    ← linha (table row)
    <td>dado</td>        ← célula (table data)
    <td>dado</td>
  </tr>
</table>

<!-- Mesclar colunas (horizontal) -->
<td colspan="3">Total</td>    ← ocupa 3 colunas

<!-- Mesclar linhas (vertical) -->
<td rowspan="2">Frete</td>    ← ocupa 2 linhas

/* CSS para área de conteúdo */
.content {
  padding: 0 20px;       /* 0 cima/baixo, 20px esquerda/direita */
}

/* Boa prática: classes em inglês */
.content ................. conteúdo
.product ................. produto
.discount ................ desconto
.default-title ........... título padrão
```

---

## Exercício rápido

Crie uma página carrinho.html com:

- O mesmo menu da home (copiado)
- Uma div com class="content" e padding lateral
- Um h2 com class="default-title" escrito "Seu Carrinho"
- Uma tabela com pelo menos 3 produtos (nome, quantidade, preço unitário, subtotal)
- Uma linha de total usando `colspan="3"` para mesclar as 3 primeiras colunas
- Uma segunda tabela de frete com `rowspan="2"` para a célula "Frete"
