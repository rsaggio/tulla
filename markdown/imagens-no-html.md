# Imagens no HTML

## Um site sem imagens

Até agora, tudo que a gente fez foi texto: títulos, parágrafos, listas. Funciona, mas é como montar uma vitrine de loja só com placas escritas e nenhum produto exposto. Ninguém para pra olhar.

Todo site tem pelo menos uma imagem. Nesta aula, vamos aprender como colocar imagens na página, controlar o tamanho delas com CSS e entender a diferença entre usar uma URL externa e salvar a imagem no próprio projeto.

---

## A tag `<img>` — Adicionando uma imagem

Para colocar uma imagem na página, usamos a tag `<img>`. Ela é diferente das outras tags que a gente viu porque **não tem tag de fechamento** — é uma tag auto-fechante.

```html
<img src="caminho-da-imagem.jpg" alt="Descrição da imagem">
```

A tag `<img>` precisa de **atributos** para funcionar. Atributos são configurações que ficam dentro da tag de abertura.

---

## Atributos — Configurações da tag

Até agora, as tags que a gente usou eram simples: `<h1>`, `<p>`, `<ul>`. Mas tags podem ter **atributos** — informações extras que configuram como a tag funciona.

A estrutura é:

```html
<tag atributo="valor">conteúdo</tag>
```

No caso da imagem, os dois atributos obrigatórios são:

### `src` — Onde está a imagem

O atributo `src` (source) diz ao navegador **onde encontrar a imagem**. Pode ser uma URL da internet ou um caminho de arquivo no seu projeto:

```html
<img src="https://exemplo.com/foto.jpg" alt="Uma foto">
```

### `alt` — Texto alternativo

O atributo `alt` descreve o que a imagem mostra. Ele é essencial por dois motivos:

- **Acessibilidade**: pessoas cegas usam leitores de tela que leem o `alt` em voz alta para explicar a imagem
- **SEO**: o Google penaliza sites que não têm `alt` nas imagens

```html
<img src="camiseta.jpg" alt="Rapaz usando camiseta azul com detalhes brancos">
```

Se a imagem quebrar (o link parar de funcionar), o texto do `alt` aparece no lugar.

---

## Controlando o tamanho com CSS

Você pode definir largura e altura diretamente na tag com os atributos `width` e `height`:

```html
<img src="foto.jpg" alt="Foto" width="200">
```

Mas a **boa prática** é usar CSS para controlar atributos visuais. Lembra: HTML é para conteúdo, CSS é para aparência.

```html
<style>
  img {
    width: 300px;
  }
</style>
```

### Largura vs altura

Se você definir só a `width` (largura), a altura é calculada automaticamente para manter a proporção. Se definir os dois com valores diferentes da proporção original, a imagem **distorce**:

```css
/* Bom - define só a largura, altura proporcional */
img {
  width: 300px;
}

/* Ruim - força largura e altura, distorce a imagem */
img {
  width: 300px;
  height: 300px;
}
```

A regra é: **defina só a largura**. Deixe a altura ser calculada sozinha.

---

## `opacity` — Transparência da imagem

A propriedade `opacity` controla a transparência de um elemento. O valor vai de `0` (invisível) até `1` (totalmente visível):

```css
img {
  width: 300px;
  opacity: 0.5;
}
```

Com `opacity: 0.5`, a imagem fica 50% transparente — você consegue ver o fundo atrás dela. Isso é útil para efeitos visuais e sobreposições.

---

## Imagem local vs URL externa

Existem duas formas de referenciar uma imagem:

### URL externa (não recomendado para produção)

```html
<img src="https://site-de-terceiro.com/foto.jpg" alt="Uma foto">
```

O problema: se o site sair do ar, a imagem **quebra** e só aparece o texto do `alt`. Você depende de um servidor que não controla.

### Imagem local (recomendado)

Salve a imagem dentro do seu projeto, numa pasta organizada:

```
meu-projeto/
  home.html
  img/
    camisetas/
      camiseta1.jpg
      camiseta2.jpg
```

E referencie com o caminho relativo:

```html
<img src="img/camisetas/camiseta1.jpg" alt="Camiseta azul">
```

Assim a imagem está sob seu controle e nunca vai quebrar.

---

## Tudo junto: página de loja

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
      img {
        width: 300px;
      }
      p {
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <h1>Loja de Roupas</h1>

    <h2>Camiseta Polo Azul</h2>
    <img src="img/camisetas/camiseta1.jpg" alt="Rapaz usando camiseta polo azul com detalhes brancos">
    <p>Camiseta polo masculina, cor azul com detalhes brancos. Tamanhos P, M e G.</p>
  </body>
</html>
```

---

## Resumo visual

```
<img>            → Tag de imagem (auto-fechante, sem </img>)
  src="..."      → Caminho ou URL da imagem (obrigatório)
  alt="..."      → Texto alternativo para acessibilidade (obrigatório)

CSS para imagens:
  width          → Largura (defina só esta, a altura se ajusta)
  height         → Altura (evite usar junto com width)
  opacity        → Transparência (0 = invisível, 1 = visível)

Boas práticas:
  - Sempre use alt nas imagens
  - Prefira imagens locais (salvas no projeto)
  - Controle tamanho via CSS, não por atributos HTML
  - Defina só width, deixe height automático
```

---

## Exercício rápido

Crie uma página de loja com pelo menos 3 produtos. Cada produto deve ter:

- Um título `<h2>` com o nome do produto
- Uma imagem `<img>` com `src` e `alt`
- Um parágrafo `<p>` com a descrição
- CSS controlando o tamanho das imagens
