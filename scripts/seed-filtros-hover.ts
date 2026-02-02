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
    const markdownPath = path.join(__dirname, "..", "markdown", "filtros-e-hover.md");
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
      title: "Filtros CSS e Efeitos com Hover",
      content:
        "Neste vídeo você vai aprender a aplicar filtros em imagens (blur, grayscale, brightness, " +
        "contrast, sepia, invert) e criar efeitos interativos com o pseudo-seletor :hover.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160702637",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Filtros CSS e Efeitos com Hover",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Filtros
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Aplicando Filtros em Imagens",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Aplicando Filtros em Imagens",
      description:
        "Neste exercício você vai praticar o uso da propriedade filter do CSS. " +
        "O objetivo é entender como cada filtro afeta a imagem e como " +
        "combinar diferentes filtros.",
      instructions:
        "Crie uma página HTML que demonstre pelo menos 4 filtros CSS diferentes. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head\n" +
        "- Um h1 com \"Galeria de Filtros\"\n" +
        "- Pelo menos 4 imagens (pode usar https://via.placeholder.com/300x200)\n" +
        "- Cada imagem deve ter um filtro diferente aplicado via CSS " +
        "(por exemplo: blur, grayscale, sepia, brightness, contrast, saturate ou invert)\n" +
        "- Abaixo de cada imagem, um parágrafo dizendo qual filtro foi aplicado e com qual valor\n" +
        "- Todas as imagens devem ter atributo alt\n\n" +
        "Dica: para aplicar estilos diferentes em cada imagem, você pode usar o atributo " +
        "style diretamente na tag img (ex: <img style=\"filter: blur(5px)\" ...>)\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Hover
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Efeitos Interativos com Hover",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Efeitos Interativos com Hover",
      description:
        "Neste exercício você vai praticar o pseudo-seletor :hover para criar " +
        "efeitos interativos. O objetivo é entender como mudar estilos " +
        "quando o mouse está sobre um elemento.",
      instructions:
        "Crie uma página HTML de vitrine de loja com efeitos de hover. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head\n" +
        "- Um h1 com o nome da loja\n" +
        "- Pelo menos 3 produtos, cada um com uma imagem e um título h2\n" +
        "- As imagens devem começar em preto e branco (filter: grayscale(100%)) " +
        "e ficar coloridas no hover (filter: none)\n" +
        "- Os títulos h2 devem mudar de cor quando o mouse passar por cima (usando h2:hover)\n" +
        "- Adicione pelo menos mais um efeito de hover à sua escolha " +
        "(por exemplo: mudar opacity, mudar border-color, aplicar blur, etc.)\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Filtros CSS e Hover",
      content: "Teste seus conhecimentos sobre filtros CSS e o pseudo-seletor :hover.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Qual propriedade CSS aplica um desfoque na imagem?",
          options: [
            "filter: opacity(5px)",
            "filter: blur(5px)",
            "filter: focus(5px)",
            "image-blur: 5px",
          ],
          correctAnswer: 1,
          explanation:
            "O filtro blur() aplica um desfoque na imagem. O valor em pixels " +
            "define a intensidade: quanto maior, mais desfocado.",
        },
        {
          question: "Qual filtro transforma uma imagem em preto e branco?",
          options: [
            "filter: blackwhite(100%)",
            "filter: gray(100%)",
            "filter: grayscale(100%)",
            "filter: monochrome(100%)",
          ],
          correctAnswer: 2,
          explanation:
            "O filtro grayscale() transforma a imagem em tons de cinza. " +
            "Com 100%, a imagem fica totalmente em preto e branco. " +
            "Com 50%, fica parcialmente colorida.",
        },
        {
          question: "O que o filtro brightness() controla?",
          options: [
            "A saturação das cores",
            "O contraste da imagem",
            "O brilho da imagem",
            "A transparência da imagem",
          ],
          correctAnswer: 2,
          explanation:
            "O filtro brightness() controla o brilho. Valores acima de 100% " +
            "deixam a imagem mais clara, abaixo de 100% mais escura.",
        },
        {
          question: "Qual filtro aplica um tom amarelado de foto antiga?",
          options: ["filter: vintage(100%)", "filter: sepia(100%)", "filter: yellow(100%)", "filter: old(100%)"],
          correctAnswer: 1,
          explanation:
            "O filtro sepia() aplica um tom amarelado que lembra fotos antigas (vintage). " +
            "Com 100%, o efeito é total.",
        },
        {
          question: "O que o pseudo-seletor :hover faz?",
          options: [
            "Aplica estilos quando a página carrega",
            "Aplica estilos quando o elemento é clicado",
            "Aplica estilos quando o mouse está sobre o elemento",
            "Aplica estilos quando o elemento está visível",
          ],
          correctAnswer: 2,
          explanation:
            "O :hover aplica estilos apenas quando o mouse está sobre o elemento. " +
            "Quando o mouse sai, os estilos voltam ao normal.",
        },
        {
          question: "Como escrever corretamente um seletor hover para imagens?",
          options: [
            "img hover { }",
            "img.hover { }",
            "img:hover { }",
            "hover img { }",
          ],
          correctAnswer: 2,
          explanation:
            "A sintaxe correta é img:hover { }. O nome da tag, seguido de dois pontos " +
            "e hover, sem espaço.",
        },
        {
          question: "Como remover todos os filtros de um elemento?",
          options: [
            "filter: 0;",
            "filter: remove;",
            "filter: none;",
            "filter: clear;",
          ],
          correctAnswer: 2,
          explanation:
            "O valor none remove todos os filtros aplicados. É muito usado no :hover " +
            "para criar efeitos onde o filtro desaparece quando o mouse passa por cima.",
        },
        {
          question: "O :hover funciona apenas com imagens?",
          options: [
            "Sim, só funciona com a tag img",
            "Não, funciona com qualquer elemento HTML",
            "Só funciona com imagens e links",
            "Só funciona com elementos que têm borda",
          ],
          correctAnswer: 1,
          explanation:
            "O :hover funciona com qualquer elemento HTML: imagens, títulos, parágrafos, " +
            "listas, divs, etc. Você pode mudar qualquer propriedade CSS no hover.",
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
