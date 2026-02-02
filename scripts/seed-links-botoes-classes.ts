import mongoose from "mongoose";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

config();

import "../src/models/Course";
import "../src/models/Module";
import "../src/models/Lesson";
import "../src/models/Activity";

const Course = mongoose.models.Course;
const Module = mongoose.models.Module;
const Lesson = mongoose.models.Lesson;
const Activity = mongoose.models.Activity;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI não definida no .env");
}

async function seed() {
  try {
    console.log("Conectando ao MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado ao MongoDB");

    // Buscar o primeiro curso
    const course = await Course.findOne().sort({ createdAt: 1 });
    if (!course) {
      throw new Error("Nenhum curso encontrado. Crie um curso primeiro.");
    }
    console.log(`Curso encontrado: ${course.title}`);

    // Buscar o primeiro módulo do curso
    if (!course.modules || course.modules.length === 0) {
      throw new Error("Curso não tem módulos. Crie um módulo primeiro.");
    }

    const moduleId = course.modules[0];
    const modulo = await Module.findById(moduleId);
    if (!modulo) {
      throw new Error("Módulo não encontrado.");
    }
    console.log(`Módulo encontrado: ${modulo.title}`);

    // Ler conteúdo markdown
    const markdownPath = path.join(__dirname, "..", "markdown", "links-botoes-classes.md");
    const markdownContent = fs.readFileSync(markdownPath, "utf-8");
    console.log("Conteúdo markdown carregado");

    // Calcular próxima ordem
    const lastLesson = await Lesson.findOne({ moduleId: modulo._id }).sort({ order: -1 });
    let nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    // =============================================
    // AULA 1: Vídeo
    // =============================================
    console.log("Criando aula de vídeo...");
    const aulaVideo = await Lesson.create({
      moduleId: modulo._id,
      title: "Links, Botões e Classes CSS",
      content:
        "Neste vídeo você vai aprender a criar links com a tag <a> e o atributo href, " +
        "navegar entre páginas, estilizar links como botões usando classes CSS, " +
        "e adicionar efeitos hover com background-color.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160866914",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Links, Botões e Classes CSS",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Links e Navegação
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Criando Links entre Páginas",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Criando Links entre Páginas",
      description:
        "Neste exercício você vai praticar a criação de links com a tag <a> " +
        "e o atributo href para navegar entre páginas e para sites externos.",
      instructions:
        "Crie duas páginas HTML que se conectam por links:\n\n" +
        "**Página 1: home.html**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Um h1 com \"Minha Loja\"\n" +
        "- Um parágrafo com uma breve descrição da loja\n" +
        "- Um link para carrinho.html com o texto \"Ir para o carrinho\"\n" +
        "- Um link externo para https://google.com com o texto \"Visitar Google\"\n\n" +
        "**Página 2: carrinho.html**\n" +
        "- Estrutura completa do HTML\n" +
        "- Um h1 com \"Carrinho de Compras\"\n" +
        "- Um parágrafo com \"Seu carrinho está vazio\"\n" +
        "- Um link para home.html com o texto \"Voltar para a loja\"\n\n" +
        "Teste clicando nos links para navegar entre as páginas.\n\n" +
        "Escreva o código HTML completo das duas páginas.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Botão com Classe CSS
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Estilizando Botões com Classes CSS",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Estilizando Botões com Classes CSS",
      description:
        "Neste exercício você vai criar botões estilizados usando classes CSS, " +
        "praticando display block, background-color, padding, border-radius " +
        "e o efeito hover.",
      instructions:
        "Crie uma página HTML de loja com cartões de produto que incluem botões estilizados. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head\n" +
        "- body com margin: 0\n" +
        "- Uma div com id=\"vitrine\" usando display: flex, justify-content: center e gap: 20px\n" +
        "- Pelo menos 2 cartões de produto, cada um com:\n" +
        "  - Uma imagem (pode usar https://via.placeholder.com/250x200)\n" +
        "  - Um h2 com o nome do produto\n" +
        "  - Um parágrafo com o preço\n" +
        "  - Um link <a> com class=\"botao\" e texto \"Adicionar ao carrinho\"\n\n" +
        "A classe .botao deve ter:\n" +
        "- display: block\n" +
        "- text-align: center\n" +
        "- text-decoration: none (para remover o sublinhado)\n" +
        "- background-color com uma cor de sua escolha\n" +
        "- color: white\n" +
        "- font-weight: bold\n" +
        "- padding-top e padding-bottom de 18px\n" +
        "- border: 2px solid com uma cor mais clara que o fundo\n" +
        "- border-radius: 8px\n\n" +
        "Adicione também um efeito .botao:hover que muda o background-color " +
        "para uma tonalidade diferente.\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Links, Botões e Classes CSS",
      content: "Teste seus conhecimentos sobre links, classes CSS, display block e efeitos hover.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Qual tag HTML é usada para criar um link?",
          options: [
            "<link>",
            "<a>",
            "<href>",
            "<url>",
          ],
          correctAnswer: 1,
          explanation:
            "A tag <a> (âncora) cria links no HTML. O atributo href define " +
            "o destino do link. A tag <link> existe mas é usada para conectar " +
            "arquivos CSS externos, não para criar links clicáveis.",
        },
        {
          question: "O que o atributo href define em um link?",
          options: [
            "A cor do link",
            "O tamanho do texto",
            "O destino (para onde o link vai)",
            "O estilo do sublinhado",
          ],
          correctAnswer: 2,
          explanation:
            "O href (hypertext reference) define para onde o link vai ao ser clicado. " +
            "Pode ser uma URL externa (https://google.com) ou um arquivo local (carrinho.html).",
        },
        {
          question: "Para linkar duas páginas do mesmo projeto, o href deve ter:",
          options: [
            "O endereço completo com https://",
            "Apenas o nome do arquivo (ex: carrinho.html)",
            "O endereço IP do servidor",
            "O nome da pasta do projeto",
          ],
          correctAnswer: 1,
          explanation:
            "Para páginas no mesmo projeto/pasta, basta colocar o nome do arquivo " +
            "(ex: href=\"carrinho.html\"). Não precisa de https:// porque o navegador " +
            "já sabe que é um arquivo local.",
        },
        {
          question: "Qual a diferença entre id e class no CSS?",
          options: [
            "id usa # e é único; class usa . e pode repetir",
            "id usa . e pode repetir; class usa # e é único",
            "Não existe diferença, são a mesma coisa",
            "id só funciona em divs; class funciona em qualquer tag",
          ],
          correctAnswer: 0,
          explanation:
            "O id (seletor #) deve ser único na página — só um elemento pode ter aquele id. " +
            "A class (seletor .) pode ser aplicada em vários elementos, permitindo reutilizar " +
            "o mesmo conjunto de estilos.",
        },
        {
          question: "Por que precisamos de display: block no link para estilizá-lo como botão?",
          options: [
            "Porque o link não aparece sem display: block",
            "Porque o link é inline por padrão e não aceita width, padding vertical nem text-align",
            "Porque display: block muda a cor do link",
            "Porque links não aceitam CSS sem display: block",
          ],
          correctAnswer: 1,
          explanation:
            "A tag <a> é inline por padrão — ocupa só o espaço do texto. " +
            "Com display: block, ela se comporta como uma caixa (igual div), " +
            "aceitando width, height, padding e text-align.",
        },
        {
          question: "O que a propriedade text-decoration: none faz em um link?",
          options: [
            "Muda a cor do texto",
            "Remove o sublinhado padrão do link",
            "Adiciona negrito ao texto",
            "Centraliza o texto",
          ],
          correctAnswer: 1,
          explanation:
            "Por padrão, links têm um sublinhado. A propriedade text-decoration: none " +
            "remove esse sublinhado, deixando o texto limpo — essencial para botões.",
        },
        {
          question: "O que faz a propriedade background-color?",
          options: [
            "Muda a cor do texto",
            "Muda a cor da borda",
            "Muda a cor de fundo do elemento",
            "Muda a cor da página inteira",
          ],
          correctAnswer: 2,
          explanation:
            "A propriedade background-color define a cor de fundo de um elemento. " +
            "Pode usar nomes de cores (green, black) ou valores hexadecimais (#00ff00).",
        },
        {
          question: "Como criamos um efeito visual quando o mouse passa em cima de um botão?",
          options: [
            ".botao:click { }",
            ".botao:hover { }",
            ".botao:mouse { }",
            ".botao:over { }",
          ],
          correctAnswer: 1,
          explanation:
            "O seletor :hover aplica estilos quando o mouse está em cima do elemento. " +
            "É muito usado para dar feedback visual em botões, mudando cor de fundo, " +
            "cor do texto ou outros estilos.",
        },
      ],
    });
    console.log(`Aula de quiz criada: ${aulaQuiz.title} (ordem ${aulaQuiz.order})`);

    // Atualizar módulo com as novas aulas
    await Module.findByIdAndUpdate(modulo._id, {
      $push: {
        lessons: {
          $each: [
            aulaVideo._id,
            aulaTeoria._id,
            aulaActivity1._id,
            aulaActivity2._id,
            aulaQuiz._id,
          ],
        },
      },
    });
    console.log("Módulo atualizado com as novas aulas");

    console.log("\nResumo:");
    console.log(`- Vídeo: "${aulaVideo.title}" (ordem ${aulaVideo.order})`);
    console.log(`- Teoria: "${aulaTeoria.title}" (ordem ${aulaTeoria.order})`);
    console.log(`- Exercício 1: "${aulaActivity1.title}" (ordem ${aulaActivity1.order})`);
    console.log(`- Exercício 2: "${aulaActivity2.title}" (ordem ${aulaActivity2.order})`);
    console.log(`- Quiz: "${aulaQuiz.title}" (ordem ${aulaQuiz.order})`);
    console.log(`\nTodas as 5 aulas foram adicionadas ao módulo "${modulo.title}"`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Erro:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
