# Estrutura Básica de uma Página HTML

## Imagine que você precisa construir uma casa

Você acabou de ganhar um terreno e quer construir uma casa. Por onde começar? Não dá para simplesmente empilhar tijolos e torcer para dar certo. Toda casa precisa de uma **estrutura fundamental**: fundação, paredes, telhado, cômodos. Sem isso, não é uma casa — é um amontoado de materiais.

Uma página HTML funciona da mesma forma. Antes de colocar textos bonitos, imagens e botões, você precisa montar a **estrutura que sustenta tudo**. Essa estrutura é o esqueleto da sua página.

---

## O esqueleto de toda página HTML

Toda página HTML começa com o mesmo modelo base. Pense nele como a planta baixa da sua casa:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Minha Primeira Página</title>
  </head>
  <body>
    <h1>Olá, mundo!</h1>
    <p>Esta é minha primeira página web.</p>
  </body>
</html>
```

Parece muita coisa? Vamos entender cada parte.

---

## `<!DOCTYPE html>` — O alvará de construção

Quando você constrói uma casa, precisa de um alvará que diz à prefeitura: "esta construção segue as normas atuais". O `<!DOCTYPE html>` faz exatamente isso — avisa ao navegador: **"este documento segue o padrão HTML5"**.

Sem ele, o navegador pode interpretar sua página de formas estranhas, como se tentasse encaixar uma planta moderna em regras de construção de 1990.

```html
<!DOCTYPE html>
```

Sempre coloque na **primeira linha**. Sem exceções.

---

## `<html>` — O terreno da construção

A tag `<html>` é o **terreno onde tudo será construído**. Todo o conteúdo da página fica dentro dela.

```html
<html lang="pt-BR">
  <!-- tudo fica aqui dentro -->
</html>
```

O atributo `lang="pt-BR"` diz ao navegador e aos mecanismos de busca que o conteúdo está em português do Brasil. Isso ajuda na acessibilidade (leitores de tela pronunciam as palavras corretamente) e no SEO.

---

## `<head>` — O projeto elétrico e hidráulico

Quando você olha para uma casa pronta, não vê a fiação elétrica nem os canos. Mas sem eles, nada funciona. O `<head>` é exatamente isso: **informações invisíveis que fazem a página funcionar corretamente**.

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minha Primeira Página</title>
</head>
```

O que vai dentro do `<head>`:

### `<meta charset="UTF-8">`
Define a codificação de caracteres. Sem isso, acentos e caracteres especiais podem aparecer quebrados. Já viu algo como `SoluÃ§Ã£o` em vez de `Solução`? É isso que acontece sem o charset correto.

### `<meta name="viewport" ...>`
Garante que sua página se adapte a telas de celular. Sem essa linha, sua página vai parecer minúscula no celular, como se alguém tivesse espremido um site de desktop numa tela pequena.

### `<title>`
O título que aparece na **aba do navegador**. Não é o título da página em si — é o nome que aparece lá em cima, na aba. Também é o que o Google mostra nos resultados de busca.

---

## `<body>` — Os cômodos da casa

Se o `<head>` é a parte invisível, o `<body>` é **tudo que as pessoas veem**. Textos, imagens, botões, formulários — tudo que aparece na tela fica dentro do `<body>`.

```html
<body>
  <h1>Olá, mundo!</h1>
  <p>Esta é minha primeira página web.</p>
</body>
```

Pense nos elementos dentro do `<body>` como os móveis e a decoração dos cômodos. O `<h1>` é como a placa na entrada da casa, e o `<p>` é como um recado colado na parede.

---

## Tags: as peças de encaixe

Você deve ter notado que tudo em HTML usa essas "etiquetas" com `< >`. Elas são chamadas de **tags** e quase sempre vêm em pares:

```html
<tag>conteúdo</tag>
```

A tag de abertura `<tag>` diz: "começa aqui". A tag de fechamento `</tag>` diz: "termina aqui". O conteúdo fica no meio.

Algumas tags não precisam de fechamento porque não têm conteúdo dentro — como o `<meta>` e o `<br>`. São chamadas de **tags auto-fechantes**.

---

## Tudo junto: a planta completa

Vamos montar uma página um pouco mais completa para fixar. Usando apenas o que você já conhece — títulos e parágrafos:

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sobre Mim</title>
  </head>
  <body>
    <h1>Meu nome é Ana</h1>
    <p>Estou aprendendo a criar páginas web.</p>
    <p>Essa é minha primeira página HTML e estou gostando!</p>

    <h2>O que estou estudando</h2>
    <p>Estou começando pelo HTML, depois vou para CSS e JavaScript.</p>

    <h3>Por que escolhi programação?</h3>
    <p>Sempre tive curiosidade de entender como os sites que uso todo dia são feitos.</p>
  </body>
</html>
```

Repare como os títulos criam uma **hierarquia**, como os andares de um prédio: `<h1>` é o andar principal, `<h2>` é uma seção dentro dele e `<h3>` um detalhe dentro dessa seção. Os parágrafos `<p>` preenchem cada seção com conteúdo.

---

## Resumo visual

```
<!DOCTYPE html>          → Declara o padrão HTML5
<html>                   → Contém toda a página
  <head>                 → Informações invisíveis (metadata)
    <meta charset>       → Codificação de caracteres
    <meta viewport>      → Adaptação para mobile
    <title>              → Título na aba do navegador
  </head>
  <body>                 → Conteúdo visível da página
    <h1> a <h6>          → Títulos (do maior ao menor)
    <p>                  → Parágrafos de texto
  </body>
</html>
```

---

## Exercício rápido

Abra um editor de texto (pode ser o VS Code, Notepad ou qualquer um), copie o modelo base lá de cima, salve como `index.html` e abra no navegador. Pronto — você acabou de criar sua primeira página web.

Agora tente mudar o título, adicionar mais parágrafos e usar diferentes níveis de título (`<h1>` até `<h6>`) para organizar o conteúdo. A melhor forma de aprender HTML é **mexendo no código e vendo o resultado no navegador**.
