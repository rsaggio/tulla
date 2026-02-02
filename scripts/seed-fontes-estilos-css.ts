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
    const markdownPath = path.join(__dirname, "..", "markdown", "fontes-e-estilos-css.md");
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
      title: "Fontes e Estilos de Texto com CSS",
      content:
        "Neste vídeo você vai aprender a personalizar a aparência dos textos da sua página: " +
        "itálico, negrito, sublinhado, troca de fontes e como importar fontes do Google Fonts.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160696823",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Fontes e Estilos de Texto com CSS",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Propriedades de texto
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Estilizando Texto com CSS",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Estilizando Texto com CSS",
      description:
        "Neste exercício você vai praticar as propriedades CSS de texto: " +
        "font-style, font-weight, text-decoration e font-size. " +
        "O objetivo é entender como cada propriedade afeta a aparência do texto " +
        "e como combinar múltiplas propriedades no mesmo seletor.",
      instructions:
        "Crie uma página HTML com uma tag <style> no head que demonstre o uso das seguintes propriedades CSS:\n\n" +
        "- Um h1 com seu nome, em negrito (font-weight: bold) e sublinhado (text-decoration: underline)\n" +
        "- Um h2 com uma cor diferente do h1 e font-size de 18px\n" +
        "- Parágrafos em itálico (font-style: italic) com font-size de 14px\n" +
        "- Uma lista (ul com li) onde os itens NÃO estejam em itálico, mas tenham o mesmo font-size dos parágrafos\n\n" +
        "O body deve conter pelo menos: nome (h1), uma descrição (p), uma seção com título (h2) e uma lista com 3 itens.\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Google Fonts
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Usando Google Fonts",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Usando Google Fonts",
      description:
        "Neste exercício você vai aprender a importar e usar fontes do Google Fonts " +
        "na sua página HTML. O objetivo é sair das fontes padrão do navegador e " +
        "personalizar a aparência da página com fontes profissionais.",
      instructions:
        "Crie uma página HTML de currículo que use pelo menos uma fonte do Google Fonts. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Um link de importação de fonte do Google Fonts dentro do head " +
        "(acesse fonts.google.com, escolha uma fonte e copie o código)\n" +
        "- Uma tag style que use font-family com o nome da fonte importada\n" +
        "- Pelo menos 3 regras CSS diferentes (combinando font-family, color, font-size, font-weight, etc.)\n" +
        "- O body com: nome (h1), informações (p), seção de habilidades (h2 + ul com li)\n\n" +
        "Escreva o código HTML completo. Cole o link do Google Fonts que você usou.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Fontes e Estilos de Texto",
      content: "Teste seus conhecimentos sobre propriedades CSS de texto e Google Fonts.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Qual propriedade CSS deixa o texto em itálico?",
          options: ["font-weight: italic", "text-style: italic", "font-style: italic", "font-italic: true"],
          correctAnswer: 2,
          explanation:
            "A propriedade font-style com valor italic deixa o texto inclinado. " +
            "Para voltar ao normal, use font-style: normal.",
        },
        {
          question: "Qual propriedade CSS deixa o texto em negrito?",
          options: ["font-style: bold", "font-weight: bold", "text-weight: bold", "font-bold: true"],
          correctAnswer: 1,
          explanation:
            "A propriedade font-weight com valor bold deixa o texto em negrito. " +
            "O valor normal remove o negrito.",
        },
        {
          question: "Como adicionar uma linha embaixo do texto com CSS?",
          options: [
            "font-decoration: underline",
            "text-underline: true",
            "text-decoration: underline",
            "border-bottom: line",
          ],
          correctAnswer: 2,
          explanation:
            "A propriedade text-decoration com valor underline adiciona uma linha " +
            "embaixo do texto. Outros valores incluem line-through (riscado) e none.",
        },
        {
          question: "Qual propriedade CSS muda a família da fonte?",
          options: ["font-name", "font-type", "font-family", "text-font"],
          correctAnswer: 2,
          explanation:
            "A propriedade font-family define qual fonte o texto vai usar. " +
            'Você pode listar várias fontes separadas por vírgula como fallback: font-family: "Roboto", Arial, sans-serif.',
        },
        {
          question:
            "Se a mesma propriedade CSS aparecer duas vezes para o mesmo seletor, qual valor prevalece?",
          options: [
            "O primeiro valor (de cima)",
            "O último valor (de baixo)",
            "Nenhum, dá erro",
            "Os dois são aplicados juntos",
          ],
          correctAnswer: 1,
          explanation:
            "No CSS, quando há conflito, o valor que aparece por último prevalece. " +
            'Isso se chama "cascata" — o CSS é lido de cima para baixo e o último valor vence.',
        },
        {
          question: "Para que serve o Google Fonts?",
          options: [
            "Para criar imagens de texto",
            "Para importar fontes gratuitas e usar em qualquer página web",
            "Para traduzir o texto da página",
            "Para aumentar automaticamente o tamanho das fontes",
          ],
          correctAnswer: 1,
          explanation:
            "O Google Fonts é uma biblioteca de fontes gratuitas. Você importa a fonte " +
            "com uma tag link no head e usa o nome dela no font-family do CSS.",
        },
        {
          question: "Onde o link de importação do Google Fonts deve ser colocado?",
          options: [
            "Dentro do <body>",
            "Dentro da tag <style>",
            "Dentro do <head>",
            "Depois do </html>",
          ],
          correctAnswer: 2,
          explanation:
            "O link de importação do Google Fonts deve ficar dentro do <head>, " +
            "junto com os outros metadados e recursos da página. " +
            "Assim o navegador carrega a fonte antes de renderizar o conteúdo.",
        },
        {
          question:
            'O que significa listar várias fontes em font-family: "Roboto", Arial, sans-serif?',
          options: [
            "As três fontes são aplicadas ao mesmo tempo",
            "O navegador escolhe aleatoriamente uma delas",
            "Se a primeira não existir, tenta a segunda, depois a terceira",
            "Só a última fonte é usada",
          ],
          correctAnswer: 2,
          explanation:
            "Quando você lista várias fontes no font-family, o navegador tenta a primeira. " +
            "Se não encontrar, tenta a segunda, e assim por diante. É um sistema de fallback " +
            "para garantir que o texto sempre tenha uma fonte aceitável.",
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
