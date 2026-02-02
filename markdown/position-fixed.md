# Position Fixed — Menu Fixo e Botão Flutuante

## A propriedade `position`

Todo elemento HTML tem uma propriedade `position` que define como ele é posicionado na página. O valor padrão é `static`:

```css
.menu {
  position: static;    /* padrão — segue o fluxo normal */
}
```

Com `position: static`, o elemento se posiciona conforme o fluxo do HTML — respeitando margens, paddings e a ordem das tags.

---

## `position: fixed` — Elemento fixo na tela

Quando usamos `position: fixed`, o elemento **descola do fluxo normal** e fica fixo na tela, mesmo quando o usuário rola a página:

```css
.menu {
  position: fixed;
}
```

### Comportamento do fixed

Ao definir `position: fixed`:

1. O elemento **sai do fluxo** — não ocupa mais espaço entre os outros elementos
2. Fica em uma **camada superior**, por cima dos demais elementos
3. Perde a referência de largura — por padrão, ocupa apenas o necessário para seus filhos
4. Precisa de `width: 100%` para ocupar a tela toda

```css
.menu {
  position: fixed;
  width: 100%;         /* força ocupar toda a largura */
}
```

---

## Propriedades de posicionamento: `top`, `bottom`, `left`, `right`

Quando um elemento tem `position: fixed`, podemos controlar **exatamente onde ele fica** usando:

```css
.menu {
  position: fixed;
  top: 0;              /* gruda no topo da tela */
  width: 100%;
}
```

| Propriedade | O que faz |
|---|---|
| `top: 0` | Gruda no topo da tela |
| `bottom: 0` | Gruda na parte de baixo da tela |
| `left: 0` | Gruda na esquerda |
| `right: 0` | Gruda na direita |
| `top: 20px` | 20px de distância do topo |
| `bottom: 24px` | 24px de distância de baixo |

Essas propriedades **só funcionam** quando o `position` é diferente de `static` (funciona com `fixed`, `absolute`, `relative`, `sticky`).

---

## Compensando o espaço do menu fixo

Quando o menu vira fixo, ele **sai do fluxo**. Isso faz o conteúdo abaixo subir e ficar escondido atrás do menu.

### O problema

```
┌──────────────┐
│   MENU       │ ← fixo, flutua por cima
│ ■■■ CONTEÚDO │ ← entra por baixo do menu
│   ...        │
└──────────────┘
```

### A solução: padding-top no body

Adicione um `padding-top` no `body` igual à altura do menu:

```css
body {
  margin: 0;
  padding-top: 78px;     /* mesma altura do menu */
}
```

### Como descobrir a altura do menu

1. Abra o DevTools (F12 ou botão direito → Inspecionar)
2. Passe o mouse sobre o menu
3. O navegador mostra as dimensões (ex: 78px de altura)

Agora o resultado é:

```
┌──────────────┐
│   MENU       │ ← fixo no topo
├──────────────┤
│   (espaço)   │ ← padding-top compensa
│   BANNER     │ ← conteúdo começa depois
│   ...        │
└──────────────┘
```

**Dica**: se o menu ficar no bottom, use `padding-bottom` em vez de `padding-top`.

---

## Exemplo: Menu fixo no topo

```css
.menu {
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding-top: 78px;    /* altura do menu */
}
```

---

## Exemplo: Botão flutuante (WhatsApp/Suporte)

Um uso muito comum de `position: fixed` é criar um botão flutuante no canto da tela:

```html
<a href="https://wa.me/5511999999999" class="support-button">
  <span class="material-symbols-outlined">phone</span>
</a>
```

```css
.support-button {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 64px;
  height: 64px;
  background-color: darkgreen;
  color: white;
  border-radius: 50%;       /* transforma em círculo */
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 32px;
}
```

### Por que `border-radius: 50%`?

Quando aplicamos `border-radius: 50%` em um elemento quadrado (mesma largura e altura), ele se transforma em um **círculo perfeito**:

```css
.support-button {
  width: 64px;
  height: 64px;
  border-radius: 50%;    /* 64x64 + 50% = círculo */
}
```

### Por que `display: flex` e não `display: block`?

Com `display: block`, conseguimos definir largura e altura, mas o ícone não fica centralizado. Com `display: flex` + `justify-content: center` + `align-items: center`, o ícone fica perfeitamente centrado dentro do círculo.

---

## Resumo dos tipos de position

| Valor | Comportamento |
|---|---|
| `static` | Padrão — segue o fluxo normal do HTML |
| `fixed` | Fixo na tela — não se move quando rola a página |
| `relative` | Relativo — permite ajustar posição sem sair do fluxo |
| `absolute` | Absoluto — posiciona em relação ao pai mais próximo com position |
| `sticky` | Grudento — se comporta como relative até rolar, aí vira fixed |

Nesta aula vimos `static` e `fixed`. Os demais serão vistos nas próximas aulas.

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
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" />

    <style>
      body {
        margin: 0;
        padding-top: 78px;
        font-family: "Open Sans", sans-serif;
      }

      /* Menu fixo no topo */
      .menu {
        position: fixed;
        top: 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 30px;
        background-color: white;
        box-sizing: border-box;
      }

      /* Botão flutuante de suporte */
      .support-button {
        position: fixed;
        bottom: 24px;
        left: 24px;
        width: 64px;
        height: 64px;
        background-color: darkgreen;
        color: white;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        font-size: 32px;
      }

      .support-button:hover {
        background-color: green;
      }

      /* Banner */
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

      /* Vitrine */
      #vitrine {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
        padding: 50px;
        background-color: #f5f5f5;
      }
    </style>
  </head>
  <body>
    <!-- Botão de suporte flutuante -->
    <a href="https://wa.me/5511999999999" class="support-button">
      <span class="material-symbols-outlined">phone</span>
    </a>

    <!-- Menu fixo -->
    <div class="menu">
      <h2>Minha Loja</h2>
      <nav>
        <a href="home.html">Home</a>
        <a href="produtos.html">Produtos</a>
        <a href="contato.html">Contato</a>
      </nav>
    </div>

    <!-- Banner -->
    <div class="banner">
      <h1>Promoção de Verão 2026</h1>
    </div>

    <!-- Vitrine de produtos -->
    <div id="vitrine">
      <!-- produtos aqui -->
    </div>
  </body>
</html>
```

---

## Resumo visual

```
/* Posicionamento */
position: static ............. Padrão (fluxo normal)
position: fixed .............. Fixo na tela (não rola)

/* Onde posicionar (só funciona com fixed/absolute/relative/sticky) */
top: 0 ....................... Gruda no topo
bottom: 24px ................. 24px de baixo
left: 24px ................... 24px da esquerda
right: 0 ..................... Gruda na direita

/* Menu fixo no topo */
.menu {
  position: fixed;
  top: 0;
  width: 100%;
}
body {
  padding-top: 78px;       /* compensa a altura do menu */
}

/* Botão flutuante circular */
.botao {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 64px;
  height: 64px;
  border-radius: 50%;      /* vira círculo */
  display: flex;
  justify-content: center;
  align-items: center;
}
```

---

## Exercício rápido

Pegue a página de loja e:

- Torne o menu fixo com `position: fixed` e `top: 0`
- Adicione `width: 100%` para o menu ocupar toda a largura
- Compense o espaço com `padding-top` no body (use o DevTools para medir a altura)
- Crie um botão flutuante circular no canto inferior com `position: fixed` e `bottom: 24px`
- Use um ícone do Material Symbols dentro do botão
- Centralize o ícone com `display: flex`, `justify-content: center` e `align-items: center`
