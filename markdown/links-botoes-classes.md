# Links, Botões e Classes CSS

## Criando links com `<a>`

Um link conecta uma página a outra. No HTML, usamos a tag `<a>` (âncora):

```html
<a href="https://google.com">Ir para o Google</a>
```

O atributo `href` (hypertext reference) define para onde o link vai. Todo endereço na internet usa o protocolo HTTP/HTTPS:

```
https://google.com
https://youtube.com
```

### Links entre páginas do mesmo site

Se você tem duas páginas no mesmo projeto, o link é só o nome do arquivo:

```html
<!-- Na home.html -->
<a href="carrinho.html">Ir para o carrinho</a>

<!-- Na carrinho.html -->
<a href="home.html">Voltar para home</a>
```

Não precisa de `https://` — basta o nome do arquivo porque estão na mesma pasta.

---

## Criando um botão com link

Um botão de "Adicionar ao carrinho" é basicamente um link estilizado:

```html
<a href="carrinho.html">Adicionar ao carrinho</a>
```

Mas por padrão, um link é só um texto azul sublinhado. Precisamos estilizá-lo para parecer um botão.

---

## Classes CSS — Reutilizando estilos

Já vimos que o `id` identifica um elemento **único**. Mas e se quisermos aplicar o mesmo estilo em vários elementos? Para isso, usamos **classes**.

```html
<a href="carrinho.html" class="botao">Adicionar ao carrinho</a>
```

No CSS, selecionamos uma classe com `.` (ponto):

```css
.botao {
  /* estilos aqui */
}
```

### Diferença entre id e class

| | `id` | `class` |
|---|---|---|
| Seletor CSS | `#nome` | `.nome` |
| Quantidade | Único na página | Pode repetir em vários elementos |
| Uso | Identificar um elemento específico | Aplicar o mesmo estilo em vários elementos |

```html
<!-- id: único -->
<div id="vitrine">...</div>

<!-- class: pode repetir -->
<a class="botao" href="carrinho.html">Comprar</a>
<a class="botao" href="carrinho.html">Comprar</a>
<a class="botao" href="carrinho.html">Comprar</a>
```

---

## `display: block` — Transformando inline em bloco

A tag `<a>` é **inline** por padrão — ela ocupa só o espaço do texto, não aceita largura nem centralização.

Para que o link se comporte como uma caixa (como `<div>`, `<h2>`, `<p>`), mudamos o display:

```css
.botao {
  display: block;
}
```

Três valores importantes de display:

- `inline` — ocupa só o espaço do conteúdo (padrão do `<a>`, `<span>`)
- `block` — ocupa a linha inteira, aceita width/height (padrão do `<div>`, `<p>`, `<h2>`)
- `flex` — habilita layout flexível nos filhos (vimos na aula anterior)

Quando o link vira bloco, podemos centralizar o texto com `text-align: center`.

---

## `background-color` — Cor de fundo

Para dar cor de fundo a qualquer elemento:

```css
.botao {
  background-color: green;
}
```

Você pode usar nomes de cores (`green`, `black`, `white`) ou valores mais específicos:

```css
.botao {
  background-color: green;       /* verde padrão */
  border: 2px solid lightgreen;  /* borda verde clara */
}
```

---

## Estilizando o botão completo

Juntando tudo que aprendemos para criar um botão bonito:

```css
.botao {
  display: block;
  text-align: center;
  text-decoration: none;     /* remove o sublinhado */
  background-color: green;
  color: white;              /* texto branco */
  font-weight: bold;         /* texto em negrito */
  padding-top: 18px;
  padding-bottom: 18px;
  border: 2px solid lightgreen;
  border-radius: 8px;        /* bordas arredondadas */
}
```

Passo a passo do que cada propriedade faz:

1. `display: block` — transforma o link em bloco
2. `text-align: center` — centraliza o texto
3. `text-decoration: none` — remove o sublinhado padrão do link
4. `background-color` — cor de fundo do botão
5. `color` — cor do texto
6. `font-weight: bold` — texto em negrito
7. `padding-top` e `padding-bottom` — espaço interno (deixa o botão mais "gordo")
8. `border` — borda com cor diferente do fundo
9. `border-radius` — arredonda os cantos

---

## `:hover` — Efeito ao passar o mouse

Para dar feedback visual quando o usuário passa o mouse, usamos o `:hover`:

```css
.botao:hover {
  background-color: darkgreen;
}
```

Isso muda a cor de fundo quando o mouse está em cima do botão, dando a sensação de que ele "acendeu" (ou escureceu). Como o link já tem o cursor de mãozinha por padrão, o usuário entende que é clicável.

---

## Tudo junto: cartão com botão

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

      #vitrine {
        display: flex;
        justify-content: center;
        gap: 20px;
        padding: 50px;
        width: 100%;
        box-sizing: border-box;
      }

      .produto {
        width: 250px;
      }

      img {
        width: 100%;
      }

      h2 {
        text-align: center;
      }

      .botao {
        display: block;
        text-align: center;
        text-decoration: none;
        background-color: green;
        color: white;
        font-weight: bold;
        padding-top: 18px;
        padding-bottom: 18px;
        border: 2px solid lightgreen;
        border-radius: 8px;
      }

      .botao:hover {
        background-color: darkgreen;
      }
    </style>
  </head>
  <body>
    <div id="vitrine">
      <div class="produto">
        <img src="img/camiseta1.jpg" alt="Camiseta azul">
        <h2>Camiseta Azul</h2>
        <p>R$ 99</p>
        <a href="carrinho.html" class="botao">Adicionar ao carrinho</a>
      </div>
      <div class="produto">
        <img src="img/camiseta2.jpg" alt="Camiseta vermelha">
        <h2>Camiseta Vermelha</h2>
        <p>R$ 89</p>
        <a href="carrinho.html" class="botao">Adicionar ao carrinho</a>
      </div>
    </div>
  </body>
</html>
```

Cada produto tem seu botão estilizado com a classe `.botao`, que pode ser reutilizada em qualquer link da página.

---

## Resumo visual

```
<a href="url">texto</a> ........ Cria um link
href="pagina.html" ............. Link para outra página local
href="https://site.com" ....... Link para site externo

class="nome" .................. Atributo para aplicar estilos reutilizáveis
.nome { } ..................... Seleciona uma classe no CSS
#nome { } ..................... Seleciona um id no CSS (único)

display: inline ............... Ocupa só o espaço do texto (padrão do <a>)
display: block ................ Ocupa a linha inteira (padrão do <div>)
display: flex ................. Layout flexível nos filhos

background-color: green ....... Cor de fundo
text-decoration: none ......... Remove sublinhado do link
font-weight: bold ............. Texto em negrito
color: white .................. Cor do texto

.botao:hover { } .............. Estilos quando o mouse está em cima
```

---

## Exercício rápido

Pegue a página de loja e:

- Adicione um link `<a>` com o texto "Comprar" dentro de cada produto
- Crie uma classe `.botao` para estilizar o link como botão
- Use `display: block`, `background-color`, `color`, `padding` e `border-radius`
- Adicione um efeito `:hover` que muda a cor de fundo
- Remova o sublinhado com `text-decoration: none`
