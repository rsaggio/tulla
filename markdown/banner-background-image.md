# Banner com Background Image e Seletores Descendentes

## Criando um banner

Um banner é uma seção de destaque na página, geralmente com uma imagem de fundo e um texto por cima. Vamos construir um passo a passo.

### Estrutura HTML

Crie uma `<div>` com a classe `banner` antes da vitrine de produtos:

```html
<div class="banner">
  <h1>Promoção de Verão 2026</h1>
</div>

<div id="vitrine">
  <!-- produtos aqui -->
</div>
```

### Centralizando o conteúdo do banner

Para centralizar o texto no banner, usamos Flexbox:

```css
.banner {
  height: 70vh;
  display: flex;
  justify-content: center;    /* centraliza horizontalmente */
  align-items: center;         /* centraliza verticalmente */
}
```

Com `display: flex`, `justify-content: center` e `align-items: center`, qualquer conteúdo dentro da div fica perfeitamente centralizado — tanto na horizontal quanto na vertical.

---

## Unidade `vh` — Viewport Height

Até agora usamos `px` (pixels), que é uma medida **absoluta** — 500px é sempre 500px, independente do tamanho da tela.

A unidade `vh` (viewport height) é uma medida **relativa** à altura da tela:

| Valor | Significado |
|---|---|
| `100vh` | 100% da altura da tela |
| `70vh` | 70% da altura da tela |
| `50vh` | Metade da tela |

```css
.banner {
  height: 70vh;    /* 70% da altura da tela */
}
```

A vantagem é que o banner se adapta a qualquer tamanho de tela — em um monitor grande fica maior, em um celular fica menor, mantendo sempre a mesma proporção.

### Medidas absolutas vs relativas

```
Absolutas (fixas):
  px .............. Pixels — sempre o mesmo tamanho

Relativas (se adaptam):
  vh .............. % da altura da tela (viewport height)
  vw .............. % da largura da tela (viewport width)
  % ............... % do elemento pai
```

---

## `background-image` — Imagem de fundo

Para colocar uma imagem **no fundo** de uma div (com o texto por cima), usamos `background-image` em vez de `<img>`:

```css
.banner {
  background-image: url("img/banners/banner-home.jpg");
}
```

A diferença entre `<img>` e `background-image`:

| | `<img>` | `background-image` |
|---|---|---|
| Onde fica | No HTML, como elemento | No CSS, como fundo |
| Texto por cima | Não (empurra outros elementos) | Sim (o texto fica por cima) |
| Uso ideal | Fotos de produto, conteúdo | Fundos decorativos, banners |

### Controlando a repetição

Por padrão, a imagem de fundo **se repete** para preencher toda a div. Para mudar:

```css
.banner {
  background-image: url("img/banners/banner-home.jpg");
  background-repeat: no-repeat;
}
```

Valores de `background-repeat`:

| Valor | Comportamento |
|---|---|
| `repeat` | Repete em todas as direções (padrão) |
| `no-repeat` | Não repete — mostra a imagem uma vez só |
| `repeat-x` | Repete só na horizontal |
| `repeat-y` | Repete só na vertical |

### Controlando o tamanho

A propriedade `background-size` define como a imagem preenche a div:

```css
.banner {
  background-size: cover;
}
```

Valores de `background-size`:

| Valor | Comportamento |
|---|---|
| `cover` | Cobre toda a div (pode cortar as bordas da imagem) |
| `contain` | Mostra a imagem inteira (pode sobrar espaço) |
| `100px 200px` | Largura e altura específicas |

Na maioria dos banners, usamos `cover` para que a imagem preencha todo o espaço.

### Controlando a posição

A propriedade `background-position` define qual parte da imagem fica visível:

```css
.banner {
  background-position: center;      /* centraliza a imagem */
  background-position: 200px 0;     /* move 200px para a direita */
  background-position: center top;  /* centraliza horizontal, alinha no topo */
}
```

---

## Seletores descendentes — Estilizando elementos dentro de outro

Se temos um `<h1>` dentro do banner e queremos estilizar **só esse h1** (sem afetar outros h1 da página), usamos um **seletor descendente**:

```css
/* PROBLEMA — afeta TODOS os h1 da página */
h1 {
  font-size: 64px;
}

/* SOLUÇÃO — afeta só o h1 dentro de .banner */
.banner h1 {
  font-size: 64px;
}
```

O espaço entre `.banner` e `h1` significa "o h1 que está **dentro** de .banner".

### Sendo mais específico

Podemos combinar tag + classe para ser ainda mais preciso:

```css
/* Qualquer elemento com classe banner */
.banner h1 {
  font-size: 64px;
}

/* Apenas uma DIV com classe banner */
div.banner h1 {
  font-size: 64px;
}
```

`div.banner` (sem espaço) significa "uma div que tem a classe banner". Se trocar a tag de `<div>` para `<section>`, o estilo para de funcionar — porque especificamos que precisa ser uma `div`.

### Outros exemplos de seletores descendentes

```css
/* Parágrafos dentro da vitrine */
#vitrine p {
  color: gray;
}

/* Links dentro de um produto */
.product a {
  text-decoration: none;
}

/* Spans dentro de parágrafos dentro de produto */
.product p span {
  color: red;
}
```

---

## Atalhos do editor (Emmet)

O VS Code tem atalhos para criar HTML mais rápido:

```
div.banner    + Tab  →  <div class="banner"></div>
div#vitrine   + Tab  →  <div id="vitrine"></div>
h1            + Tab  →  <h1></h1>
```

A notação usa `.` para classe e `#` para id — a mesma notação do CSS.

---

## Exemplo completo

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loja de Roupas</title>

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

      .banner {
        height: 70vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url("img/banners/banner-home.jpg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        color: white;
      }

      .banner h1 {
        font-size: 64px;
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

      .product img {
        width: 100%;
      }

      .product h2 {
        margin-top: 4px;
        margin-bottom: 0;
        text-align: center;
      }

      .product p {
        margin-top: 4px;
        margin-bottom: 4px;
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
    <div class="banner">
      <h1>Promoção de Verão 2026</h1>
    </div>

    <div id="vitrine">
      <div class="product">
        <img src="img/camiseta1.jpg" alt="Camiseta azul">
        <h2>Camiseta Azul</h2>
        <p>R$ 99</p>
        <a href="carrinho.html" class="botao">Comprar</a>
      </div>
      <!-- Mais produtos... -->
    </div>
  </body>
</html>
```

Note como os seletores descendentes (`.product img`, `.product h2`, `.banner h1`) garantem que os estilos não vazem para outros elementos da página.

---

## Resumo visual

```
/* Unidade relativa */
height: 70vh ................. 70% da altura da tela
100vh ........................ Tela inteira

/* Imagem de fundo */
background-image: url("caminho/imagem.jpg")
background-repeat: no-repeat .. Não repete
background-size: cover ........ Cobre toda a div
background-size: contain ...... Mostra a imagem inteira
background-position: center ... Centraliza a imagem

/* Seletores descendentes */
.banner h1 { } ............... h1 dentro de .banner
div.banner h1 { } ............ h1 dentro de <div class="banner">
#vitrine p { } ............... p dentro de #vitrine
.product img { } ............. img dentro de .product

/* Atalhos Emmet (VS Code) */
div.banner + Tab ............. <div class="banner"></div>
div#vitrine + Tab ............ <div id="vitrine"></div>
```

---

## Exercício rápido

Pegue a página de loja e:

- Crie uma `<div class="banner">` antes da vitrine com um `<h1>` de título
- Defina a altura com `vh` em vez de pixels
- Centralize o conteúdo com `display: flex`, `justify-content: center` e `align-items: center`
- Adicione uma imagem de fundo com `background-image: url()`
- Use `background-size: cover` e `background-repeat: no-repeat`
- Estilize o h1 do banner usando o seletor descendente `.banner h1`
- Use seletores descendentes para os estilos de `.product img`, `.product h2`, etc.
