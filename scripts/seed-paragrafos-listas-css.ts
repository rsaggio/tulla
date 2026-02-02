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
    const markdownPath = path.join(__dirname, "..", "markdown", "paragrafos-listas-css.md");
    const markdownContent = fs.readFileSync(markdownPath, "utf-8");
    console.log("Conteúdo markdown carregado");

    // Calcular próxima ordem
    const lastLesson = await Lesson.findOne({ moduleId: modulo._id }).sort({ order: -1 });
    let nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    // =============================================
    // AULA 1: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Parágrafos, Listas e Introdução ao CSS",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 2: Exercício Prático 1 - Listas
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Organizando Informações com Listas",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Organizando Informações com Listas",
      description:
        "Neste exercício você vai praticar o uso de parágrafos e listas em HTML. " +
        "O objetivo é saber quando usar cada tipo de lista e como combinar " +
        "parágrafos com listas para organizar informações de forma clara.",
      instructions:
        "Crie uma página HTML sobre uma receita de comida (pode ser qualquer receita). " +
        "Sua página deve conter:\n\n" +
        "- Um título h1 com o nome da receita\n" +
        "- Um parágrafo descrevendo brevemente o prato\n" +
        "- Um subtítulo h2 \"Ingredientes\" seguido de uma lista NÃO ordenada (ul) com pelo menos 5 ingredientes\n" +
        "- Um subtítulo h2 \"Modo de Preparo\" seguido de uma lista ORDENADA (ol) com pelo menos 4 passos\n" +
        "- Um subtítulo h2 \"Dicas\" seguido de um parágrafo com uma dica sobre a receita\n\n" +
        "Escreva o código HTML completo (incluindo DOCTYPE, html, head e body).",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 3: Exercício Prático 2 - CSS
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Estilizando uma Página com CSS",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Estilizando uma Página com CSS",
      description:
        "Neste exercício você vai praticar CSS básico. O objetivo é aprender a usar " +
        "a tag style no head para mudar a aparência dos elementos HTML, " +
        "trabalhando com as propriedades color e font-size.",
      instructions:
        "Crie uma página HTML de currículo pessoal (pode ser fictício) com CSS. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style dentro do head com pelo menos 3 regras CSS diferentes\n" +
        "- O h1 com seu nome deve ter uma cor diferente do preto padrão\n" +
        "- Os parágrafos devem ter font-size de 14px\n" +
        "- Os h2 devem ter uma cor diferente do h1\n" +
        "- O body deve conter: nome (h1), informações pessoais (p), seção \"Sobre\" (h2 + p) " +
        "e seção \"Habilidades\" (h2 + lista ul com li)\n\n" +
        "Escreva o código HTML completo com o CSS dentro da tag style.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 4: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Parágrafos, Listas e CSS",
      content: "Teste seus conhecimentos sobre parágrafos, listas HTML e CSS básico.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Qual tag é usada para criar um parágrafo de texto em HTML?",
          options: ["<t>", "<text>", "<p>", "<par>"],
          correctAnswer: 2,
          explanation:
            "A tag <p> (de paragraph) é usada para criar parágrafos de texto. " +
            "O navegador automaticamente adiciona um espaço entre parágrafos.",
        },
        {
          question: "Qual é a diferença entre <ul> e <ol>?",
          options: [
            "<ul> cria tabelas e <ol> cria listas",
            "<ul> cria lista com bolinhas e <ol> cria lista numerada",
            "<ul> cria lista numerada e <ol> cria lista com bolinhas",
            "Não existe diferença, são a mesma coisa",
          ],
          correctAnswer: 1,
          explanation:
            "<ul> (unordered list) cria uma lista não ordenada com bolinhas. " +
            "<ol> (ordered list) cria uma lista ordenada com números. " +
            "Use <ul> quando a ordem não importa e <ol> quando importa.",
        },
        {
          question: "Qual tag representa um item dentro de uma lista?",
          options: ["<item>", "<li>", "<it>", "<list>"],
          correctAnswer: 1,
          explanation:
            "A tag <li> (list item) representa cada item dentro de uma lista, " +
            "tanto para <ul> quanto para <ol>.",
        },
        {
          question: "Onde a tag <style> deve ser colocada para estilizar a página?",
          options: [
            "Dentro do <body>",
            "Depois do </html>",
            "Dentro do <head>",
            "Dentro de um <p>",
          ],
          correctAnswer: 2,
          explanation:
            "A tag <style> deve ficar dentro do <head>. O estilo é uma informação " +
            "sobre como o corpo deve ser exibido, por isso fica na cabeça da página.",
        },
        {
          question: "Qual propriedade CSS altera a cor do texto?",
          options: ["font-color", "text-color", "color", "background"],
          correctAnswer: 2,
          explanation:
            "A propriedade 'color' altera a cor do texto. Você pode usar nomes de " +
            "cores em inglês (blue, red) ou códigos hexadecimais (#1a5276).",
        },
        {
          question: "Qual propriedade CSS altera o tamanho do texto?",
          options: ["text-size", "font-size", "size", "font-width"],
          correctAnswer: 1,
          explanation:
            "A propriedade 'font-size' altera o tamanho do texto. " +
            "O valor é definido em pixels (px), como font-size: 14px.",
        },
        {
          question:
            "Como aplicar o mesmo estilo CSS para parágrafos e itens de lista ao mesmo tempo?",
          options: [
            "p + li { font-size: 14px; }",
            "p li { font-size: 14px; }",
            "p, li { font-size: 14px; }",
            "p & li { font-size: 14px; }",
          ],
          correctAnswer: 2,
          explanation:
            "Para aplicar o mesmo estilo a múltiplas tags, separe-as com vírgula. " +
            "p, li { } aplica a regra tanto para <p> quanto para <li>.",
        },
        {
          question: "Qual das opções abaixo é a estrutura correta de uma regra CSS?",
          options: [
            "tag [ propriedade = valor ]",
            "tag { propriedade: valor; }",
            "tag ( propriedade - valor )",
            "<tag> propriedade: valor </tag>",
          ],
          correctAnswer: 1,
          explanation:
            "A estrutura do CSS é: seletor { propriedade: valor; }. " +
            "Usa-se chaves { } para abrir o bloco, dois-pontos : para separar " +
            "propriedade de valor, e ponto e vírgula ; no final de cada regra.",
        },
      ],
    });
    console.log(`Aula de quiz criada: ${aulaQuiz.title} (ordem ${aulaQuiz.order})`);

    // Atualizar módulo com as novas aulas
    await Module.findByIdAndUpdate(modulo._id, {
      $push: {
        lessons: {
          $each: [aulaTeoria._id, aulaActivity1._id, aulaActivity2._id, aulaQuiz._id],
        },
      },
    });
    console.log("Módulo atualizado com as novas aulas");

    console.log("\nResumo:");
    console.log(`- Teoria: "${aulaTeoria.title}" (ordem ${aulaTeoria.order})`);
    console.log(`- Exercício 1: "${aulaActivity1.title}" (ordem ${aulaActivity1.order})`);
    console.log(`- Exercício 2: "${aulaActivity2.title}" (ordem ${aulaActivity2.order})`);
    console.log(`- Quiz: "${aulaQuiz.title}" (ordem ${aulaQuiz.order})`);
    console.log(`\nTodas as 4 aulas foram adicionadas ao módulo "${modulo.title}"`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Erro:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
