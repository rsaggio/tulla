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
    const markdownPath = path.join(__dirname, "..", "markdown", "position-absolute-zindex.md");
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
      title: "Position Absolute, Relative e Z-Index",
      content:
        "Neste vídeo você vai aprender sobre box-sizing: border-box para corrigir estouros de largura, " +
        "position: absolute para posicionar elementos em relação a um ancestral, " +
        "position: relative para criar a referência do absolute, " +
        "z-index para controlar a profundidade (quem fica por cima), " +
        "e criar etiquetas de desconto sobre os produtos.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160903426",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Position Absolute, Relative e Z-Index",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Etiquetas de Desconto
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Etiquetas de Desconto nos Produtos",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Etiquetas de Desconto nos Produtos",
      description:
        "Neste exercício você vai criar etiquetas de desconto posicionadas sobre " +
        "as imagens dos produtos usando position absolute e relative.",
      instructions:
        "Crie uma página de loja com etiquetas de desconto nos produtos:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- body com margin: 0\n\n" +
        "**Menu fixo (div com class=\"menu\"):**\n" +
        "- position: fixed, top: 0, width: 100%\n" +
        "- box-sizing: border-box (para evitar estouro com padding)\n" +
        "- z-index: 10 (para ficar por cima dos produtos)\n" +
        "- padding: 15px 30px\n" +
        "- background-color: white\n\n" +
        "**body:**\n" +
        "- padding-top para compensar a altura do menu\n\n" +
        "**Vitrine (div com id=\"products\"):**\n" +
        "- display: flex, flex-wrap: wrap, justify-content: center, gap: 20px\n" +
        "- padding: 40px\n" +
        "- background-color: #f5f5f5\n\n" +
        "**Cada produto (div com class=\"product\"):**\n" +
        "- width: 250px, min-width: 250px\n" +
        "- position: relative (referência para a etiqueta!)\n" +
        "- Pelo menos 6 produtos, sendo 3 com etiqueta de desconto\n\n" +
        "**Etiqueta (span com class=\"discount\"):**\n" +
        "- position: absolute\n" +
        "- top: 16px, left: 16px\n" +
        "- background-color: darkgreen\n" +
        "- color: white, font-weight: bold, font-size: 12px\n" +
        "- padding: 4px 8px\n" +
        "- border-radius: 6px\n" +
        "- Textos variados: \"20% OFF\", \"Novo\", \"Últimas unidades\"\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Cards com Overlay
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Cards com Overlay e Z-Index",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Cards com Overlay e Z-Index",
      description:
        "Neste exercício você vai praticar position absolute/relative " +
        "para criar cards com texto sobreposto à imagem e usar z-index para controlar camadas.",
      instructions:
        "Crie uma galeria de imagens com texto sobreposto:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Importe fontes do Google Fonts\n" +
        "- body com margin: 0\n\n" +
        "**Container (div com class=\"gallery\"):**\n" +
        "- display: flex, flex-wrap: wrap, justify-content: center, gap: 20px\n" +
        "- padding: 40px\n\n" +
        "**Pelo menos 4 cards (div com class=\"card\"):**\n" +
        "- width: 300px, min-width: 300px\n" +
        "- position: relative (referência para o overlay)\n" +
        "- border-radius: 12px\n" +
        "- overflow: hidden (para cortar os cantos arredondados da imagem)\n\n" +
        "**Imagem dentro do card:**\n" +
        "- width: 100%, display: block\n" +
        "- Use imagens de https://picsum.photos/300/200\n\n" +
        "**Overlay (div com class=\"card-overlay\"):**\n" +
        "- position: absolute\n" +
        "- bottom: 0, left: 0\n" +
        "- width: 100%, box-sizing: border-box\n" +
        "- background: linear-gradient(transparent, rgba(0,0,0,0.8))\n" +
        "- color: white\n" +
        "- padding: 20px\n" +
        "- Dentro: um h3 com o título e um p com a descrição\n\n" +
        "**Badge no canto (span com class=\"badge\"):**\n" +
        "- position: absolute, top: 12px, right: 12px\n" +
        "- background-color com cor de destaque\n" +
        "- padding: 4px 10px, border-radius: 20px\n" +
        "- font-size: 11px, color: white, font-weight: bold\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Position Absolute, Relative e Z-Index",
      content: "Teste seus conhecimentos sobre posicionamento absoluto, relativo e controle de camadas.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "O que faz box-sizing: border-box?",
          options: [
            "Adiciona uma borda ao redor do elemento",
            "Inclui padding e borda na largura total, evitando que o elemento estoure",
            "Remove todas as bordas do elemento",
            "Faz o elemento ocupar a tela toda",
          ],
          correctAnswer: 1,
          explanation:
            "Por padrão, width define a largura do conteúdo e o padding é adicionado por fora. " +
            "Com box-sizing: border-box, padding e borda são incluídos na largura total. " +
            "Assim, width: 100% + padding: 20px não estoura a largura da tela.",
        },
        {
          question: "Qual a diferença entre position: fixed e position: absolute?",
          options: [
            "Não há diferença",
            "fixed é relativo à tela e não rola; absolute é relativo ao ancestral e rola junto",
            "fixed rola com a página; absolute fica parado",
            "absolute só funciona em divs; fixed funciona em qualquer tag",
          ],
          correctAnswer: 1,
          explanation:
            "position: fixed posiciona em relação à tela (viewport) e fica parado ao rolar. " +
            "position: absolute posiciona em relação ao ancestral com position não estático " +
            "e rola junto com o conteúdo.",
        },
        {
          question: "Para que serve position: relative no elemento pai?",
          options: [
            "Para mover o pai para outra posição",
            "Para servir de referência para filhos com position: absolute",
            "Para esconder o elemento",
            "Para fixar o elemento na tela",
          ],
          correctAnswer: 1,
          explanation:
            "position: relative no pai cria um ponto de referência para filhos com position: absolute. " +
            "Sem isso, o absolute usa a tela como referência. O relative não move o pai de lugar — " +
            "ele continua no fluxo normal.",
        },
        {
          question: "O que acontece se usarmos position: absolute sem nenhum ancestral com position: relative?",
          options: [
            "O elemento desaparece",
            "O elemento se posiciona em relação à tela/body",
            "O CSS ignora a propriedade",
            "O navegador dá erro",
          ],
          correctAnswer: 1,
          explanation:
            "O absolute procura o primeiro ancestral com position diferente de static. " +
            "Se não encontrar nenhum, usa o body/viewport como referência. " +
            "O elemento se posiciona em relação ao canto superior esquerdo da página.",
        },
        {
          question: "O que faz z-index: 10 em um elemento?",
          options: [
            "Move o elemento 10 pixels para a direita",
            "Define que o elemento fica 10 camadas à frente, aparecendo por cima de elementos com z-index menor",
            "Define a opacidade como 10%",
            "Define o tamanho da fonte como 10px",
          ],
          correctAnswer: 1,
          explanation:
            "z-index controla a profundidade (eixo Z) — quem fica por cima de quem. " +
            "Um z-index: 10 fica por cima de z-index: 1 ou z-index: 0. " +
            "Só funciona em elementos com position diferente de static.",
        },
        {
          question: "O que significa padding: 4px 8px?",
          options: [
            "4px em todos os lados e 8px de margem",
            "4px no topo e embaixo, 8px na esquerda e direita",
            "4px na esquerda e 8px na direita",
            "4px de borda e 8px de padding",
          ],
          correctAnswer: 1,
          explanation:
            "Quando padding tem dois valores, o primeiro aplica em cima/baixo e o segundo " +
            "em esquerda/direita. padding: 4px 8px = 4px vertical, 8px horizontal. " +
            "Um valor só (padding: 4px) aplica em todos os lados.",
        },
        {
          question: "Por que o menu fixo precisa de z-index quando existem elementos com position: relative na página?",
          options: [
            "Porque z-index é obrigatório em menus",
            "Porque elementos com position entram na mesma camada de sobreposição e podem passar por cima do menu",
            "Porque o menu fica invisível sem z-index",
            "Porque z-index muda a cor do menu",
          ],
          correctAnswer: 1,
          explanation:
            "Elementos com position (relative, absolute, fixed) podem se sobrepor. " +
            "Sem z-index, a ordem de sobreposição segue a ordem do HTML. " +
            "Ao rolar, os produtos (relative) passam por cima do menu (fixed). " +
            "z-index: 10 no menu garante que ele fique sempre na frente.",
        },
        {
          question: "Quais são os quatro tipos de position que vimos?",
          options: [
            "static, relative, absolute, fixed",
            "top, bottom, left, right",
            "block, inline, flex, grid",
            "margin, padding, border, content",
          ],
          correctAnswer: 0,
          explanation:
            "Os quatro tipos são: static (padrão, fluxo normal), relative (fluxo normal + referência), " +
            "absolute (posiciona relativo ao ancestral não estático) e fixed (fixo na tela). " +
            "top/bottom/left/right são propriedades de posição, não tipos de position.",
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
