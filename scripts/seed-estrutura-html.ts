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
    const markdownPath = path.join(__dirname, "..", "markdown", "estrutura-basica-html.md");
    const markdownContent = fs.readFileSync(markdownPath, "utf-8");
    console.log("Conteúdo markdown carregado");

    // Calcular próxima ordem
    const lastLesson = await Lesson.findOne({ moduleId: modulo._id }).sort({ order: -1 });
    let nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    // =============================================
    // AULA 1: Teoria - Estrutura Básica HTML
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Estrutura Básica de uma Página HTML",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 2: Exercício Prático
    // =============================================
    console.log("Criando aula de exercício prático...");
    const aulaActivity = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Montando a Estrutura de uma Página HTML",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity._id,
      title: "Montando a Estrutura de uma Página HTML",
      description:
        "Neste exercício você vai montar do zero a estrutura básica de uma página HTML. " +
        "O objetivo é fixar os conceitos de DOCTYPE, html, head, body, meta tags e a " +
        "hierarquia de títulos que você aprendeu na aula teórica. Escreva o código HTML " +
        "completo como se estivesse criando um arquivo index.html.",
      instructions:
        "Crie a estrutura completa de uma página HTML sobre um tema livre (pode ser sobre você, " +
        "sobre um hobby, sobre um lugar que gosta, etc). Sua página deve conter:\n\n" +
        "- A declaração DOCTYPE na primeira linha\n" +
        "- A tag html com o atributo lang em português\n" +
        "- O head com meta charset UTF-8, meta viewport e um title\n" +
        "- O body com pelo menos um título h1, um subtítulo h2, e três parágrafos usando a tag p\n\n" +
        "Escreva o código HTML completo na caixa de texto abaixo.",
    });
    console.log(`Aula de exercício prático criada: ${aulaActivity.title} (ordem ${aulaActivity.order})`);

    // =============================================
    // AULA 3: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Estrutura Básica HTML",
      content: "Teste seus conhecimentos sobre a estrutura básica de uma página HTML.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Qual é a função do <!DOCTYPE html> em uma página HTML?",
          options: [
            "Criar o título da página",
            "Informar ao navegador que o documento segue o padrão HTML5",
            "Definir a linguagem da página",
            "Abrir a tag principal do HTML",
          ],
          correctAnswer: 1,
          explanation:
            "O <!DOCTYPE html> é uma declaração que deve estar na primeira linha do documento. " +
            "Ele informa ao navegador que a página segue o padrão HTML5, garantindo que o conteúdo " +
            "seja interpretado corretamente.",
        },
        {
          question:
            "Onde ficam as informações invisíveis da página, como codificação de caracteres e título da aba?",
          options: [
            "Dentro do <body>",
            "Dentro do <html> diretamente",
            "Dentro do <head>",
            "Antes do <!DOCTYPE html>",
          ],
          correctAnswer: 2,
          explanation:
            "O <head> contém metadados e configurações invisíveis da página, como <meta charset>, " +
            "<meta viewport> e <title>. Nada dentro do <head> aparece diretamente na tela.",
        },
        {
          question:
            'O que acontece se você não incluir <meta charset="UTF-8"> na sua página?',
          options: [
            "A página não abre no navegador",
            "Acentos e caracteres especiais podem aparecer quebrados",
            "O título da aba fica em branco",
            "A página não se adapta ao celular",
          ],
          correctAnswer: 1,
          explanation:
            'O <meta charset="UTF-8"> define a codificação de caracteres. Sem ele, letras acentuadas ' +
            'como "ã", "é" e "ç" podem ser exibidas de forma errada, aparecendo como símbolos estranhos.',
        },
        {
          question: "Qual tag é responsável por exibir o conteúdo visível ao usuário?",
          options: ["<head>", "<html>", "<title>", "<body>"],
          correctAnswer: 3,
          explanation:
            "Tudo que aparece na tela para o usuário — textos, imagens, botões — fica dentro do <body>. " +
            "O <head> contém apenas informações de configuração que não são exibidas diretamente.",
        },
        {
          question: "Qual é a hierarquia correta dos títulos em HTML?",
          options: [
            "<h1> é o menor e <h6> é o maior",
            "<h1> é o título principal e <h6> é o menor subtítulo",
            "Todos os títulos de <h1> a <h6> têm o mesmo tamanho",
            "Só existe <h1> e <h2> em HTML",
          ],
          correctAnswer: 1,
          explanation:
            "Os títulos em HTML vão de <h1> (mais importante e maior) até <h6> (menos importante e menor). " +
            "Eles criam uma hierarquia de conteúdo, como os andares de um prédio.",
        },
        {
          question: "O que a tag <title> define?",
          options: [
            "O título principal exibido dentro da página",
            "O texto que aparece na aba do navegador e nos resultados de busca",
            "O subtítulo da página",
            "O nome do arquivo HTML",
          ],
          correctAnswer: 1,
          explanation:
            "O <title> define o texto que aparece na aba do navegador e é usado pelo Google nos " +
            "resultados de busca. Para exibir um título dentro da página, usa-se <h1>.",
        },
        {
          question:
            'Qual atributo da tag <html> indica que o conteúdo está em português do Brasil?',
          options: [
            'charset="pt-BR"',
            'lang="pt-BR"',
            'language="português"',
            'idioma="BR"',
          ],
          correctAnswer: 1,
          explanation:
            'O atributo lang="pt-BR" na tag <html> informa ao navegador e aos leitores de tela que o ' +
            "conteúdo está em português do Brasil, ajudando na acessibilidade e no SEO.",
        },
        {
          question:
            'Qual é a função do <meta name="viewport" content="width=device-width, initial-scale=1.0">?',
          options: [
            "Definir a codificação de caracteres da página",
            "Garantir que a página se adapte corretamente a telas de celular",
            "Criar um título para a página",
            "Adicionar uma descrição para o Google",
          ],
          correctAnswer: 1,
          explanation:
            "A meta viewport garante que a página se adapte ao tamanho da tela do dispositivo. " +
            "Sem ela, sites abertos no celular aparecem minúsculos, como uma versão encolhida do site de desktop.",
        },
      ],
    });
    console.log(`Aula de quiz criada: ${aulaQuiz.title} (ordem ${aulaQuiz.order})`);

    // Atualizar módulo com as novas aulas
    await Module.findByIdAndUpdate(modulo._id, {
      $push: {
        lessons: { $each: [aulaTeoria._id, aulaActivity._id, aulaQuiz._id] },
      },
    });
    console.log("Módulo atualizado com as novas aulas");

    console.log("\nResumo:");
    console.log(`- Aula de teoria: "${aulaTeoria.title}" (ordem ${aulaTeoria.order})`);
    console.log(`- Exercício prático: "${aulaActivity.title}" (ordem ${aulaActivity.order})`);
    console.log(`- Quiz: "${aulaQuiz.title}" (ordem ${aulaQuiz.order})`);
    console.log(`\nTodas as 3 aulas foram adicionadas ao módulo "${modulo.title}"`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Erro:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
