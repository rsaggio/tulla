# Div, ID e Flexbox

## Agrupando elementos com `<div>`

Quando a gente tem vários produtos na página — cada um com imagem, título e parágrafo — o código fica bagunçado. É difícil saber onde começa um produto e onde termina o outro.

A solução é **agrupar** os elementos que pertencem ao mesmo produto. Para isso, usamos a tag `<div>`:

```html
<div>
  <img src="img/camiseta1.jpg" alt="Camiseta azul">
  <h2>Camiseta Azul</h2>
  <p>R$ 99</p>
</div>

<div>
  <img src="img/camiseta2.jpg" alt="Camiseta vermelha">
  <h2>Camiseta Vermelha</h2>
  <p>R$ 89</p>
</div>
```

A `<div>` cria uma **divisão** — uma caixa que agrupa outros elementos. Sozinha ela não muda nada visualmente, mas organiza o código e permite aplicar estilos no grupo todo.

---

## Controlando a largura da `<div>`

Por padrão, a `<div>` ocupa a linha inteira (assim como `<h2>` e `<p>`). Para transformá-la em uma caixinha menor:

```css
div {
  width: 250px;
}
```

Mas se definimos `width: 250px` na div, os filhos (imagem, título, parágrafo) também precisam caber dentro. Um jeito prático é usar `width: 100%` nos filhos:

```css
img {
  width: 100%;
}

h2 {
  width: 100%;
  text-align: center;
}

p {
  width: 100%;
}
```

A vantagem: se você mudar a largura da div de 250px para 500px, **todos os filhos se adaptam automaticamente**.

---

## O problema de estilizar por tag

Quando usamos `div { width: 250px; }`, essa regra vale para **todas** as divs da página. Mas e se a gente quiser uma div pai que ocupa 100% da largura e divs filhas com 250px?

O CSS não sabe diferenciar uma div da outra só pela tag. Precisamos de um jeito de **identificar** cada uma.

---

## `id` — Identificando elementos

O atributo `id` dá um nome único a um elemento HTML:

```html
<div id="pai">
  <div>Produto 1</div>
  <div>Produto 2</div>
  <div>Produto 3</div>
</div>
```

No CSS, usamos `#` (hashtag) para selecionar um id:

```css
#pai {
  width: 100%;
  border: 1px solid blue;
}

div {
  width: 250px;
}
```

Agora a div com `id="pai"` tem 100% de largura, enquanto as outras divs continuam com 250px.

### Regras do id

- Cada id deve ser **único** na página (não pode ter dois elementos com o mesmo id)
- Qualquer tag pode ter um id: `<div id="...">`, `<h2 id="...">`, `<p id="...">`
- No CSS, sempre use `#` antes do nome do id

---

## `display: flex` — Colocando itens lado a lado

Por padrão, as divs ficam uma embaixo da outra (são elementos de bloco). Para colocá-las **lado a lado**, usamos Flexbox no elemento pai:

```css
#pai {
  display: flex;
}
```

Quando definimos `display: flex` no pai, estamos dizendo: "organize seus filhos de forma flexível". Por padrão, o flex coloca os filhos em **linha** (horizontal).

---

## `flex-direction` — Linha ou coluna

A propriedade `flex-direction` controla a direção dos filhos:

```css
#pai {
  display: flex;
  flex-direction: row;    /* lado a lado (padrão) */
}
```

Valores possíveis:

- `row` — em linha, da esquerda para a direita (padrão)
- `column` — em coluna, de cima para baixo

```css
/* No celular, um embaixo do outro */
#pai {
  display: flex;
  flex-direction: column;
}
```

---

## `justify-content` — Alinhamento horizontal

Com `display: flex` e `flex-direction: row`, podemos controlar como os filhos se distribuem horizontalmente:

```css
#pai {
  display: flex;
  justify-content: center;
}
```

Valores possíveis:

- `flex-start` — alinhado à esquerda (padrão)
- `flex-end` — alinhado à direita
- `center` — centralizado
- `space-between` — primeiro item na esquerda, último na direita, espaço igual entre eles
- `space-around` — espaço ao redor de cada item (metade nas extremidades)
- `space-evenly` — espaço igual entre todos, inclusive nas extremidades

```
flex-start:     |■ ■ ■          |
flex-end:       |          ■ ■ ■|
center:         |     ■ ■ ■     |
space-between:  |■      ■      ■|
space-around:   |  ■    ■    ■  |
space-evenly:   |   ■   ■   ■   |
```

---

## `gap` — Espaçamento entre filhos

Em vez de usar `margin` em cada filho para separá-los, podemos definir o espaçamento direto no pai com `gap`:

```css
#pai {
  display: flex;
  justify-content: center;
  gap: 20px;
}
```

Vantagens do `gap` sobre `margin`:

- Define o espaçamento **entre** os itens, sem somar margens
- Não afeta as extremidades (não cria espaço extra no primeiro e último item)
- Basta mudar em um lugar para ajustar tudo

Com margin de 10px em cada filho, o espaço entre dois vizinhos seria 20px (10 + 10). Com `gap: 20px`, o espaço é exatamente 20px.

---

## `padding` no pai e `box-sizing`

Para dar espaço interno no pai (entre a borda e os filhos), usamos padding:

```css
#pai {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 50px;
  width: 100%;
}
```

Mas atenção: por padrão, `width: 100%` **não inclui** padding e border. Isso faz o elemento ficar maior que 100% e aparecer uma barra de scroll horizontal.

Para resolver, usamos `box-sizing: border-box`:

```css
#pai {
  width: 100%;
  padding: 50px;
  box-sizing: border-box;
}
```

Com `border-box`, a largura total **inclui** padding e border. Assim 100% é realmente 100%.

---

## Tudo junto: vitrine de produtos

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

      #pai {
        display: flex;
        justify-content: center;
        gap: 20px;
        padding: 50px;
        width: 100%;
        box-sizing: border-box;
      }

      div div {
        width: 250px;
      }

      img {
        width: 100%;
      }

      h2 {
        width: 100%;
        text-align: center;
      }

      p {
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="pai">
      <div>
        <img src="img/camiseta1.jpg" alt="Camiseta azul">
        <h2>Camiseta Azul</h2>
        <p>R$ 99</p>
      </div>
      <div>
        <img src="img/camiseta2.jpg" alt="Camiseta vermelha">
        <h2>Camiseta Vermelha</h2>
        <p>R$ 89</p>
      </div>
      <div>
        <img src="img/camiseta3.jpg" alt="Camiseta preta">
        <h2>Camiseta Preta</h2>
        <p>R$ 79</p>
      </div>
    </div>
  </body>
</html>
```

Os produtos ficam lado a lado, centralizados, com 20px de espaço entre eles e 50px de padding interno no container.

---

## Resumo visual

```
<div> .................. Agrupa elementos (cria uma caixa)
id="nome" ............. Identifica um elemento de forma única
#nome { } ............. Seleciona um id no CSS

display: flex ......... Habilita o layout flexível no pai
flex-direction: row ... Filhos em linha (padrão)
flex-direction: column  Filhos em coluna

justify-content: center ......... Centraliza os filhos
justify-content: space-between .. Distribui com espaço entre
justify-content: space-evenly ... Espaço igual em tudo

gap: 20px ............. Espaçamento entre os filhos (no pai)
box-sizing: border-box  Inclui padding e border na largura
```

---

## Exercício rápido

Pegue a página de loja e:

- Agrupe cada produto dentro de uma `<div>`
- Crie uma div pai com `id="vitrine"` envolvendo todos os produtos
- Use `display: flex` e `justify-content: center` na div pai
- Adicione `gap: 20px` para espaçar os produtos
- Use `box-sizing: border-box` para evitar barra de scroll
