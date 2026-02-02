# Box Model: Margin, Padding e Alinhamento

## Tudo é uma caixa

Sabe aquela imagem que a gente colocou borda? Pois é — se você colocar borda em qualquer elemento da página (um título, um parágrafo, uma lista), vai ver que **tudo vira uma caixa**. Pode testar: coloque `border` no `<h2>` e vai aparecer uma caixa que vai até o final da tela.

Essa é a base do CSS: **todo elemento HTML é uma caixa retangular**. E para montar um layout bonito, a gente precisa aprender a controlar o espaço dentro e fora dessas caixas. Isso se chama **Box Model**.

---

## O Box Model

Cada caixa no CSS tem 4 camadas, de dentro para fora:

```
┌─────────────────────────── margin (distância até outros elementos) ─┐
│  ┌──────────────────────── border (borda) ─────────────────────┐    │
│  │  ┌───────────────────── padding (distância da borda ao conteúdo) │
│  │  │                                                          │    │
│  │  │              conteúdo (texto, imagem...)                  │    │
│  │  │                                                          │    │
│  │  └──────────────────────────────────────────────────────────┘    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

- **Conteúdo** — o texto ou imagem dentro do elemento
- **Padding** — espaço entre o conteúdo e a borda
- **Border** — a borda (que a gente já aprendeu)
- **Margin** — espaço entre a borda e os outros elementos

---

## `margin` — Distância até outros elementos

A margem empurra outros elementos para longe. Ela fica **do lado de fora** da borda:

```css
h2 {
  margin-top: 8px;
  margin-bottom: 8px;
}
```

Você pode controlar cada lado separadamente:

- `margin-top` — margem de cima
- `margin-bottom` — margem de baixo
- `margin-left` — margem da esquerda
- `margin-right` — margem da direita

### Atalho: `margin`

Você pode usar a propriedade `margin` como atalho:

```css
/* Todos os lados iguais */
h2 {
  margin: 8px;
}

/* Cima/baixo e esquerda/direita */
h2 {
  margin: 8px 16px;
}

/* Cima, direita, baixo, esquerda (sentido horário) */
h2 {
  margin: 8px 16px 8px 16px;
}
```

### Removendo a margem padrão do body

O `<body>` e o `<html>` vêm com uma margem padrão do navegador. Isso faz o conteúdo ficar afastado das bordas da tela. Para remover:

```css
body {
  margin: 0;
}
```

---

## `padding` — Distância da borda ao conteúdo

O padding fica **do lado de dentro** da borda. Ele cria espaço entre a borda e o conteúdo:

```css
h2 {
  border: 1px solid black;
  padding-top: 16px;
  padding-bottom: 16px;
}
```

Sem padding, o texto fica "espremido" contra a borda. Com padding, a caixa fica mais confortável.

Assim como a margem, você pode controlar cada lado:

- `padding-top` — espaço interno de cima
- `padding-bottom` — espaço interno de baixo
- `padding-left` — espaço interno da esquerda
- `padding-right` — espaço interno da direita

### Atalho: `padding`

```css
/* Todos os lados iguais */
h2 {
  padding: 16px;
}

/* Cima/baixo e esquerda/direita */
h2 {
  padding: 16px 24px;
}
```

---

## Margin vs Padding — Qual usar?

A regra é simples:

- **Margin** = distância **entre** elementos (lado de fora da borda)
- **Padding** = distância **dentro** do elemento (entre a borda e o conteúdo)

```css
h2 {
  border: 1px solid black;
  margin: 8px 0;      /* 8px acima e abaixo, 0 nas laterais */
  padding: 16px;       /* 16px de espaço interno em todos os lados */
}
```

---

## `text-align` — Alinhamento do texto

A propriedade `text-align` controla o alinhamento horizontal do texto dentro da caixa. É como as opções de alinhamento do Word:

```css
h2 {
  text-align: center;
}
```

Valores possíveis:

- `left` — alinhado à esquerda (padrão)
- `right` — alinhado à direita
- `center` — centralizado
- `justify` — justificado (estica o texto para preencher a linha)

```css
p {
  text-align: right;
  width: 250px;
}
```

---

## `<span>` — Marcando pedaços do texto

Às vezes a gente quer aplicar um estilo em **parte** do texto, não no parágrafo inteiro. Para isso, usamos a tag `<span>`:

```html
<p>
  <span>R$ 149</span> R$ 99
</p>
```

O `<span>` não muda nada visualmente sozinho. Ele serve apenas para **marcar** um trecho do texto para que o CSS possa estilizar:

```css
span {
  text-decoration: line-through;
}
```

Agora o "R$ 149" aparece riscado e o "R$ 99" fica normal — perfeito para mostrar um preço antigo e um preço novo.

### Span vs outras tags

- `<p>`, `<h1>`, `<div>` — são **blocos** (ocupam a linha inteira)
- `<span>` — é **inline** (ocupa só o espaço do texto)

O `<span>` fica dentro de outras tags, ele não quebra linha.

---

## Vendo todas as caixas

Um truque útil para visualizar o box model de todos os elementos:

```css
* {
  border: 1px solid red;
}
```

O `*` seleciona **todos os elementos** da página. Isso coloca uma borda vermelha em tudo, facilitando ver as caixas. Quando terminar de ajustar, é só remover.

---

## Tudo junto: cartão de produto

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loja de Roupas</title>
    <style>
      body {
        margin: 0;
      }
      h2 {
        width: 250px;
        text-align: center;
        margin: 8px 0;
        padding: 16px 0;
      }
      img {
        width: 250px;
      }
      p {
        width: 250px;
        text-align: right;
      }
      span {
        text-decoration: line-through;
      }
    </style>
  </head>
  <body>
    <h2>Camiseta Azul</h2>
    <img src="img/camisetas/camiseta1.jpg" alt="Camiseta polo azul com detalhes brancos">
    <p><span>R$ 149</span> R$ 99</p>
  </body>
</html>
```

O título está centralizado com espaçamento interno. A imagem tem a mesma largura. O preço antigo aparece riscado e o preço novo normal, alinhados à direita. A margem do body foi removida.

---

## Resumo visual

```
Box Model (de dentro para fora):
  conteúdo     → o texto ou imagem
  padding      → espaço interno (borda → conteúdo)
  border       → a borda
  margin       → espaço externo (borda → outros elementos)

margin: 8px;             → Margem igual em todos os lados
margin-top: 8px;         → Margem só em cima
margin-bottom: 8px;      → Margem só embaixo
padding: 16px;           → Espaço interno igual em todos os lados
padding-top: 16px;       → Espaço interno só em cima

text-align: center;      → Centraliza o texto
text-align: right;       → Alinha à direita
text-align: left;        → Alinha à esquerda (padrão)

<span>texto</span>       → Marca um trecho do texto para estilizar
*  { }                   → Seleciona todos os elementos
body { margin: 0; }      → Remove margem padrão do navegador
```

---

## Exercício rápido

Pegue a página de loja e:

- Remova a margem padrão do `body`
- Adicione `margin` e `padding` no título do produto
- Alinhe o preço à direita com `text-align`
- Use `<span>` com `text-decoration: line-through` para mostrar o preço antigo riscado
