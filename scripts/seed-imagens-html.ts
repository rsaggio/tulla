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
    const markdownPath = path.join(__dirname, "..", "markdown", "imagens-no-html.md");
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
      title: "Imagens no HTML",
      content:
        "Neste vídeo você vai aprender a adicionar imagens na sua página usando a tag img, " +
        "entender atributos como src e alt, controlar o tamanho com CSS e a diferença entre " +
        "imagens externas e locais.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160697798",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Imagens no HTML",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Tag img e atributos
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Adicionando Imagens a uma Página",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Adicionando Imagens a uma Página",
      description:
        "Neste exercício você vai praticar o uso da tag img com seus atributos " +
        "obrigatórios src e alt. O objetivo é entender como adicionar imagens, " +
        "escrever textos alternativos descritivos e organizar o conteúdo com imagens e texto.",
      instructions:
        "Crie uma página HTML de um cardápio de restaurante com imagens dos pratos. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Um h1 com o nome do restaurante\n" +
        "- Pelo menos 3 pratos, cada um com:\n" +
        "  - Um h2 com o nome do prato\n" +
        "  - Uma tag img com src apontando para uma imagem (pode usar URLs de imagens públicas " +
        "como https://via.placeholder.com/300x200 ou qualquer URL de imagem)\n" +
        "  - Um atributo alt descritivo em cada imagem (descreva o que a imagem mostra)\n" +
        "  - Um parágrafo com a descrição e preço do prato\n\n" +
        "Escreva o código HTML completo.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - CSS para imagens
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Estilizando Imagens com CSS",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Estilizando Imagens com CSS",
      description:
        "Neste exercício você vai praticar o controle visual de imagens usando CSS. " +
        "O objetivo é aprender a definir largura, usar opacity e entender por que " +
        "devemos controlar o tamanho das imagens via CSS e não via atributos HTML.",
      instructions:
        "Crie uma página HTML de uma galeria de fotos com CSS. " +
        "Sua página deve conter:\n\n" +
        "- A estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head com regras CSS para as imagens\n" +
        "- Um h1 com o título da galeria\n" +
        "- Pelo menos 3 imagens usando a tag img (pode usar URLs de placeholder como " +
        "https://via.placeholder.com/600x400)\n" +
        "- Cada imagem deve ter um alt descritivo\n" +
        "- No CSS, defina width para as imagens (NÃO use o atributo width no HTML)\n" +
        "- Aplique opacity em pelo menos uma imagem para demonstrar transparência\n" +
        "- Adicione estilo nos títulos (color e font-size)\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Imagens no HTML",
      content: "Teste seus conhecimentos sobre imagens no HTML e estilização com CSS.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Qual tag HTML é usada para adicionar uma imagem na página?",
          options: ["<image>", "<foto>", "<img>", "<picture>"],
          correctAnswer: 2,
          explanation:
            "A tag <img> (abreviação de image) é usada para adicionar imagens. " +
            "Ela é auto-fechante — não precisa de tag de fechamento.",
        },
        {
          question: "Qual atributo da tag img indica onde a imagem está?",
          options: ["href", "src", "url", "link"],
          correctAnswer: 1,
          explanation:
            "O atributo src (source) indica o caminho ou URL onde a imagem se encontra. " +
            "Pode ser uma URL da internet ou um caminho de arquivo local.",
        },
        {
          question: "Para que serve o atributo alt na tag img?",
          options: [
            "Para definir o tamanho da imagem",
            "Para adicionar uma borda na imagem",
            "Para fornecer um texto alternativo para acessibilidade e SEO",
            "Para definir a cor de fundo da imagem",
          ],
          correctAnswer: 2,
          explanation:
            "O atributo alt fornece um texto alternativo que é lido por leitores de tela " +
            "(acessibilidade) e usado pelo Google para entender a imagem (SEO). " +
            "Se a imagem quebrar, o texto do alt aparece no lugar.",
        },
        {
          question: "O que acontece se você definir width e height com valores desproporcionais na imagem?",
          options: [
            "A imagem fica com melhor qualidade",
            "A imagem é cortada automaticamente",
            "A imagem distorce e perde qualidade",
            "Nada acontece, os valores são ignorados",
          ],
          correctAnswer: 2,
          explanation:
            "Se você forçar largura e altura com valores que não respeitam a proporção original, " +
            "a imagem distorce. A boa prática é definir apenas a largura (width) e " +
            "deixar a altura ser calculada automaticamente.",
        },
        {
          question: "Qual é a forma recomendada de controlar o tamanho de uma imagem?",
          options: [
            "Usando os atributos width e height no HTML",
            "Usando CSS com a propriedade width",
            "Redimensionando a imagem num editor de fotos",
            "Não é possível controlar o tamanho",
          ],
          correctAnswer: 1,
          explanation:
            "A forma recomendada é usar CSS. O HTML cuida do conteúdo e o CSS cuida da aparência. " +
            "Defina width no CSS e deixe a altura se ajustar automaticamente.",
        },
        {
          question: "O que a propriedade CSS opacity controla?",
          options: [
            "O tamanho da imagem",
            "A cor da imagem",
            "A transparência do elemento",
            "A posição da imagem na página",
          ],
          correctAnswer: 2,
          explanation:
            "A propriedade opacity controla a transparência. O valor vai de 0 (totalmente invisível) " +
            "até 1 (totalmente visível). Com opacity: 0.5, o elemento fica 50% transparente.",
        },
        {
          question: "Por que é melhor usar imagens locais (salvas no projeto) do que URLs externas?",
          options: [
            "Imagens locais carregam mais devagar",
            "Imagens locais são sempre maiores",
            "Se o site externo sair do ar, a imagem quebra",
            "URLs externas não funcionam no navegador",
          ],
          correctAnswer: 2,
          explanation:
            "Se você usa a URL de uma imagem de outro site e esse site sai do ar, " +
            "a imagem quebra na sua página. Com imagens locais, você tem controle total " +
            "e a imagem nunca vai quebrar por causa de terceiros.",
        },
        {
          question: "O que são atributos em uma tag HTML?",
          options: [
            "Tags que ficam dentro de outras tags",
            "Configurações extras escritas dentro da tag de abertura",
            "Estilos CSS aplicados automaticamente",
            "Comentários que explicam o código",
          ],
          correctAnswer: 1,
          explanation:
            "Atributos são configurações extras que ficam dentro da tag de abertura. " +
            'Eles seguem o formato atributo="valor". Por exemplo, src e alt são ' +
            "atributos da tag img.",
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
