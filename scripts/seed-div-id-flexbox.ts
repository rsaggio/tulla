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
    const markdownPath = path.join(__dirname, "..", "markdown", "div-id-flexbox.md");
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
      title: "Div, ID e Flexbox: Organizando Layouts",
      content:
        "Neste vídeo você vai aprender a agrupar elementos com a tag div, " +
        "diferenciar elementos usando o atributo id, e posicionar itens lado a lado " +
        "com display flex, justify-content, gap e box-sizing.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160859067",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Div, ID e Flexbox: Organizando Layouts",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Div e ID
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Agrupando Produtos com Div e ID",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Agrupando Produtos com Div e ID",
      description:
        "Neste exercício você vai praticar o uso da tag div para agrupar elementos " +
        "e o atributo id para diferenciar divs no CSS. O objetivo é organizar " +
        "o código da página e aplicar estilos diferentes em cada divisão.",
      instructions:
        "Crie uma página HTML de uma loja com 3 cartões de produto organizados com divs. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head\n" +
        "- body com margin: 0\n" +
        "- Uma div com id=\"vitrine\" que envolve todos os produtos\n" +
        "  - No CSS, use #vitrine para dar width: 100%, padding: 20px e box-sizing: border-box\n" +
        "  - Adicione uma border: 1px solid blue na #vitrine para visualizar\n" +
        "- Dentro da vitrine, 3 divs (uma para cada produto), cada uma contendo:\n" +
        "  - Uma imagem (pode usar https://via.placeholder.com/250x200)\n" +
        "  - Um h2 com o nome do produto\n" +
        "  - Um parágrafo com o preço\n" +
        "- No CSS, defina width: 250px nas divs dos produtos\n" +
        "- Use width: 100% na imagem, h2 e p para que se adaptem à div\n\n" +
        "Observe como o id permite estilizar a div pai de forma diferente das divs filhas.\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Flexbox Layout
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Vitrine com Flexbox",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Vitrine com Flexbox",
      description:
        "Neste exercício você vai usar display flex para criar uma vitrine " +
        "de produtos lado a lado, praticando justify-content, gap e flex-direction.",
      instructions:
        "Crie uma página HTML de vitrine de loja com os produtos lado a lado usando Flexbox. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head\n" +
        "- body com margin: 0\n" +
        "- Um h1 com o nome da loja, centralizado (text-align: center)\n" +
        "- Uma div com id=\"vitrine\" contendo 3 divs de produto\n" +
        "- No CSS da #vitrine:\n" +
        "  - display: flex\n" +
        "  - justify-content: center\n" +
        "  - gap: 20px\n" +
        "  - padding: 30px\n" +
        "  - width: 100%\n" +
        "  - box-sizing: border-box\n" +
        "- Cada div de produto com width: 250px\n" +
        "- Imagens com width: 100%\n" +
        "- Títulos centralizados (text-align: center)\n\n" +
        "Depois de montar, experimente:\n" +
        "1. Trocar justify-content para space-between, space-around e space-evenly\n" +
        "2. Trocar flex-direction para column e ver o resultado\n" +
        "3. Mudar o gap para 50px\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Div, ID e Flexbox",
      content: "Teste seus conhecimentos sobre a tag div, o atributo id e o layout com Flexbox.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Para que serve a tag <div>?",
          options: [
            "Para criar um link",
            "Para agrupar elementos e criar divisões na página",
            "Para inserir uma imagem",
            "Para criar uma lista",
          ],
          correctAnswer: 1,
          explanation:
            "A tag <div> serve para agrupar elementos HTML, criando divisões " +
            "na página. Ela funciona como uma caixa que organiza outros elementos dentro dela.",
        },
        {
          question: "Qual é o problema de estilizar elementos apenas pela tag no CSS?",
          options: [
            "Não é possível estilizar por tag",
            "O navegador não reconhece tags no CSS",
            "A regra vale para todas as tags iguais na página, sem distinção",
            "As tags não aceitam propriedades CSS",
          ],
          correctAnswer: 2,
          explanation:
            "Quando estilizamos por tag (ex: div { width: 250px; }), a regra vale para " +
            "TODAS as divs da página. Se queremos estilos diferentes para divs diferentes, " +
            "precisamos usar id ou class para diferenciá-las.",
        },
        {
          question: "Como selecionamos um elemento com id=\"pai\" no CSS?",
          options: [
            ".pai { }",
            "#pai { }",
            "pai { }",
            "@pai { }",
          ],
          correctAnswer: 1,
          explanation:
            "Para selecionar um id no CSS, usamos o símbolo # (hashtag) seguido do nome " +
            "do id. Então id=\"pai\" é selecionado com #pai { } no CSS.",
        },
        {
          question: "O que faz a propriedade display: flex?",
          options: [
            "Esconde o elemento",
            "Deixa o elemento com borda flexível",
            "Habilita o layout flexível, permitindo organizar os filhos em linha ou coluna",
            "Muda a cor de fundo do elemento",
          ],
          correctAnswer: 2,
          explanation:
            "O display: flex habilita o Flexbox no elemento pai, permitindo organizar " +
            "os filhos em linha (row) ou coluna (column), além de controlar alinhamento " +
            "e espaçamento.",
        },
        {
          question: "Qual propriedade controla se os filhos ficam em linha ou coluna no Flexbox?",
          options: [
            "justify-content",
            "flex-direction",
            "gap",
            "box-sizing",
          ],
          correctAnswer: 1,
          explanation:
            "A propriedade flex-direction define a direção dos filhos: row (linha, padrão) " +
            "ou column (coluna). É uma das primeiras coisas a definir ao usar Flexbox.",
        },
        {
          question: "Qual valor de justify-content centraliza os itens?",
          options: [
            "flex-start",
            "space-between",
            "center",
            "flex-end",
          ],
          correctAnswer: 2,
          explanation:
            "O valor center centraliza os filhos no eixo principal. flex-start alinha " +
            "à esquerda, flex-end à direita, e space-between distribui com espaço entre eles.",
        },
        {
          question: "Qual a diferença entre gap e margin para espaçar elementos?",
          options: [
            "Não existe diferença, são a mesma coisa",
            "Gap define espaço entre filhos sem somar; margin pode somar nas extremidades",
            "Margin só funciona na horizontal",
            "Gap só funciona com imagens",
          ],
          correctAnswer: 1,
          explanation:
            "O gap define o espaçamento entre os filhos de forma precisa, sem somar margens. " +
            "Com margin, a margem direita de um elemento soma com a margem esquerda do vizinho, " +
            "resultando em espaço dobrado. O gap evita esse problema.",
        },
        {
          question: "Para que serve box-sizing: border-box?",
          options: [
            "Para adicionar uma caixa ao redor do elemento",
            "Para incluir padding e border no cálculo da largura total",
            "Para remover a borda do elemento",
            "Para centralizar o elemento na tela",
          ],
          correctAnswer: 1,
          explanation:
            "Por padrão, width não inclui padding e border, fazendo o elemento ficar " +
            "maior que o esperado. Com box-sizing: border-box, a largura total já inclui " +
            "padding e border, evitando barras de scroll horizontais.",
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
