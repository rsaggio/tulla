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
    const markdownPath = path.join(__dirname, "..", "markdown", "box-model-margin-padding.md");
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
      title: "Box Model: Margin, Padding e Alinhamento",
      content:
        "Neste vídeo você vai aprender que todo elemento HTML é uma caixa e como controlar " +
        "o espaço dentro (padding) e fora (margin) dessas caixas, além de alinhar texto " +
        "com text-align e marcar trechos com a tag span.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160702856",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Box Model: Margin, Padding e Alinhamento",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Margin e Padding
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Controlando Espaçamento com Margin e Padding",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Controlando Espaçamento com Margin e Padding",
      description:
        "Neste exercício você vai praticar o uso de margin e padding para controlar " +
        "o espaçamento dos elementos na página. O objetivo é entender a diferença " +
        "entre espaço externo (margin) e espaço interno (padding).",
      instructions:
        "Crie uma página HTML de um cartão de produto com espaçamento bem definido. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head\n" +
        "- No CSS, remova a margem padrão do body (body { margin: 0; })\n" +
        "- Um h2 com o nome do produto, com:\n" +
        "  - border de 1px solid\n" +
        "  - padding de 16px (espaço interno entre a borda e o texto)\n" +
        "  - margin-top e margin-bottom de 8px (espaço entre o título e outros elementos)\n" +
        "  - width de 300px\n" +
        "- Uma imagem do produto (pode usar https://via.placeholder.com/300x200)\n" +
        "- Um parágrafo com a descrição do produto, com margin de 8px 0\n\n" +
        "Experimente mudar os valores de margin e padding para ver a diferença. " +
        "Lembre-se: margin = fora da borda, padding = dentro da borda.\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Layout de cartão com span e text-align
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Cartão de Produto com Preço e Alinhamento",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Cartão de Produto com Preço e Alinhamento",
      description:
        "Neste exercício você vai criar um cartão de produto completo usando " +
        "margin, padding, text-align e a tag span para mostrar preço antigo " +
        "riscado e preço novo.",
      instructions:
        "Crie uma página HTML de vitrine de loja com pelo menos 2 cartões de produto. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head\n" +
        "- body com margin: 0\n" +
        "- Um h1 com o nome da loja\n" +
        "- Para cada produto:\n" +
        "  - Um h2 com o nome do produto, centralizado (text-align: center) e com width definida\n" +
        "  - Uma imagem com a mesma largura do título\n" +
        "  - Um parágrafo de preço alinhado à direita (text-align: right) contendo:\n" +
        "    - O preço antigo dentro de um <span> com text-decoration: line-through\n" +
        "    - O preço novo fora do span\n" +
        "- Use padding no título para dar espaço interno\n" +
        "- Use margin para controlar a distância entre os elementos\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Box Model, Margin e Padding",
      content: "Teste seus conhecimentos sobre o Box Model, margin, padding e alinhamento de texto.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "No CSS, todo elemento HTML é tratado como:",
          options: [
            "Um círculo",
            "Uma caixa retangular",
            "Uma linha",
            "Um triângulo",
          ],
          correctAnswer: 1,
          explanation:
            "No CSS, todo elemento HTML é uma caixa retangular. Isso vale para títulos, " +
            "parágrafos, imagens, listas — tudo. Esse conceito se chama Box Model.",
        },
        {
          question: "O que a propriedade margin controla?",
          options: [
            "A distância entre a borda e o conteúdo (espaço interno)",
            "A cor de fundo do elemento",
            "A distância entre a borda e outros elementos (espaço externo)",
            "O tamanho da fonte do texto",
          ],
          correctAnswer: 2,
          explanation:
            "A margin controla o espaço externo — a distância entre a borda do elemento " +
            "e os outros elementos ao redor. Ela empurra os vizinhos para longe.",
        },
        {
          question: "O que a propriedade padding controla?",
          options: [
            "A distância entre a borda e outros elementos",
            "A distância entre a borda e o conteúdo interno",
            "A largura da borda",
            "A transparência do elemento",
          ],
          correctAnswer: 1,
          explanation:
            "O padding controla o espaço interno — a distância entre a borda e o conteúdo " +
            "(texto, imagem) que está dentro do elemento.",
        },
        {
          question: "Por que o conteúdo da página não encosta nas bordas da tela por padrão?",
          options: [
            "Porque o navegador não permite",
            "Porque o body tem uma margem padrão",
            "Porque o HTML tem padding automático",
            "Porque as imagens ocupam espaço extra",
          ],
          correctAnswer: 1,
          explanation:
            "O <body> vem com uma margem padrão definida pelo navegador. Para remover, " +
            "basta usar body { margin: 0; } no CSS.",
        },
        {
          question: "Qual valor de text-align centraliza o texto?",
          options: [
            "text-align: middle",
            "text-align: center",
            "text-align: centralize",
            "text-align: align-center",
          ],
          correctAnswer: 1,
          explanation:
            "O valor center centraliza o texto horizontalmente dentro da caixa. " +
            "Outros valores são: left (esquerda), right (direita) e justify (justificado).",
        },
        {
          question: "Para que serve a tag <span>?",
          options: [
            "Para criar um novo parágrafo",
            "Para adicionar uma imagem",
            "Para marcar um trecho do texto e aplicar estilos diferentes",
            "Para criar uma lista",
          ],
          correctAnswer: 2,
          explanation:
            "A tag <span> serve para marcar um pedaço específico do texto dentro de " +
            "outro elemento. Sozinha não faz nada visual, mas permite aplicar CSS " +
            "apenas naquele trecho.",
        },
        {
          question: "O que o seletor * (asterisco) faz no CSS?",
          options: [
            "Seleciona apenas imagens",
            "Seleciona todos os elementos da página",
            "Cria um comentário",
            "Seleciona apenas o body",
          ],
          correctAnswer: 1,
          explanation:
            "O seletor * seleciona todos os elementos da página. É útil para " +
            "depuração (ex: * { border: 1px solid red; } mostra todas as caixas).",
        },
        {
          question: "Qual a ordem correta das camadas do Box Model, de dentro para fora?",
          options: [
            "margin → border → padding → conteúdo",
            "conteúdo → margin → padding → border",
            "conteúdo → padding → border → margin",
            "border → padding → conteúdo → margin",
          ],
          correctAnswer: 2,
          explanation:
            "A ordem de dentro para fora é: conteúdo → padding → border → margin. " +
            "O conteúdo fica no centro, o padding envolve o conteúdo, a borda envolve " +
            "o padding e a margin fica por fora de tudo.",
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
