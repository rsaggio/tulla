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
    const markdownPath = path.join(__dirname, "..", "markdown", "bordas-e-arredondamento.md");
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
      title: "Bordas e Arredondamento com CSS",
      content:
        "Neste vídeo você vai aprender a adicionar bordas nas imagens, arredondar cantos " +
        "com border-radius, transformar imagens em círculos e usar object-fit para evitar distorção.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160698361",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Bordas e Arredondamento com CSS",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Bordas
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Trabalhando com Bordas",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Trabalhando com Bordas",
      description:
        "Neste exercício você vai praticar a propriedade border e seus diferentes estilos. " +
        "O objetivo é entender como definir largura, cor e estilo de borda, " +
        "e como usar a forma abreviada.",
      instructions:
        "Crie uma página HTML de uma galeria de produtos com bordas. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head com regras CSS\n" +
        "- Um h1 com o nome da loja\n" +
        "- Pelo menos 3 imagens de produtos (pode usar https://via.placeholder.com/300x200)\n" +
        "- Cada imagem deve ter atributo alt descritivo\n" +
        "- No CSS, aplique bordas nas imagens usando a forma abreviada (border: largura cor estilo)\n" +
        "- Use pelo menos 2 estilos de borda diferentes (solid, dashed, dotted ou double)\n" +
        "- Adicione border-radius de 10px nas imagens para arredondar os cantos\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Imagem circular
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Criando Imagens Circulares",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Criando Imagens Circulares",
      description:
        "Neste exercício você vai criar imagens em formato circular usando " +
        "border-radius e object-fit. O objetivo é entender como transformar " +
        "uma imagem retangular em círculo sem distorcê-la.",
      instructions:
        "Crie uma página HTML de perfis de uma equipe, onde cada membro tem uma foto circular. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head\n" +
        "- Um h1 com \"Nossa Equipe\"\n" +
        "- Pelo menos 3 membros, cada um com:\n" +
        "  - Uma imagem circular (use width e height iguais, border-radius igual ao width, e object-fit: cover)\n" +
        "  - Uma borda colorida na imagem\n" +
        "  - Um h2 com o nome da pessoa\n" +
        "  - Um parágrafo com o cargo\n\n" +
        "Pode usar imagens de placeholder como https://via.placeholder.com/300x300\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Bordas e Arredondamento",
      content: "Teste seus conhecimentos sobre bordas, border-radius e object-fit.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Quais são as três informações necessárias para criar uma borda CSS?",
          options: [
            "Tamanho, posição e cor",
            "Largura, cor e estilo",
            "Altura, peso e formato",
            "Fonte, cor e tamanho",
          ],
          correctAnswer: 1,
          explanation:
            "Para criar uma borda, você precisa definir border-width (largura), " +
            "border-color (cor) e border-style (estilo). Se faltar qualquer um, a borda não aparece.",
        },
        {
          question: "Qual é a forma abreviada correta para criar uma borda sólida preta de 3px?",
          options: [
            "border: solid 3px black;",
            "border: 3px black solid;",
            "border: black solid 3px;",
            "Todas as opções acima funcionam",
          ],
          correctAnswer: 3,
          explanation:
            "A propriedade border aceita os três valores em qualquer ordem. " +
            "Tanto border: 3px black solid quanto border: solid 3px black funcionam.",
        },
        {
          question: "Qual valor de border-style cria uma borda tracejada (com risquinhos)?",
          options: ["dotted", "dashed", "lined", "striped"],
          correctAnswer: 1,
          explanation:
            "O valor dashed cria uma borda tracejada com risquinhos. " +
            "Dotted cria pontinhos, solid cria linha contínua e double cria linha dupla.",
        },
        {
          question: "O que a propriedade border-radius faz?",
          options: [
            "Aumenta a largura da borda",
            "Muda a cor da borda",
            "Arredonda os cantos do elemento",
            "Remove a borda do elemento",
          ],
          correctAnswer: 2,
          explanation:
            "A propriedade border-radius arredonda os cantos de um elemento. " +
            "Quanto maior o valor, mais arredondado fica.",
        },
        {
          question: "Como transformar uma imagem de 200x200 pixels em um círculo?",
          options: [
            "border-radius: 100%;",
            "border-radius: 200px;",
            "border-style: circle;",
            "Tanto A quanto B funcionam",
          ],
          correctAnswer: 3,
          explanation:
            "Para fazer um círculo, o border-radius deve ser pelo menos metade do tamanho " +
            "do elemento. Com 200px de largura/altura, tanto border-radius: 200px " +
            "quanto border-radius: 100% criam um círculo perfeito.",
        },
        {
          question: "O que acontece quando você define width e height diferentes da proporção original da imagem?",
          options: [
            "A imagem mantém a proporção automaticamente",
            "A imagem distorce",
            "A imagem é cortada",
            "O navegador ignora os valores",
          ],
          correctAnswer: 1,
          explanation:
            "Se width e height não respeitam a proporção original, a imagem distorce " +
            "e perde qualidade. Para resolver, use object-fit: cover ou contain.",
        },
        {
          question: "Qual é a diferença entre object-fit: cover e object-fit: contain?",
          options: [
            "Cover distorce e contain não",
            "Cover preenche o espaço cortando o excesso, contain mostra a imagem inteira podendo ter espaço vazio",
            "Contain preenche o espaço e cover mostra a imagem inteira",
            "Não existe diferença entre os dois",
          ],
          correctAnswer: 1,
          explanation:
            "Cover dá zoom na imagem para preencher todo o espaço, cortando o que exceder. " +
            "Contain encolhe a imagem para caber inteira, podendo deixar espaços em branco. " +
            "Nenhum dos dois distorce a imagem.",
        },
        {
          question: "O border-radius funciona apenas em elementos que têm borda visível?",
          options: [
            "Sim, só funciona com border definido",
            "Não, funciona em qualquer elemento mesmo sem borda",
            "Só funciona em imagens",
            "Só funciona em elementos com background",
          ],
          correctAnswer: 1,
          explanation:
            "O border-radius funciona em qualquer elemento, com ou sem borda visível. " +
            "Você pode arredondar cantos de imagens, divs e outros elementos mesmo sem definir border.",
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
