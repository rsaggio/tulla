# Parágrafos, Listas e Introdução ao CSS

## O currículo que ninguém lê

Imagine que você precisa montar um currículo. Você tem seu nome, data de nascimento, um "sobre mim", experiências profissionais... Mas se jogar tudo isso numa página sem organização, ninguém vai querer ler. É como entregar um currículo escrito num guardanapo.

Na aula passada, a gente aprendeu a estrutura básica do HTML e os títulos (`<h1>` a `<h6>`). Agora vamos aprender a organizar o **conteúdo** dessa página: parágrafos para textos corridos, listas para itens e os primeiros passos de estilização com CSS.

---

## `<p>` — O parágrafo

Nem todo texto é um título. Quando você quer escrever um texto corrido — uma descrição, uma data, um "sobre mim" — você usa a tag `<p>` (de **paragraph**).

```html
<h1>Renan Morais</h1>
<p>04 de março de 1990</p>

<h2>Sobre</h2>
<p>Procuro vaga de programador.</p>
```

Cada `<p>` cria um bloco separado de texto. Se você colocar dois parágrafos seguidos, o navegador automaticamente coloca um espaço entre eles. Não precisa ficar adicionando linhas em branco — o `<p>` já cuida disso.

---

## Listas — Organizando itens

Agora imagine que você precisa listar suas experiências profissionais. Você poderia usar vários parágrafos, um embaixo do outro. Funciona? Funciona. Mas HTML tem uma forma muito melhor: **listas**.

### Lista não ordenada: `<ul>`

Quando a ordem dos itens não importa, use `<ul>` (**unordered list**). Ela mostra os itens com bolinhas:

```html
<h2>Experiências Profissionais</h2>
<ul>
  <li>Pastelaria do João - 12/2020 até 02/2021</li>
  <li>Café da Dona Maria - 08/2019 até 12/2019</li>
  <li>Café da Lourdes - 03/2019 até 07/2019</li>
</ul>
```

Cada item dentro da lista usa a tag `<li>` (**list item**). A `<ul>` é o container e as `<li>` são os itens dentro dele.

### Lista ordenada: `<ol>`

Quando a ordem importa — como uma lista de passos, um ranking, ou uma receita — use `<ol>` (**ordered list**). Ela numera os itens automaticamente:

```html
<h2>Passos para fazer café</h2>
<ol>
  <li>Ferver a água</li>
  <li>Colocar o pó no filtro</li>
  <li>Despejar a água quente</li>
  <li>Esperar coar</li>
</ol>
```

O resultado será: 1. Ferver a água, 2. Colocar o pó no filtro... O navegador coloca os números sozinho.

### Qual usar?

- **`<ul>`** — quando a ordem não importa (ingredientes, habilidades, experiências)
- **`<ol>`** — quando a ordem importa (passos, ranking, instruções)

Os itens dentro são sempre `<li>`, tanto para `<ul>` quanto para `<ol>`.

---

## Introdução ao CSS — Dando vida à página

Até agora, tudo na nossa página é preto e branco com fontes padrão. Nada muito animador para um currículo. É como ter uma casa com a estrutura pronta, mas sem pintura, sem decoração — só concreto.

Para estilizar a página, a gente usa **CSS** (Cascading Style Sheets). O CSS é uma linguagem diferente do HTML. O HTML cuida do **conteúdo** (o quê aparece), e o CSS cuida da **aparência** (como aparece).

### Onde escrever CSS?

Por enquanto, vamos escrever o CSS dentro de uma tag `<style>` no `<head>` da página:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Currículo</title>
  <style>
    h1 {
      color: blue;
    }
  </style>
</head>
```

O estilo fica na **cabeça** da página, não no corpo. Faz sentido: o estilo é uma informação sobre como o corpo deve ser exibido.

### Como funciona o CSS?

A estrutura básica do CSS é:

```css
nome-da-tag {
  propriedade: valor;
}
```

Você escolhe **qual tag** quer estilizar, abre chaves `{ }` e dentro coloca as **propriedades** que quer mudar. Cada propriedade tem um valor, e termina com ponto e vírgula.

### Mudando a cor: `color`

```css
h1 {
  color: blue;
}

h2 {
  color: gray;
}
```

Isso faz todos os `<h1>` da página ficarem azuis e todos os `<h2>` ficarem cinza. Você pode usar nomes de cores em inglês (`blue`, `red`, `gray`) ou códigos de cor como `#1a5276`.

### Mudando o tamanho do texto: `font-size`

```css
h1 {
  font-size: 24px;
}

p {
  font-size: 14px;
}
```

O `px` significa **pixels**. Quanto maior o número, maior o texto. O tamanho padrão de um parágrafo é 16px.

### Estilizando várias tags de uma vez

Se você quer que o parágrafo e os itens da lista tenham o mesmo tamanho, separe os nomes com vírgula:

```css
p, li {
  font-size: 14px;
}
```

Isso aplica a mesma regra para `<p>` e `<li>` ao mesmo tempo.

---

## Tudo junto: o currículo estilizado

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Currículo</title>
    <style>
      h1 {
        color: #1a5276;
        font-size: 24px;
      }
      h2 {
        color: #2c3e50;
        font-size: 18px;
      }
      p, li {
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <h1>Renan Morais</h1>
    <p>04 de março de 1990</p>

    <h2>Sobre</h2>
    <p>Procuro vaga de programador.</p>

    <h2>Experiências Profissionais</h2>
    <ul>
      <li>Pastelaria do João - 12/2020 até 02/2021</li>
      <li>Café da Dona Maria - 08/2019 até 12/2019</li>
      <li>Café da Lourdes - 03/2019 até 07/2019</li>
    </ul>
  </body>
</html>
```

---

## Resumo visual

```
<p>              → Parágrafo de texto
<ul>             → Lista não ordenada (bolinhas)
<ol>             → Lista ordenada (números)
  <li>           → Item de uma lista (dentro de ul ou ol)

<style>          → Tag para CSS (dentro do head)
  tag { }        → Seletor CSS (qual tag estilizar)
  color          → Cor do texto
  font-size      → Tamanho do texto (em px)
```

---

## Exercício rápido

Crie um currículo HTML seu (pode ser fictício) com:

- Um `<h1>` com seu nome
- Parágrafos com suas informações pessoais
- Um `<h2>` para "Experiências" com uma lista `<ul>`
- Um `<h2>` para "Habilidades" com outra lista
- Uma tag `<style>` no `<head>` que mude as cores dos títulos e o tamanho dos textos

Salve como `curriculo.html`, abra no navegador e vá ajustando as cores e tamanhos até ficar do seu gosto.
