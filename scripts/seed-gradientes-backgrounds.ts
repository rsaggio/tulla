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
    const markdownPath = path.join(__dirname, "..", "markdown", "gradientes-backgrounds.md");
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
      title: "Gradientes e Múltiplos Backgrounds",
      content:
        "Neste vídeo você vai aprender a criar gradientes com linear-gradient, " +
        "combinar gradientes transparentes com imagens de fundo usando múltiplos backgrounds, " +
        "usar rgba() para cores com transparência, aplicar gradientes em botões " +
        "e usar ferramentas visuais para criar degradês.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160890512",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Gradientes e Múltiplos Backgrounds",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Banner com Filtro Gradiente
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Banner com Filtro Gradiente",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Banner com Filtro Gradiente",
      description:
        "Neste exercício você vai criar um banner com imagem de fundo e um filtro " +
        "gradiente escuro por cima para melhorar a legibilidade do texto.",
      instructions:
        "Crie uma página HTML com um banner que combina gradiente e imagem de fundo:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Importe fontes do Google Fonts (Montserrat)\n" +
        "- body com margin: 0\n\n" +
        "**Banner (div com class=\"banner\"):**\n" +
        "- height: 70vh\n" +
        "- display: flex, justify-content: center, align-items: center\n" +
        "- Múltiplos backgrounds separados por vírgula:\n" +
        "  - Primeiro: linear-gradient com rgba() transparente (ex: rgba(0,0,0,0.8) para rgba(255,255,255,0.1))\n" +
        "  - Segundo: url() com uma imagem (pode usar https://picsum.photos/1200/800)\n" +
        "- background-size: cover\n" +
        "- background-position: center\n" +
        "- background-repeat: no-repeat\n" +
        "- color: white\n\n" +
        "**Texto do banner (use seletor .banner h1):**\n" +
        "- font-size: 64px\n" +
        "- font-family: \"Montserrat\", sans-serif\n\n" +
        "**Experimente:**\n" +
        "- Mude o ângulo do gradiente (45deg, 90deg, 180deg) e veja a diferença\n" +
        "- Ajuste a transparência do rgba (0.3, 0.5, 0.8) e observe o contraste\n" +
        "- Teste com cores diferentes no gradiente (verde, azul, roxo)\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Botões e Cards com Gradiente
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Botões e Cards com Gradiente",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Botões e Cards com Gradiente",
      description:
        "Neste exercício você vai aplicar gradientes em botões e cards, " +
        "praticando linear-gradient com diferentes ângulos e cores.",
      instructions:
        "Crie uma página com cards de serviço que usam gradientes:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- body com margin: 0 e uma fonte do Google Fonts\n\n" +
        "**Container (div com class=\"container\"):**\n" +
        "- display: flex, flex-wrap: wrap, justify-content: center, gap: 20px\n" +
        "- padding: 40px\n\n" +
        "**Pelo menos 3 cards (div com class=\"card\"):**\n" +
        "- width: 300px, min-width: 300px\n" +
        "- Cada card com um gradiente de fundo diferente usando linear-gradient\n" +
        "  - Card 1: gradiente azul (ex: #667eea para #764ba2)\n" +
        "  - Card 2: gradiente verde (ex: #11998e para #38ef7d)\n" +
        "  - Card 3: gradiente laranja (ex: #f12711 para #f5af19)\n" +
        "- color: white\n" +
        "- padding: 30px\n" +
        "- border-radius: 12px\n" +
        "- Cada card com: h2 (nome do serviço), p (descrição), link com class=\"botao\"\n\n" +
        "**Botão (class=\"botao\"):**\n" +
        "- background: rgba(255,255,255,0.2) (fundo branco transparente)\n" +
        "- color: white\n" +
        "- border: 2px solid rgba(255,255,255,0.4)\n" +
        "- border-radius: 8px\n" +
        "- padding: 10px, text-align: center, text-decoration: none, display: block\n" +
        "- .botao:hover com background: rgba(255,255,255,0.3)\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Gradientes e Múltiplos Backgrounds",
      content: "Teste seus conhecimentos sobre gradientes, rgba e múltiplos backgrounds.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Qual a sintaxe correta para criar um gradiente linear?",
          options: [
            "background-color: gradient(red, blue)",
            "background: linear-gradient(45deg, red, blue)",
            "gradient: linear(45deg, red, blue)",
            "background-gradient: 45deg red blue",
          ],
          correctAnswer: 1,
          explanation:
            "A sintaxe correta é background: linear-gradient(ângulo, cor-início, cor-fim). " +
            "O ângulo define a direção do degradê (45deg = diagonal, 90deg = horizontal, etc.).",
        },
        {
          question: "O que significa rgba(0, 0, 0, 0.5)?",
          options: [
            "Preto totalmente opaco",
            "Branco com 50% de transparência",
            "Preto com 50% de transparência",
            "Cinza sólido",
          ],
          correctAnswer: 2,
          explanation:
            "rgba(0,0,0,0.5) é preto (0,0,0) com 50% de transparência (0.5). " +
            "O quarto valor (alpha) vai de 0 (invisível) a 1 (sólido). " +
            "0.5 significa metade transparente, metade opaco.",
        },
        {
          question: "Como combinar um gradiente com uma imagem de fundo?",
          options: [
            "Usar background-color e background-image juntos",
            "Separar por vírgula: background: linear-gradient(...), url(...)",
            "Não é possível ter dois fundos ao mesmo tempo",
            "Usar background-blend: mix",
          ],
          correctAnswer: 1,
          explanation:
            "Para múltiplos backgrounds, separamos por vírgula. O primeiro fundo fica por cima " +
            "e o segundo por trás. O gradiente precisa usar cores transparentes (rgba) para que " +
            "a imagem apareça por baixo.",
        },
        {
          question: "Por que o gradiente precisa usar cores transparentes (rgba) quando combinado com uma imagem?",
          options: [
            "Porque rgba é mais rápido de renderizar",
            "Porque cores sólidas cobrem completamente a imagem, escondendo-a",
            "Porque o navegador não aceita cores normais em gradientes",
            "Porque transparência é obrigatória em gradientes",
          ],
          correctAnswer: 1,
          explanation:
            "O gradiente fica por cima da imagem. Se usar cores sólidas (red, black), " +
            "ele cobre a imagem completamente. Com rgba e transparência, a imagem aparece " +
            "por baixo do gradiente, criando o efeito de filtro.",
        },
        {
          question: "O que o ângulo 45deg faz em um linear-gradient?",
          options: [
            "O degradê vai de cima para baixo",
            "O degradê vai da esquerda para a direita",
            "O degradê vai na diagonal (de baixo-esquerda para cima-direita)",
            "O degradê vai de baixo para cima",
          ],
          correctAnswer: 2,
          explanation:
            "45deg cria um degradê diagonal, indo do canto inferior esquerdo para o superior direito. " +
            "0deg vai de baixo para cima, 90deg vai da esquerda para a direita, " +
            "e 180deg vai de cima para baixo.",
        },
        {
          question: "O que é um comentário no CSS e como escrevê-lo?",
          options: [
            "// texto — igual JavaScript",
            "<!-- texto --> — igual HTML",
            "/* texto */ — abre com barra-asterisco, fecha com asterisco-barra",
            "# texto — igual Python",
          ],
          correctAnswer: 2,
          explanation:
            "Comentários CSS usam /* texto */. O navegador ignora todo o conteúdo entre /* e */. " +
            "É diferente do HTML (<!-- -->) e do JavaScript (//). " +
            "Pode ser usado para anotar o código ou desabilitar propriedades temporariamente.",
        },
        {
          question: "Por que o :hover de um botão com gradiente também precisa usar gradiente?",
          options: [
            "Porque :hover só aceita gradientes",
            "Porque background-color não sobrescreve um gradiente — o gradiente é mais forte",
            "Porque é obrigatório usar a mesma propriedade no hover",
            "Porque gradientes não aceitam hover",
          ],
          correctAnswer: 1,
          explanation:
            "Quando o fundo é definido com background: linear-gradient(...), uma simples " +
            "background-color no :hover não consegue sobrescrever o gradiente. " +
            "É preciso definir outro gradiente (com cores mais claras) no :hover para o efeito funcionar.",
        },
        {
          question: "Quais são os três tipos de fundo que o CSS suporta?",
          options: [
            "Cor sólida, imagem e gradiente",
            "Cor sólida, vídeo e animação",
            "Imagem, gradiente e sombra",
            "Cor sólida, borda e gradiente",
          ],
          correctAnswer: 0,
          explanation:
            "O CSS suporta três tipos de fundo: cor sólida (background-color: green), " +
            "imagem (background-image: url(...)) e gradiente (background: linear-gradient(...)). " +
            "Eles podem ser combinados usando vírgula para ter vários fundos ao mesmo tempo.",
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
