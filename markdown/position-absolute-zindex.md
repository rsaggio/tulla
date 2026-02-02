# Position Absolute, Relative e Z-Index

## `box-sizing: border-box`

Por padrão, quando definimos `width: 100%`, o navegador calcula a largura apenas do **conteúdo**. O padding é adicionado **por fora**, fazendo o elemento ultrapassar o tamanho esperado.

```css
/* PROBLEMA — 100% + padding = mais que a tela */
.menu {
  width: 100%;
  padding: 20px;
  /* Largura total = 100% + 20px esquerda + 20px direita = estoura! */
}

/* SOLUÇÃO — padding incluso nos 100% */
.menu {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  /* Largura total = 100% (incluindo o padding) */
}
```

Com `box-sizing: border-box`, o padding e a borda são **incluídos** na largura total. O conteúdo encolhe para acomodar, em vez de estourar.

---

## `position: absolute` — Posicionamento absoluto

O `position: absolute` posiciona o elemento em relação ao **primeiro ancestral com position não estático**. O elemento sai do fluxo, assim como o `fixed`, mas não fica fixo na tela — ele rola junto com a página.

```css
.discount {
  position: absolute;
  top: 16px;
  left: 16px;
}
```

### Diferença entre fixed e absolute

| | `position: fixed` | `position: absolute` |
|---|---|---|
| Referência | A tela (viewport) | O ancestral com position não estático |
| Ao rolar | Fica parado na tela | Rola junto com o conteúdo |
| Uso típico | Menus, botões flutuantes | Etiquetas, badges, sobreposições |

### O ancestral de referência

O `absolute` procura o primeiro ancestral com `position` diferente de `static`. Se não encontrar nenhum, usa o `<body>` como referência.

```
body (static) ← última referência se nenhum ancestral tiver position
  └── .product (relative) ← referência para o absolute!
        ├── img
        └── .discount (absolute, top: 16px, left: 16px)
```

---

## `position: relative` — Criando a referência

Para que o `absolute` use um elemento específico como referência, definimos `position: relative` nesse elemento:

```css
.product {
  position: relative;     /* vira referência para filhos absolute */
}

.discount {
  position: absolute;     /* posiciona em relação ao .product */
  top: 16px;
  left: 16px;
}
```

O `position: relative` **não muda** a posição do elemento — ele continua no fluxo normal. Sua função aqui é apenas servir de referência para os filhos com `position: absolute`.

### Se não definir o relative

Sem `position: relative` no pai, o `absolute` usa a tela como referência (igual ao `fixed`, mas rola junto):

```css
/* SEM relative no pai — posiciona em relação à tela */
.product {
  /* position: static (padrão) */
}
.discount {
  position: absolute;
  top: 200px;      /* 200px do topo da PÁGINA, não do produto */
  left: 200px;
}

/* COM relative no pai — posiciona em relação ao produto */
.product {
  position: relative;
}
.discount {
  position: absolute;
  top: 16px;       /* 16px do topo do PRODUTO */
  left: 16px;
}
```

---

## Criando uma etiqueta de desconto

### HTML

```html
<div class="product">
  <img src="img/camiseta1.jpg" alt="Camiseta">
  <span class="discount">20% OFF</span>
  <h2>Camiseta Azul</h2>
  <p>R$ 99</p>
  <a href="carrinho.html" class="botao">Comprar</a>
</div>
```

### CSS

```css
.product {
  width: 250px;
  min-width: 250px;
  position: relative;       /* referência para a etiqueta */
}

.discount {
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: darkgreen;
  color: white;
  font-weight: bold;
  font-size: 12px;
  padding: 4px 8px;         /* 4px cima/baixo, 8px esquerda/direita */
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Padding com dois valores

Quando passamos dois valores para o padding:

```css
padding: 4px 8px;
/* Primeiro valor: cima e baixo (4px) */
/* Segundo valor: esquerda e direita (8px) */
```

Atalhos de padding/margin:

```css
padding: 4px;              /* todos os lados */
padding: 4px 8px;          /* cima/baixo  esquerda/direita */
padding: 4px 8px 12px;     /* cima  esquerda/direita  baixo */
padding: 4px 8px 12px 16px; /* cima  direita  baixo  esquerda */
```

---

## `z-index` — Controlando a profundidade

Quando elementos com `position` se sobrepõem, usamos `z-index` para definir **quem fica por cima**:

```css
.menu {
  position: fixed;
  z-index: 10;       /* fica por cima de tudo */
}

.product {
  position: relative;
  /* z-index padrão = auto (0) */
}
```

O `z-index` funciona como **camadas de papel empilhadas**:

```
z-index: 10  →  Menu (por cima de tudo)
z-index: 1   →  Modal ou popup
z-index: 0   →  Conteúdo normal
z-index: -1  →  Elementos de fundo
```

- Valores **maiores** ficam por cima
- Valores **menores** ficam por baixo
- Só funciona em elementos com `position` diferente de `static`

### O problema sem z-index

Quando o `.product` tem `position: relative`, ele entra na mesma camada de sobreposição que o menu (`position: fixed`). Ao rolar, os produtos passam **por cima** do menu.

A solução é dar `z-index: 10` (ou qualquer valor maior) ao menu, garantindo que ele fique sempre na frente.

---

## Resumo dos tipos de position

| Valor | Comportamento | Referência de top/left |
|---|---|---|
| `static` | Padrão — fluxo normal | top/left não funcionam |
| `relative` | Fluxo normal + serve de referência para filhos absolute | Em relação à posição original |
| `absolute` | Sai do fluxo, posiciona em relação ao ancestral relative | Ancestral com position não static |
| `fixed` | Sai do fluxo, fixo na tela | A viewport (tela) |

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
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" />

    <style>
      body {
        margin: 0;
        padding-top: 78px;
        font-family: "Open Sans", sans-serif;
      }

      /* Menu fixo com z-index alto */
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

      /* Vitrine */
      #products {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        padding: 50px;
        background-color: #f5f5f5;
      }

      /* Produto com position relative (referência para a etiqueta) */
      .product {
        width: 250px;
        min-width: 250px;
        position: relative;
      }

      .product img {
        width: 100%;
      }

      /* Etiqueta de desconto */
      .discount {
        position: absolute;
        top: 16px;
        left: 16px;
        background-color: darkgreen;
        color: white;
        font-weight: bold;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <div class="menu">
      <h2>Minha Loja</h2>
      <nav>
        <a href="home.html">Home</a>
        <a href="produtos.html">Produtos</a>
      </nav>
    </div>

    <div id="products">
      <div class="product">
        <img src="img/camiseta1.jpg" alt="Camiseta azul">
        <span class="discount">20% OFF</span>
        <h2>Camiseta Azul</h2>
        <p><span class="riscado">R$ 119</span> R$ 99</p>
        <a href="carrinho.html" class="botao">Comprar</a>
      </div>
      <div class="product">
        <img src="img/camiseta2.jpg" alt="Camiseta vermelha">
        <h2>Camiseta Vermelha</h2>
        <p>R$ 89</p>
        <a href="carrinho.html" class="botao">Comprar</a>
      </div>
    </div>
  </body>
</html>
```

---

## Resumo visual

```
/* Box Sizing */
box-sizing: border-box ..... Padding e borda incluídos na largura
box-sizing: content-box .... Padrão — padding é adicionado por fora

/* Position Absolute + Relative */
.pai {
  position: relative;      /* referência para filhos absolute */
}
.filho {
  position: absolute;      /* posiciona em relação ao pai */
  top: 16px;
  left: 16px;
}

/* Z-Index (profundidade) */
z-index: 10 ................. Fica por cima
z-index: 1 .................. Camada intermediária
z-index: 0 .................. Camada padrão
z-index: -1 ................. Fica por baixo

/* Padding com dois valores */
padding: 4px 8px ........... 4px cima/baixo, 8px esquerda/direita

/* Resumo de position */
static ..................... Padrão (fluxo normal)
relative ................... Fluxo normal + referência para absolute
absolute ................... Posiciona em relação ao ancestral relative
fixed ...................... Fixo na tela (não rola)
```

---

## Exercício rápido

Pegue a página de loja e:

- Adicione `box-sizing: border-box` no menu para corrigir o estouro de largura
- Adicione `position: relative` em `.product`
- Crie um `<span class="discount">` em alguns produtos com textos como "20% OFF", "Novo", "Últimas unidades"
- Estilize `.discount` com `position: absolute`, `top`, `left`, cores e border-radius
- Adicione `z-index: 10` no menu para ele ficar por cima dos produtos ao rolar
