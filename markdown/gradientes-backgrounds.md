# Gradientes e Múltiplos Backgrounds

## Comentários no CSS

Comentários servem para anotar o código ou desabilitar temporariamente uma linha:

```css
/* Isso é um comentário — o navegador ignora */

/* Aqui edito o estilo do banner principal */
.banner {
  height: 70vh;
  /* background-image: url("img/banner.jpg"); */  /* desabilitado por enquanto */
}
```

A sintaxe é `/* texto */`. Use para:
- Anotações e organização do código
- Desabilitar temporariamente uma propriedade para testar

---

## `linear-gradient` — Degradê linear

Um gradiente (degradê) é uma transição suave entre duas ou mais cores. No CSS, usamos `linear-gradient`:

```css
.banner {
  background: linear-gradient(45deg, red, black);
}
```

O gradiente recebe:
1. **Ângulo** — a direção do degradê
2. **Cor inicial** — onde começa
3. **Cor final** — onde termina

### Ângulos do gradiente

```css
background: linear-gradient(0deg, red, black);    /* de baixo para cima */
background: linear-gradient(45deg, red, black);   /* diagonal ↗ */
background: linear-gradient(90deg, red, black);   /* da esquerda para direita */
background: linear-gradient(180deg, red, black);  /* de cima para baixo */
```

| Ângulo | Direção |
|---|---|
| `0deg` | De baixo para cima ↑ |
| `45deg` | Diagonal ↗ |
| `90deg` | Da esquerda para a direita → |
| `180deg` | De cima para baixo ↓ |
| `270deg` | Da direita para a esquerda ← |

### Exemplos de gradientes

```css
/* Verde para preto */
background: linear-gradient(45deg, green, black);

/* Azul para roxo */
background: linear-gradient(90deg, blue, purple);

/* Branco para cinza */
background: linear-gradient(180deg, white, gray);
```

---

## Múltiplos backgrounds — Combinando gradiente e imagem

É possível ter **mais de um fundo** no mesmo elemento, separando-os por vírgula:

```css
.banner {
  background:
    linear-gradient(45deg, rgba(0,0,0,0.7), rgba(255,255,255,0.1)),
    url("img/banners/banner-home.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}
```

O primeiro fundo (gradiente) fica **por cima**, o segundo (imagem) fica **por trás**.

### Por que usar transparência?

Se o gradiente usar cores sólidas, ele cobre completamente a imagem. Para que a imagem apareça por trás, o gradiente precisa ter **cores transparentes**.

```css
/* ERRADO — gradiente sólido cobre a imagem */
background:
  linear-gradient(45deg, green, black),
  url("img/banner.jpg");

/* CORRETO — gradiente transparente deixa a imagem aparecer */
background:
  linear-gradient(45deg, rgba(0,128,0,0.5), rgba(0,0,0,0.8)),
  url("img/banner.jpg");
```

### Cores com transparência — `rgba()`

Para definir cores com transparência, usamos `rgba()`:

```css
rgba(vermelho, verde, azul, transparência)
```

- Os três primeiros valores vão de **0 a 255** (quantidade de cada cor)
- O quarto valor (alpha) vai de **0 a 1**:
  - `0` = totalmente transparente
  - `0.5` = 50% transparente
  - `1` = totalmente opaco (sólido)

Exemplos:

```css
rgba(0, 0, 0, 0.7)       /* preto com 70% opacidade */
rgba(0, 0, 0, 0.3)       /* preto bem transparente */
rgba(255, 255, 255, 0.1) /* branco quase invisível */
rgba(0, 128, 0, 0.5)     /* verde 50% transparente */
```

### Efeito de filtro escuro no banner

Um uso muito comum é criar uma "máscara escura" sobre a imagem para melhorar a legibilidade do texto:

```css
.banner {
  background:
    linear-gradient(45deg, rgba(0,0,0,0.8), rgba(255,255,255,0.1)),
    url("img/banners/banner-home.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
}
```

Isso cria um degradê de preto semitransparente para branco quase invisível por cima da imagem, melhorando o contraste com o texto branco.

---

## Gradiente em botões

Podemos aplicar gradientes em qualquer elemento, incluindo botões:

```css
.botao {
  background: linear-gradient(45deg, #006400, #003300);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px;
}

.botao:hover {
  background: linear-gradient(45deg, #008000, #004d00);
}
```

**Importante**: quando o fundo é um gradiente, o `:hover` também precisa usar um gradiente (uma cor de fundo simples não sobrescreve o gradiente). Use cores mais claras no hover para criar o efeito de "acender".

### Ferramentas para criar gradientes

Criar gradientes manualmente pelo código pode ser difícil. Use ferramentas visuais:

- **CSS Gradient Editor** — pesquise "css gradient editor" no Google
- Permite escolher cores, ângulos e ver o resultado em tempo real
- Gera o código CSS pronto para copiar e colar

---

## Três tipos de fundo

O CSS suporta três tipos de fundo, que podem ser combinados:

| Tipo | Propriedade | Exemplo |
|---|---|---|
| Cor sólida | `background-color` | `background-color: green` |
| Imagem | `background-image` | `background-image: url("foto.jpg")` |
| Gradiente | `background` | `background: linear-gradient(...)` |

Podemos combinar gradiente + imagem usando vírgula:

```css
/* Gradiente por cima, imagem por trás */
background:
  linear-gradient(45deg, rgba(0,0,0,0.7), transparent),
  url("foto.jpg");
```

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

      /* Banner com filtro escuro sobre imagem */
      .banner {
        height: 70vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background:
          linear-gradient(45deg, rgba(0,0,0,0.8), rgba(255,255,255,0.1)),
          url("img/banners/banner-home.jpg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        color: white;
      }

      .banner h1 {
        font-family: "Montserrat", sans-serif;
        font-size: 64px;
      }

      /* Vitrine de produtos */
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

      /* Botão com gradiente */
      .botao {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        background: linear-gradient(45deg, #006400, #003300);
        color: white;
        font-weight: bold;
        padding-top: 8px;
        padding-bottom: 8px;
        border: none;
        border-radius: 8px;
      }

      .botao:hover {
        background: linear-gradient(45deg, #008000, #004d00);
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
    </div>
  </body>
</html>
```

---

## Resumo visual

```
/* Comentário CSS */
/* texto aqui */

/* Gradiente linear */
background: linear-gradient(ângulo, cor-início, cor-fim)
  45deg ...................... Diagonal
  90deg ...................... Horizontal
  180deg ..................... Vertical

/* Cores com transparência */
rgba(255, 0, 0, 0.5) ....... Vermelho 50% transparente
rgba(0, 0, 0, 0.7) ......... Preto 70% opaco
rgba(255, 255, 255, 0.1) ... Branco quase invisível

/* Múltiplos backgrounds (vírgula) */
background:
  linear-gradient(...),     /* por cima */
  url("imagem.jpg");        /* por trás */

/* Gradiente no botão */
background: linear-gradient(45deg, #006400, #003300);

/* Hover com gradiente (precisa ser gradiente também) */
.botao:hover {
  background: linear-gradient(45deg, #008000, #004d00);
}

/* Três tipos de fundo */
background-color: green .......... Cor sólida
background-image: url("...") ..... Imagem
background: linear-gradient(...) . Gradiente
```

---

## Exercício rápido

Pegue a página de loja e:

- Adicione um gradiente transparente por cima da imagem do banner usando múltiplos backgrounds
- Use `rgba()` para criar cores semitransparentes no gradiente
- Troque o `background-color` do botão por um `linear-gradient`
- Ajuste o `:hover` do botão para usar um gradiente mais claro
- Experimente diferentes ângulos (45deg, 90deg, 180deg) no gradiente do banner
