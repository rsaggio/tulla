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
    await mongoose.connect(MONGODB_URI as string);
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
    const markdownPath = path.join(__dirname, "..", "markdown", "banner-background-image.md");
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
      title: "Banner com Background Image e Seletores Descendentes",
      content:
        "Neste vídeo você vai aprender a criar um banner promocional com imagem de fundo usando background-image, " +
        "controlar tamanho e repetição com background-size e background-repeat, " +
        "usar a unidade vh para altura relativa à tela, " +
        "e estilizar elementos específicos com seletores descendentes.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160887528",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Banner com Background Image e Seletores Descendentes",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Banner com Imagem de Fundo
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Criando um Banner Promocional",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Criando um Banner Promocional",
      description:
        "Neste exercício você vai criar um banner com imagem de fundo, " +
        "texto centralizado e altura relativa à tela usando vh.",
      instructions:
        "Crie uma página HTML com um banner promocional e uma vitrine de produtos abaixo:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Importe a fonte Montserrat do Google Fonts\n" +
        "- body com margin: 0\n\n" +
        "**Banner (div com class=\"banner\"):**\n" +
        "- height: 70vh (70% da altura da tela)\n" +
        "- display: flex\n" +
        "- justify-content: center\n" +
        "- align-items: center\n" +
        "- background-image: url() com uma imagem de sua escolha (pode usar https://picsum.photos/1200/800)\n" +
        "- background-size: cover\n" +
        "- background-repeat: no-repeat\n" +
        "- background-position: center\n" +
        "- color: white\n" +
        "- Dentro do banner: um h1 com texto \"Promoção de Verão 2026\"\n\n" +
        "**Estilo do h1 do banner (use seletor descendente .banner h1):**\n" +
        "- font-size: 64px\n" +
        "- font-family: \"Montserrat\", sans-serif\n\n" +
        "**Vitrine (div com id=\"vitrine\"):**\n" +
        "- display: flex, flex-wrap: wrap, justify-content: center, gap: 20px\n" +
        "- padding: 50px\n" +
        "- background-color: #f5f5f5\n" +
        "- Pelo menos 4 produtos com class=\"product\"\n\n" +
        "Use seletores descendentes (.product img, .product h2, etc.) em vez de estilizar tags genéricas.\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Seletores Descendentes
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Seletores Descendentes e Seções",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Seletores Descendentes e Seções",
      description:
        "Neste exercício você vai praticar seletores descendentes para estilizar " +
        "elementos específicos dentro de diferentes seções da página, sem afetar os demais.",
      instructions:
        "Crie uma página com 3 seções distintas, cada uma com estilos próprios usando seletores descendentes:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Importe fontes do Google Fonts\n" +
        "- body com margin: 0\n\n" +
        "**Seção 1: Banner (div com class=\"banner\")**\n" +
        "- height: 50vh\n" +
        "- Imagem de fundo com background-image, background-size: cover, background-repeat: no-repeat\n" +
        "- Um h1 e um parágrafo centralizados\n" +
        "- Estilize com: .banner h1 { font-size: 48px } e .banner p { font-size: 20px }\n\n" +
        "**Seção 2: Destaque (div com class=\"destaque\")**\n" +
        "- background-color: escuro (ex: #2c3e50)\n" +
        "- color: white\n" +
        "- padding: 40px\n" +
        "- Um h2 e 3 parágrafos com benefícios da loja\n" +
        "- Estilize com: .destaque h2 { } e .destaque p { }\n\n" +
        "**Seção 3: Produtos (div com id=\"vitrine\")**\n" +
        "- background-color: #f5f5f5\n" +
        "- display: flex, flex-wrap: wrap\n" +
        "- Pelo menos 3 produtos\n" +
        "- Estilize com: .product h2 { }, .product p { }, .product img { }\n\n" +
        "IMPORTANTE: Não use seletores de tag genéricos (h1, h2, p, img). " +
        "Todos os estilos devem usar seletores descendentes para serem específicos a cada seção.\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Banner, Background Image e Seletores",
      content: "Teste seus conhecimentos sobre background-image, unidade vh e seletores descendentes.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Qual a diferença entre usar <img> e background-image para exibir uma imagem?",
          options: [
            "Não há diferença, são a mesma coisa",
            "<img> é um elemento HTML visível; background-image é um fundo CSS que permite colocar texto por cima",
            "<img> só funciona com PNG; background-image aceita qualquer formato",
            "background-image é mais rápido que <img>",
          ],
          correctAnswer: 1,
          explanation:
            "A tag <img> insere uma imagem como elemento no HTML, empurrando outros conteúdos. " +
            "background-image coloca a imagem como fundo pelo CSS, permitindo que textos e outros " +
            "elementos fiquem por cima — ideal para banners.",
        },
        {
          question: "O que significa height: 70vh?",
          options: [
            "70 pixels de altura",
            "70% da largura da tela",
            "70% da altura da tela (viewport)",
            "70% do elemento pai",
          ],
          correctAnswer: 2,
          explanation:
            "vh significa viewport height (altura da viewport). 70vh é 70% da altura visível " +
            "da tela do navegador. É uma medida relativa — se adapta a diferentes tamanhos de tela.",
        },
        {
          question: "O que faz background-size: cover?",
          options: [
            "Repete a imagem para cobrir toda a div",
            "Mostra a imagem no tamanho original",
            "Redimensiona a imagem para cobrir toda a div, podendo cortar as bordas",
            "Esconde a imagem de fundo",
          ],
          correctAnswer: 2,
          explanation:
            "background-size: cover redimensiona a imagem proporcionalmente para cobrir toda a área " +
            "da div. Pode cortar partes da imagem nas bordas, mas garante que não sobra espaço vazio. " +
            "O valor contain mostra a imagem inteira, mas pode sobrar espaço.",
        },
        {
          question: "Para que serve background-repeat: no-repeat?",
          options: [
            "Faz a imagem repetir infinitamente",
            "Impede que a imagem de fundo se repita",
            "Remove a imagem de fundo",
            "Faz a imagem girar",
          ],
          correctAnswer: 1,
          explanation:
            "Por padrão, a imagem de fundo se repete (tile) para preencher a div. " +
            "background-repeat: no-repeat mostra a imagem apenas uma vez. " +
            "Outros valores: repeat-x (repete só horizontal) e repeat-y (só vertical).",
        },
        {
          question: "O que o seletor .banner h1 faz?",
          options: [
            "Estiliza todos os h1 da página",
            "Estiliza o elemento com classe banner e todos os h1",
            "Estiliza apenas os h1 que estão dentro de um elemento com classe banner",
            "Cria um h1 dentro do banner automaticamente",
          ],
          correctAnswer: 2,
          explanation:
            "O espaço entre .banner e h1 cria um seletor descendente — significa \"o h1 que está " +
            "dentro de .banner\". Só os h1 dentro do banner são afetados; outros h1 da página " +
            "continuam com seus estilos normais.",
        },
        {
          question: "Qual a diferença entre .banner h1 e div.banner h1?",
          options: [
            "Não há diferença",
            ".banner h1 funciona com qualquer tag; div.banner h1 só funciona se o banner for uma <div>",
            ".banner h1 é mais lento",
            "div.banner h1 não é um seletor válido",
          ],
          correctAnswer: 1,
          explanation:
            ".banner h1 seleciona o h1 dentro de qualquer elemento com classe banner " +
            "(div, section, header, etc.). div.banner h1 é mais específico — só funciona " +
            "se o elemento com classe banner for uma <div>.",
        },
        {
          question: "Qual a diferença entre medidas absolutas (px) e relativas (vh)?",
          options: [
            "Não há diferença prática",
            "px tem sempre o mesmo tamanho; vh se adapta ao tamanho da tela",
            "vh é mais preciso que px",
            "px só funciona para largura; vh só para altura",
          ],
          correctAnswer: 1,
          explanation:
            "Pixels (px) são medidas absolutas — 500px é sempre 500px em qualquer tela. " +
            "vh é uma medida relativa à altura da tela — 70vh será maior em um monitor grande " +
            "e menor em um celular, adaptando-se automaticamente.",
        },
        {
          question: "Como centralizar um texto vertical e horizontalmente dentro de uma div?",
          options: [
            "text-align: center e vertical-align: middle",
            "margin: auto em todas as direções",
            "display: flex, justify-content: center e align-items: center",
            "position: center",
          ],
          correctAnswer: 2,
          explanation:
            "A combinação display: flex + justify-content: center + align-items: center " +
            "é a forma mais confiável de centralizar conteúdo. justify-content centraliza " +
            "na horizontal e align-items na vertical.",
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
