# Filtros CSS e Efeitos com Hover

## A foto sem edição

Sabe quando você tira uma foto e antes de postar aplica um filtro — preto e branco, aumenta o contraste, dá aquele tom vintage? No CSS, a gente pode fazer a mesma coisa direto no código, sem precisar de Photoshop.

E melhor ainda: a gente pode fazer esses filtros aparecerem **só quando o mouse passa por cima** do elemento. Nesta aula, vamos aprender a usar filtros CSS e o seletor `:hover` para criar efeitos interativos.

---

## `filter` — Filtros de imagem

A propriedade `filter` aplica efeitos visuais em um elemento. Funciona com imagens, mas também com qualquer outro elemento.

### `blur` — Desfoque

Desfoca a imagem. O valor em pixels define a intensidade:

```css
img {
  filter: blur(5px);
}
```

- `blur(0px)` — sem desfoque (padrão)
- `blur(5px)` — desfoque leve
- `blur(50px)` — desfoque intenso, imagem quase some

### `grayscale` — Preto e branco

Transforma a imagem em tons de cinza. O valor é uma porcentagem:

```css
img {
  filter: grayscale(100%);
}
```

- `grayscale(0%)` — cores normais
- `grayscale(50%)` — meio colorida, meio cinza
- `grayscale(100%)` — totalmente preto e branco

### `brightness` — Brilho

Controla o brilho da imagem:

```css
img {
  filter: brightness(150%);
}
```

- `brightness(50%)` — mais escura
- `brightness(100%)` — brilho normal
- `brightness(150%)` — mais clara

### `contrast` — Contraste

Controla o contraste entre áreas claras e escuras:

```css
img {
  filter: contrast(200%);
}
```

- `contrast(50%)` — menos contraste (mais "lavada")
- `contrast(100%)` — contraste normal
- `contrast(200%)` — muito contrastada

### `saturate` — Saturação

Controla a intensidade das cores:

```css
img {
  filter: saturate(150%);
}
```

- `saturate(0%)` — sem cor (igual a grayscale)
- `saturate(100%)` — saturação normal
- `saturate(150%)` — cores mais vibrantes

### `sepia` — Tom vintage

Aplica um tom amarelado que lembra fotos antigas:

```css
img {
  filter: sepia(100%);
}
```

### `invert` — Inversão de cores

Inverte todas as cores da imagem:

```css
img {
  filter: invert(100%);
}
```

---

## `:hover` — Quando o mouse está em cima

O `:hover` é um **pseudo-seletor** que aplica estilos somente quando o mouse está sobre o elemento. Você escreve o nome da tag, dois pontos e `hover`:

```css
img {
  filter: grayscale(100%);
}

img:hover {
  filter: none;
}
```

Nesse exemplo, a imagem começa em preto e branco. Quando o mouse passa por cima, o filtro é removido (`none`) e a imagem fica colorida. Quando o mouse sai, volta ao preto e branco.

### Hover funciona com qualquer propriedade

O `:hover` não é exclusivo de filtros. Você pode mudar qualquer propriedade CSS:

```css
h2 {
  color: black;
}

h2:hover {
  color: green;
}
```

Quando o mouse está sobre o `<h2>`, o texto fica verde. Quando sai, volta ao preto.

```css
img {
  opacity: 0.7;
}

img:hover {
  opacity: 1;
}
```

A imagem começa com 70% de opacidade e fica 100% visível quando o mouse passa por cima.

---

## Removendo filtros com `none`

Para remover todos os filtros de um elemento (geralmente no `:hover`), use:

```css
img:hover {
  filter: none;
}
```

O valor `none` significa "nenhum filtro".

---

## Tudo junto: galeria com efeitos

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loja de Roupas</title>
    <style>
      h1 {
        color: #1a5276;
        font-size: 24px;
      }
      h2 {
        font-weight: normal;
        font-size: 16px;
      }
      h2:hover {
        color: green;
      }
      img {
        width: 300px;
        border-radius: 15px;
        filter: grayscale(100%);
      }
      img:hover {
        filter: none;
      }
    </style>
  </head>
  <body>
    <h1>Loja de Roupas</h1>

    <h2>Camiseta Azul e Branca</h2>
    <img src="img/camisetas/camiseta1.jpg" alt="Camiseta polo azul com detalhes brancos">

    <h2>Camiseta Vermelha</h2>
    <img src="img/camisetas/camiseta2.jpg" alt="Camiseta polo vermelha">
  </body>
</html>
```

As imagens começam em preto e branco. Quando o mouse passa por cima, ficam coloridas. Os títulos ficam verdes no hover.

---

## Resumo visual

```
filter: blur(5px)          → Desfoque
filter: grayscale(100%)    → Preto e branco
filter: brightness(150%)   → Brilho (mais clara)
filter: contrast(200%)     → Contraste
filter: saturate(150%)     → Saturação (cores vibrantes)
filter: sepia(100%)        → Tom vintage amarelado
filter: invert(100%)       → Inversão de cores
filter: none               → Remove todos os filtros

:hover                     → Aplica estilos quando o mouse está em cima
  img:hover { }            → Estilo da imagem com mouse em cima
  h2:hover { }             → Estilo do h2 com mouse em cima
```

---

## Exercício rápido

Pegue a página de loja e:

- Aplique `grayscale(100%)` em todas as imagens
- No `:hover`, remova o filtro com `filter: none`
- Adicione um efeito de mudança de cor no título do produto usando `:hover`
- Experimente outros filtros como `blur`, `sepia` e `brightness`
