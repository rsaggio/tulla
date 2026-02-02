# Bordas e Arredondamento com CSS

## A moldura do quadro

Você já tem imagens na sua página, mas elas ficam soltas, sem nenhum contorno. É como pendurar um quadro sem moldura — funciona, mas falta acabamento.

Com CSS, a gente pode adicionar **bordas** em qualquer elemento, arredondar cantos e até transformar uma imagem retangular em um círculo. Nesta aula, vamos aprender a trabalhar com `border`, `border-radius` e `object-fit`.

---

## `border` — Adicionando bordas

Para criar uma borda, você precisa definir **três coisas**:

1. **Largura** (`border-width`) — quantos pixels de espessura
2. **Cor** (`border-color`) — qual cor
3. **Estilo** (`border-style`) — sólida, pontilhada, tracejada...

Se faltar qualquer uma das três, a borda não aparece:

```css
img {
  border-width: 5px;
  border-color: black;
  border-style: solid;
}
```

### Forma abreviada

Em vez de escrever três linhas, você pode usar a propriedade `border` com tudo junto, na ordem: **largura cor estilo**:

```css
img {
  border: 5px black solid;
}
```

O resultado é o mesmo, mas com uma linha só.

---

## Estilos de borda

O `border-style` aceita vários valores:

```css
/* Linha contínua */
border: 3px black solid;

/* Tracejada (risquinhos) */
border: 3px black dashed;

/* Pontilhada (pontinhos) */
border: 3px black dotted;

/* Linha dupla */
border: 3px black double;
```

O mais usado no dia a dia é `solid`. Os outros são úteis para efeitos específicos.

---

## `border-radius` — Arredondando cantos

A propriedade `border-radius` arredonda os cantos de um elemento. O valor define o tamanho do arredondamento:

```css
img {
  border: 3px black solid;
  border-radius: 20px;
}
```

Quanto maior o valor, mais arredondado fica o canto:

- `border-radius: 0px` — cantos retos (padrão)
- `border-radius: 10px` — leve arredondamento
- `border-radius: 20px` — arredondamento médio
- `border-radius: 50px` — bastante arredondado

### Transformando em círculo

Para transformar uma imagem em círculo, defina `width` e `height` iguais e `border-radius` com o mesmo valor:

```css
img {
  width: 250px;
  height: 250px;
  border-radius: 250px;
}
```

O `border-radius` funciona mesmo sem `border`. Você pode arredondar cantos de imagens que não têm borda visível.

---

## `object-fit` — Evitando distorção

Quando você define `width` e `height` numa imagem e eles não respeitam a proporção original, a imagem distorce. O `object-fit` resolve isso:

```css
img {
  width: 250px;
  height: 250px;
  border-radius: 250px;
  object-fit: cover;
}
```

Os valores mais usados:

- **`cover`** — a imagem dá zoom para preencher todo o espaço, cortando o excesso. Não distorce.
- **`contain`** — a imagem encolhe para caber inteira, podendo deixar espaços em branco. Não distorce.

Na maioria dos casos, `cover` é o que você quer: a imagem preenche o espaço sem distorcer.

---

## Tudo junto: imagem com borda e círculo

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galeria com Bordas</title>
    <style>
      h1 {
        color: #1a5276;
        font-size: 24px;
      }
      img {
        width: 300px;
        border: 3px #2c3e50 solid;
        border-radius: 10px;
      }
      .foto-perfil {
        width: 200px;
        height: 200px;
        border-radius: 200px;
        border: 4px #1a5276 solid;
        object-fit: cover;
      }
    </style>
  </head>
  <body>
    <h1>Minha Galeria</h1>

    <h2>Foto de Perfil</h2>
    <img class="foto-perfil" src="img/perfil.jpg" alt="Minha foto de perfil">

    <h2>Produto</h2>
    <img src="img/camisetas/camiseta1.jpg" alt="Camiseta polo azul">
    <p>Camiseta polo azul com detalhes brancos.</p>
  </body>
</html>
```

Nesse exemplo, usamos algo novo: `class="foto-perfil"`. Classes são uma forma de aplicar estilos em elementos específicos — vamos aprender mais sobre isso nas próximas aulas. Por enquanto, saiba que o ponto (`.foto-perfil`) no CSS seleciona apenas os elementos que têm aquela classe.

---

## Resumo visual

```
border               → Atalho: largura cor estilo (ex: 3px black solid)
  border-width       → Espessura da borda (em px)
  border-color       → Cor da borda
  border-style       → solid, dashed, dotted, double

border-radius        → Arredondamento dos cantos (em px)
                       Para círculo: valor = metade da largura

object-fit           → Como a imagem preenche o espaço
  cover              → Preenche tudo, corta o excesso
  contain            → Cabe inteira, pode ter espaço em branco
```

---

## Exercício rápido

Pegue a página de loja que você criou na aula passada e:

- Adicione uma borda sólida nas imagens dos produtos
- Arredonde os cantos com `border-radius`
- Crie uma imagem de "perfil da loja" em formato circular usando `width`, `height`, `border-radius` e `object-fit: cover`
- Experimente diferentes estilos de borda (`dashed`, `dotted`)
