# Ícones e Google Fonts

## Adicionando ícones com Google Material Icons

Ícones são pequenos símbolos visuais que ajudam o usuário a entender a interface — um carrinho de compras, um coração, uma lupa. O Google oferece uma biblioteca gratuita de ícones chamada **Material Symbols**.

### Importando a biblioteca

No `<head>` do HTML, adicione o link da biblioteca:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
</head>
```

Isso carrega todos os ícones disponíveis para uso na página.

### Usando um ícone

Para exibir um ícone, use um `<span>` com a classe `material-symbols-outlined` e escreva o nome do ícone dentro:

```html
<span class="material-symbols-outlined">shopping_cart</span>
```

O texto `shopping_cart` não aparece como texto — a biblioteca transforma em um ícone visual de carrinho de compras.

Outros exemplos de ícones:

```html
<span class="material-symbols-outlined">favorite</span>       <!-- coração -->
<span class="material-symbols-outlined">search</span>          <!-- lupa -->
<span class="material-symbols-outlined">delete</span>          <!-- lixeira -->
<span class="material-symbols-outlined">home</span>            <!-- casa -->
<span class="material-symbols-outlined">star</span>            <!-- estrela -->
```

> Você pode ver todos os ícones disponíveis em [fonts.google.com/icons](https://fonts.google.com/icons)

---

## Cuidado com o seletor `span` no CSS

Se você tem um estilo aplicado diretamente na tag `span`:

```css
span {
  text-decoration: line-through;
}
```

Isso vai afetar **todos** os spans da página — incluindo os ícones! Os ícones são `<span>`, então ficariam com uma linha riscada em cima.

### Solução: usar uma classe

Em vez de estilizar a tag `span` diretamente, crie uma classe específica:

```css
/* ERRADO — afeta todos os spans, incluindo ícones */
span {
  text-decoration: line-through;
}

/* CORRETO — afeta só os elementos com essa classe */
.riscado {
  text-decoration: line-through;
}
```

```html
<!-- Preço riscado com classe específica -->
<p><span class="riscado">R$ 199</span> R$ 99</p>

<!-- Ícone não é afetado -->
<span class="material-symbols-outlined">shopping_cart</span>
```

**Regra importante**: evite estilizar tags genéricas (`span`, `div`, `p`) diretamente quando a página tem bibliotecas externas. Use classes para ser mais específico.

---

## Ícone dentro de um botão

Para colocar um ícone ao lado do texto de um botão:

```html
<a href="carrinho.html" class="botao">
  <span class="material-symbols-outlined">shopping_cart</span>
  Adicionar ao carrinho
</a>
```

### Alinhando ícone e texto com Flexbox

O ícone e o texto podem ficar desalinhados. Para alinhar, usamos `display: flex` no botão:

```css
.botao {
  display: flex;
  justify-content: center;   /* centraliza horizontalmente */
  align-items: center;        /* alinha verticalmente */
  gap: 8px;                   /* espaço entre ícone e texto */
}
```

Antes era `display: block` para o botão funcionar como bloco. Agora usamos `display: flex` que também faz o elemento ser bloco, mas com a vantagem de alinhar os filhos (ícone + texto) lado a lado.

---

## Ícones se comportam como fontes

Ícones do Material Symbols são na verdade uma **fonte especial**. Isso significa que você pode estilizá-los como texto:

```css
.material-symbols-outlined {
  font-size: 20px;   /* tamanho do ícone */
  color: white;       /* cor do ícone */
}
```

Se o ícone está dentro de um botão com `color: white`, o ícone herda essa cor automaticamente. Mas você pode ajustar o tamanho com `font-size` para ficar proporcional ao texto.

---

## Google Fonts — Tipografia personalizada

Por padrão, o navegador usa fontes genéricas (como Times New Roman ou Arial). Com o **Google Fonts**, você pode usar fontes profissionais gratuitamente.

### Importando fontes

No `<head>` do HTML, adicione os links das fontes desejadas:

```html
<head>
  <!-- Fontes do Google -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bunge&display=swap" />
</head>
```

O parâmetro `wght@400;700` indica os pesos que queremos:
- **400** = normal
- **700** = bold (negrito)

### Aplicando fontes no CSS

Use a propriedade `font-family`:

```css
/* Fonte para o corpo (todo o texto da página) */
body {
  font-family: "Open Sans", sans-serif;
}

/* Fonte para títulos */
h1, h2, h3 {
  font-family: "Montserrat", sans-serif;
}

/* Fonte especial para o logo */
.logo {
  font-family: "Bunge", cursive;
}
```

O segundo valor (`sans-serif`, `cursive`) é um **fallback** — se a fonte do Google não carregar, o navegador usa uma fonte genérica parecida.

### `font-weight` com valores numéricos

Além de `bold`, você pode usar números para controlar o peso:

```css
h1 {
  font-family: "Montserrat", sans-serif;
  font-weight: 700;   /* mesmo que bold */
}

p {
  font-family: "Open Sans", sans-serif;
  font-weight: 400;   /* mesmo que normal */
}
```

Valores comuns:
- **100** = Thin (muito fino)
- **300** = Light
- **400** = Normal/Regular
- **700** = Bold (negrito)
- **900** = Black (extra negrito)

---

## Exemplo completo

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loja de Roupas</title>

    <!-- Ícones do Google -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />

    <!-- Fontes do Google -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bunge&display=swap" />

    <style>
      body {
        margin: 0;
        font-family: "Open Sans", sans-serif;
      }

      h1, h2, h3 {
        font-family: "Montserrat", sans-serif;
      }

      .logo {
        font-family: "Bunge", cursive;
        font-size: 32px;
        text-align: center;
        padding: 20px;
      }

      #vitrine {
        display: flex;
        justify-content: center;
        gap: 20px;
        padding: 50px;
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

      .riscado {
        text-decoration: line-through;
        color: gray;
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
    <h1 class="logo">Minha Loja</h1>

    <div id="vitrine">
      <div class="produto">
        <img src="img/camiseta1.jpg" alt="Camiseta azul">
        <h2>Camiseta Azul</h2>
        <p><span class="riscado">R$ 199</span> R$ 99</p>
        <a href="carrinho.html" class="botao">
          <span class="material-symbols-outlined">shopping_cart</span>
          Adicionar ao carrinho
        </a>
      </div>
    </div>
  </body>
</html>
```

---

## Resumo visual

```
<!-- Importar ícones -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />

<!-- Usar ícone -->
<span class="material-symbols-outlined">nome_do_icone</span>

<!-- Importar fonte -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=NomeDaFonte:wght@400;700&display=swap" />

/* Aplicar fonte */
font-family: "Nome Da Fonte", sans-serif;

/* Peso da fonte */
font-weight: 400 .............. Normal
font-weight: 700 .............. Bold

/* Ícone como fonte */
font-size: 20px ............... Muda tamanho do ícone
color: white .................. Muda cor do ícone

/* Alinhar ícone + texto no botão */
display: flex;
justify-content: center;
align-items: center;
gap: 8px;

/* Evite estilizar tags genéricas */
span { } ..... ERRADO (afeta ícones)
.riscado { } . CORRETO (classe específica)
```

---

## Exercício rápido

Pegue a página de loja e:

- Importe os ícones do Google Material Symbols no `<head>`
- Adicione um ícone `shopping_cart` dentro de cada botão
- Use `display: flex`, `align-items: center` e `gap` no botão para alinhar ícone e texto
- Importe pelo menos 2 fontes do Google Fonts
- Aplique uma fonte nos títulos (`h1`, `h2`) e outra no corpo (`body`)
- Crie uma classe `.riscado` para preço antigo em vez de estilizar a tag `span` diretamente
