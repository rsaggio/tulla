# Formulários HTML — form, input, textarea e select

## Criando uma nova página

Para criar uma página de contato, seguimos o mesmo processo das outras páginas:

1. Criar o arquivo `contato.html`
2. Copiar o `<head>` com os mesmos estilos e fontes
3. Copiar o menu de navegação
4. Atualizar os links do menu em **todas** as páginas (home, carrinho e contato)

```html
<!-- Atualizar link em TODAS as páginas -->
<nav>
  <a href="home.html">Home</a>
  <a href="carrinho.html">Carrinho</a>
  <a href="contato.html">Contato</a>
</nav>
```

Lembre-se: cada página HTML é independente. Mudou o menu? Precisa mudar em todas as páginas.

---

## A tag `<form>`

Um formulário HTML é criado com a tag `<form>`:

```html
<form action="#">
  <!-- campos do formulário aqui -->
</form>
```

| Atributo | Função |
|---|---|
| `action` | URL para onde os dados serão enviados (por enquanto usamos `#`) |

O `<form>` não tem aparência visual — ele é apenas um container para os campos. O visual vem dos elementos dentro dele.

---

## Campos de texto — `<input>`

O `<input>` cria campos onde o usuário pode digitar:

```html
<label for="nome">Seu nome:</label>
<input type="text" id="nome" name="nome">
```

### Tipos de input

| Tipo | O que faz | Exemplo |
|---|---|---|
| `type="text"` | Campo de texto simples | Nome, endereço |
| `type="email"` | Campo para e-mail (valida formato) | usuario@email.com |
| `type="tel"` | Campo para telefone | (11) 99999-9999 |

```html
<!-- Campo de e-mail -->
<label for="email">Seu e-mail:</label>
<input type="email" id="email" name="email">

<!-- Campo de telefone -->
<label for="telefone">Seu telefone:</label>
<input type="tel" id="telefone" name="telefone">
```

### A tag `<label>`

O `<label>` identifica o campo para o usuário. O atributo `for` conecta o label ao input pelo `id`:

```html
<label for="nome">Seu nome:</label>     <!-- for="nome" aponta para id="nome" -->
<input type="text" id="nome" name="nome">
```

Quando o `for` do label corresponde ao `id` do input, clicar no texto do label foca automaticamente no campo.

### Atributos do input

| Atributo | Função |
|---|---|
| `type` | Define o tipo do campo (text, email, tel...) |
| `id` | Identificador único (usado pelo label) |
| `name` | Nome do campo (enviado com os dados do formulário) |

---

## Área de texto — `<textarea>`

Para mensagens com várias linhas, usamos `<textarea>` em vez de `<input>`:

```html
<label for="mensagem">Sua mensagem:</label>
<textarea id="mensagem" name="mensagem"></textarea>
```

### Diferença entre input e textarea

| Elemento | Linhas | Uso |
|---|---|---|
| `<input type="text">` | Uma linha só | Nome, e-mail, telefone |
| `<textarea>` | Múltiplas linhas | Mensagens, comentários, descrições |

### Desabilitando o redimensionamento

Por padrão, o `<textarea>` pode ser redimensionado pelo usuário arrastando o canto, o que pode quebrar o layout. Para desabilitar:

```css
form textarea {
  resize: none;        /* não permite redimensionar */
  height: 200px;       /* altura fixa */
}
```

---

## Lista de opções — `<select>`

Para campos com opções predefinidas, usamos `<select>` com `<option>`:

```html
<label for="assunto">Assunto:</label>
<select id="assunto" name="assunto">
  <option value="frete">Problemas com frete</option>
  <option value="devolucao">Devolução de itens</option>
  <option value="outro">Outro assunto</option>
</select>
```

O `<select>` cria uma lista dropdown. Cada `<option>` é um item da lista:

| Atributo | Onde | Função |
|---|---|---|
| `id` | `<select>` | Conecta com o `<label>` |
| `name` | `<select>` | Nome do campo enviado no formulário |
| `value` | `<option>` | Valor enviado quando a opção é selecionada |

---

## Botão de envio — `<button type="submit">`

Para enviar o formulário, usamos um botão do tipo `submit`:

```html
<button type="submit" class="button">Enviar Contato</button>
```

O `type="submit"` faz o botão enviar os dados do formulário para a URL definida no `action` do `<form>`.

### Removendo a borda padrão do botão

Botões HTML vêm com uma borda padrão do navegador. Para removê-la:

```css
form button {
  border: none;        /* remove a borda padrão */
}
```

---

## Organizando campos com divs

Se colocarmos labels e inputs diretamente no form com `flex-direction: column`, o gap separa **todos** os elementos igualmente — incluindo o label do seu campo:

```
Seu nome:          ← label
                   ← gap (espaço indesejado)
[___________]      ← input
                   ← gap
Seu e-mail:        ← label
```

### A solução: agrupar com divs

Envolvemos cada par label + input em uma `<div>`:

```html
<form action="#">
  <div>
    <label for="nome">Seu nome:</label>
    <input type="text" id="nome" name="nome">
  </div>
  <div>
    <label for="email">Seu e-mail:</label>
    <input type="email" id="email" name="email">
  </div>
</form>
```

E estilizamos a div para empilhar label e input:

```css
form {
  display: flex;
  flex-direction: column;
  gap: 16px;                /* espaço entre os grupos */
}

form div {
  display: flex;
  flex-direction: column;   /* label em cima, input embaixo */
}
```

Resultado:

```
Seu nome:              ← label e input juntos (sem gap)
[___________]
                       ← gap de 16px entre grupos
Seu e-mail:
[___________]
```

---

## Estilizando os campos do formulário

### Input, textarea e select

Como os três compartilham o mesmo estilo visual, agrupamos com vírgula:

```css
form input,
form textarea,
form select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;             /* remove o contorno azul ao focar */
}
```

### O outline

Quando clicamos em um campo, o navegador mostra um contorno azul (outline) ao redor. Para removê-lo:

```css
form input,
form textarea,
form select {
  outline: none;
}
```

### Label com margem

Para dar um pequeno espaço entre o label e os outros elementos:

```css
form label {
  margin-bottom: 8px;
}
```

### Largura do formulário

Para controlar a largura do formulário:

```css
form {
  width: 50%;              /* metade da tela */
}
```

---

## Exemplo completo: Página de contato

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contato</title>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap" />

    <style>
      body {
        margin: 0;
        padding-top: 78px;
        font-family: "Open Sans", sans-serif;
      }

      .menu {
        position: fixed;
        top: 0;
        width: 100%;
        padding: 15px 30px;
        background-color: white;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 10;
      }

      .content {
        padding: 0 20px;
      }

      .default-title {
        color: darkgreen;
      }

      /* Formulário */
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 50%;
      }

      form div {
        display: flex;
        flex-direction: column;
      }

      form label {
        margin-bottom: 8px;
      }

      form input,
      form textarea,
      form select {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 8px;
        outline: none;
      }

      form textarea {
        resize: none;
        height: 200px;
      }

      form button {
        border: none;
      }

      .button {
        display: block;
        padding: 12px;
        background-color: darkgreen;
        color: white;
        text-align: center;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="menu">
      <h2>Minha Loja</h2>
      <nav>
        <a href="home.html">Home</a>
        <a href="carrinho.html">Carrinho</a>
        <a href="contato.html">Contato</a>
      </nav>
    </div>

    <div class="content">
      <h2 class="default-title">Entre em Contato Conosco</h2>

      <form action="#">
        <div>
          <label for="nome">Seu nome:</label>
          <input type="text" id="nome" name="nome">
        </div>
        <div>
          <label for="email">Seu e-mail:</label>
          <input type="email" id="email" name="email">
        </div>
        <div>
          <label for="telefone">Seu telefone:</label>
          <input type="tel" id="telefone" name="telefone">
        </div>
        <div>
          <label for="assunto">Assunto:</label>
          <select id="assunto" name="assunto">
            <option value="frete">Problemas com frete</option>
            <option value="devolucao">Devolução de itens</option>
          </select>
        </div>
        <div>
          <label for="mensagem">Sua mensagem:</label>
          <textarea id="mensagem" name="mensagem"></textarea>
        </div>
        <button type="submit" class="button">Enviar Contato</button>
      </form>
    </div>
  </body>
</html>
```

---

## Resumo visual

```
<!-- Formulário básico -->
<form action="#">
  <div>
    <label for="nome">Nome:</label>
    <input type="text" id="nome" name="nome">
  </div>
</form>

<!-- Tipos de input -->
<input type="text">      ← texto simples
<input type="email">     ← e-mail (valida formato)
<input type="tel">       ← telefone

<!-- Área de texto (múltiplas linhas) -->
<textarea id="msg" name="msg"></textarea>

<!-- Lista de opções -->
<select id="assunto" name="assunto">
  <option value="frete">Frete</option>
  <option value="outro">Outro</option>
</select>

<!-- Botão de envio -->
<button type="submit">Enviar</button>

/* CSS do formulário */
form {
  display: flex;
  flex-direction: column;    /* campos empilhados */
  gap: 16px;                 /* espaço entre grupos */
}

form div {
  display: flex;
  flex-direction: column;    /* label em cima, campo embaixo */
}

form input,
form textarea,
form select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;             /* remove contorno azul */
}

form textarea {
  resize: none;              /* não redimensiona */
  height: 200px;
}

form button {
  border: none;              /* remove borda padrão */
}
```

---

## Exercício rápido

Crie uma página contato.html com:

- O mesmo menu fixo das outras páginas
- Uma div com class="content" e título "Entre em Contato Conosco"
- Um formulário com os campos: nome (text), e-mail (email), telefone (tel), assunto (select com opções) e mensagem (textarea)
- Cada campo agrupado em uma div com label em cima e campo embaixo
- Estilize: padding nos campos, borda cinza, border-radius, outline: none
- Textarea com resize: none e altura de 200px
- Botão de enviar com estilo e sem borda padrão
