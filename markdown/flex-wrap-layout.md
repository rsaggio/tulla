# Flex Wrap, Min-Width e Layout de Seções

## Ajustando margens e paddings

Quando montamos um cartão de produto, os espaçamentos padrão das tags podem deixar tudo muito espaçado. Precisamos ajustar manualmente.

### Removendo margens padrão

Tags como `<h2>` e `<p>` vêm com margens padrão. Para controlar o espaçamento, zeramos e definimos valores específicos:

```css
h2 {
  margin-top: 4px;
  margin-bottom: 0;
}

p {
  margin-top: 4px;
  margin-bottom: 4px;
}
```

### Diferença entre `margin` e `margin-top`/`margin-bottom`

Quando usamos `margin: 4px`, o valor é aplicado em **todos os lados** (top, right, bottom, left). Para controlar cada lado individualmente:

```css
/* Todos os lados */
margin: 4px;

/* Lados específicos */
margin-top: 4px;
margin-bottom: 4px;
margin-left: 0;
margin-right: 0;
```

### Ajustando o padding do botão

O padding controla o espaço **interno** do elemento. Um botão com padding grande fica desproporcional:

```css
/* Botão muito grande */
.botao {
  padding-top: 18px;
  padding-bottom: 18px;
}

/* Botão mais compacto */
.botao {
  padding-top: 8px;
  padding-bottom: 8px;
}
```

Também podemos deixar o botão mais limpo removendo a borda:

```css
.botao {
  padding-top: 8px;
  padding-bottom: 8px;
  border: none;              /* remove a borda */
  border-radius: 8px;
}
```

---

## Usando classes em vez de tags genéricas

Quando estilizamos uma tag diretamente (`div`, `span`, `p`), o estilo se aplica a **todos** os elementos daquele tipo na página. Isso pode causar problemas quando adicionamos novos elementos.

```css
/* PROBLEMA — afeta TODAS as divs */
div {
  width: 250px;
}

/* SOLUÇÃO — afeta só as divs de produto */
.product {
  width: 250px;
}
```

No HTML, adicionamos a classe em cada cartão de produto:

```html
<div class="product">
  <img src="img/camiseta1.jpg" alt="Camiseta">
  <h2>Camiseta Azul</h2>
  <p>R$ 99</p>
  <a href="carrinho.html" class="botao">Comprar</a>
</div>
```

**Regra**: sempre prefira classes a seletores de tag quando o estilo é para um grupo específico de elementos.

---

## `min-width` — Largura mínima

A propriedade `width` define a largura padrão, mas o Flexbox pode encolher os elementos para caberem na linha. Para impedir isso, usamos `min-width`:

```css
.product {
  width: 250px;
  min-width: 250px;
}
```

- `width: 250px` — largura desejada
- `min-width: 250px` — o elemento **nunca** ficará menor que 250px

Sem `min-width`, o Flexbox pode comprimir os itens quando há muitos na mesma linha, quebrando o layout.

---

## `flex-wrap` — Quebrando linha no Flexbox

Por padrão, o Flexbox coloca **todos os itens na mesma linha**, mesmo que ultrapassem o tamanho do container. Isso cria uma barra de rolagem horizontal.

### O problema

```css
#vitrine {
  display: flex;
  gap: 20px;
}
```

Com muitos produtos, eles ficam espremidos ou criam scroll horizontal.

### A solução: `flex-wrap: wrap`

```css
#vitrine {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
```

Valores possíveis:

| Valor | Comportamento |
|---|---|
| `nowrap` | Todos na mesma linha (padrão) — pode espremer ou criar scroll |
| `wrap` | Quebra para a próxima linha quando não cabe |
| `wrap-reverse` | Quebra para cima (ordem invertida) |

Com `flex-wrap: wrap`, quando os itens não cabem na linha, os excedentes **caem para a linha de baixo** automaticamente.

---

## `background-color` em seções

Para criar seções visuais distintas na página, podemos alterar a cor de fundo de cada seção:

```css
#vitrine {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  padding: 50px;
  background-color: #f5f5f5;    /* cinza bem claro */
}
```

Lembre-se: `background-color` funciona em **qualquer elemento**. Use para:

- Seções da página (header, vitrine, footer)
- Cartões de produto
- Botões
- Qualquer área onde queira destacar visualmente

### Dica para escolher tons de cinza

Tons de cinza em hexadecimal vão de `#000000` (preto) a `#ffffff` (branco). Para um cinza claro e sutil:

```css
background-color: #f5f5f5;   /* cinza muito claro, quase branco */
background-color: #eeeeee;   /* cinza claro */
background-color: #cccccc;   /* cinza médio */
```

---

## Usando bordas para debug

Quando precisa entender onde um elemento começa e termina, adicione uma borda temporária:

```css
#vitrine {
  border-width: 1px;
  border-style: solid;
  border-color: red;
}
```

Ou de forma resumida:

```css
#vitrine {
  border: 1px solid red;
}
```

Lembre-se: a borda **sempre precisa de três valores** — tamanho, estilo e cor. Depois de entender o layout, remova a borda.

---

## Exemplo completo

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loja de Roupas</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" />

    <style>
      body {
        margin: 0;
        font-family: "Open Sans", sans-serif;
      }

      h1, h2, h3 {
        font-family: "Montserrat", sans-serif;
      }

      h2 {
        margin-top: 4px;
        margin-bottom: 0;
        text-align: center;
      }

      p {
        margin-top: 4px;
        margin-bottom: 4px;
      }

      #vitrine {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        padding: 50px;
        background-color: #f5f5f5;
      }

      .product {
        width: 250px;
        min-width: 250px;
      }

      img {
        width: 100%;
      }

      .botao {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        background-color: green;
        color: white;
        font-weight: bold;
        padding-top: 8px;
        padding-bottom: 8px;
        border: none;
        border-radius: 8px;
      }

      .botao:hover {
        background-color: darkgreen;
      }
    </style>
  </head>
  <body>
    <div id="vitrine">
      <div class="product">
        <img src="img/camiseta1.jpg" alt="Camiseta azul">
        <h2>Camiseta Azul</h2>
        <p>R$ 99</p>
        <a href="carrinho.html" class="botao">
          <span class="material-symbols-outlined">shopping_cart</span>
          Comprar
        </a>
      </div>
      <div class="product">
        <img src="img/camiseta2.jpg" alt="Camiseta vermelha">
        <h2>Camiseta Vermelha</h2>
        <p>R$ 89</p>
        <a href="carrinho.html" class="botao">
          <span class="material-symbols-outlined">shopping_cart</span>
          Comprar
        </a>
      </div>
      <!-- Mais produtos... -->
    </div>
  </body>
</html>
```

Com `flex-wrap: wrap`, os produtos se organizam automaticamente em linhas — se cabem 4, ficam 4; se a tela for menor, caem para a próxima linha.

---

## Resumo visual

```
/* Margens específicas */
margin-top: 4px .............. Margem só no topo
margin-bottom: 0 ............. Margem zero embaixo
margin: 4px .................. Margem igual em todos os lados

/* Largura mínima */
width: 250px ................. Largura desejada
min-width: 250px ............. Nunca menor que 250px

/* Flex Wrap */
flex-wrap: nowrap ............ Tudo na mesma linha (padrão)
flex-wrap: wrap .............. Quebra linha quando não cabe
flex-wrap: wrap-reverse ...... Quebra linha para cima

/* Cor de fundo */
background-color: #f5f5f5 ... Cinza claro
background-color: brown ..... Marrom

/* Borda para debug */
border: 1px solid red ........ Borda vermelha (forma resumida)
border: none ................. Remove borda

/* Classes vs tags */
div { } ...................... Afeta TODAS as divs (evitar)
.product { } ................. Afeta só elementos com class="product"
```

---

## Exercício rápido

Pegue a página de loja com vários produtos e:

- Adicione a classe `product` em cada cartão de produto
- Use `.product` no CSS em vez de `div` para definir a largura
- Defina `width` e `min-width` de 250px
- Adicione `flex-wrap: wrap` na div pai (vitrine)
- Ajuste as margens do `h2` e `p` para deixar o cartão mais compacto
- Reduza o padding do botão para 8px
- Adicione `background-color: #f5f5f5` na vitrine
