# Fontes e Estilos de Texto com CSS

## O currículo genérico

Você já tem um currículo com títulos coloridos e textos com tamanhos ajustados. Mas ele ainda parece... genérico. A fonte é aquela padrão do navegador que todo mundo usa. É como ir numa entrevista de emprego com uma camiseta branca lisa — não está errado, mas não diz nada sobre você.

A fonte que você escolhe muda completamente a personalidade de uma página. Nesta aula, vamos aprender a controlar a aparência do texto de verdade: itálico, negrito, sublinhado, família de fontes e como usar fontes do Google.

---

## Propriedades de texto que já conhecemos

Na aula passada, a gente aprendeu duas propriedades CSS:

```css
h1 {
  color: #1a5276;
  font-size: 24px;
}
```

- `color` — muda a cor do texto
- `font-size` — muda o tamanho do texto (em pixels)

Agora vamos conhecer mais propriedades.

---

## `font-style` — Itálico

Para deixar um texto em itálico, use `font-style`:

```css
p {
  font-style: italic;
}
```

Os valores possíveis são:
- `italic` — texto inclinado
- `normal` — texto normal (padrão)

---

## `font-weight` — Negrito

Para deixar um texto em negrito, use `font-weight`:

```css
p {
  font-weight: bold;
}
```

Os valores mais usados são:
- `bold` — negrito
- `normal` — peso normal (padrão)

---

## `text-decoration` — Sublinhado e outros

Para adicionar uma linha embaixo do texto, use `text-decoration`:

```css
h1 {
  text-decoration: underline;
}
```

Os valores mais usados são:
- `underline` — linha embaixo
- `line-through` — texto riscado
- `none` — sem decoração (útil para remover sublinhado de links)

---

## Mesmo seletor mais de uma vez

Você pode ter o mesmo seletor mais de uma vez no CSS. Se houver conflito entre propriedades, **o que vem depois prevalece**:

```css
p, li {
  font-size: 14px;
}

p {
  font-style: italic;
  font-size: 16px;
}
```

Nesse exemplo, o `<p>` vai ficar com `font-size: 16px` (o valor de baixo sobrescreve o de cima) e com `font-style: italic`. Já o `<li>` continua com `font-size: 14px` e sem itálico.

Cuidado para não sobrescrever valores sem querer. Se um seletor mais abaixo repete uma propriedade, ele vence.

---

## `font-family` — Trocando a fonte

A propriedade mais impactante é `font-family`. Ela muda a família da fonte:

```css
h1 {
  font-family: Arial;
}
```

Você pode listar várias fontes separadas por vírgula. O navegador tenta a primeira — se não encontrar, tenta a segunda, e assim por diante:

```css
h1 {
  font-family: Arial, Helvetica, sans-serif;
}
```

Fontes como Arial, Times New Roman e Courier New são fontes do sistema que a maioria dos computadores tem. Mas elas são genéricas. Para usar fontes mais bonitas, a gente importa do Google.

---

## Google Fonts — Fontes gratuitas

O Google oferece centenas de fontes gratuitas em [fonts.google.com](https://fonts.google.com). Para usar uma delas:

**1. Escolha a fonte no site do Google Fonts**

Por exemplo, a fonte **Roboto** (usada no Gmail e Android).

**2. Copie o link de importação e cole no `<head>`**

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meu Currículo</title>
  <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
  <style>
    h1 {
      font-family: "Roboto", sans-serif;
    }
  </style>
</head>
```

**3. Use o nome da fonte no `font-family`**

Pronto. O navegador baixa a fonte do Google e aplica na sua página. Isso funciona em qualquer computador, mesmo que a pessoa não tenha a fonte instalada.

Você pode importar quantas fontes quiser — basta adicionar mais tags `<link>` e usar cada `font-family` nos seletores que desejar.

---

## Tudo junto: currículo com fontes personalizadas

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Currículo</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <style>
      h1 {
        color: #1a5276;
        font-size: 24px;
        font-family: "Roboto", sans-serif;
        text-decoration: underline;
      }
      h2 {
        color: #2c3e50;
        font-size: 18px;
        font-family: "Roboto", sans-serif;
      }
      p, li {
        font-size: 14px;
        font-family: "Roboto", sans-serif;
      }
      p {
        font-style: italic;
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
    </ul>
  </body>
</html>
```

---

## Resumo visual

```
font-style       → italic ou normal
font-weight      → bold ou normal
text-decoration  → underline, line-through ou none
font-family      → Nome da fonte (Arial, "Roboto", etc.)

Google Fonts:
  1. Escolha a fonte em fonts.google.com
  2. Copie o <link> para o <head>
  3. Use font-family: "Nome da Fonte" no CSS

Cascata CSS:
  Se a mesma propriedade aparecer duas vezes,
  o valor que vem por último prevalece.
```

---

## Exercício rápido

Pegue o currículo que você criou na aula passada e:

- Importe uma fonte do Google Fonts
- Aplique essa fonte em todos os textos da página
- Deixe o nome (h1) em negrito e sublinhado
- Deixe os parágrafos em itálico
- Experimente trocar a fonte e veja como muda a aparência
