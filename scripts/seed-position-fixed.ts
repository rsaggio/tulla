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
    const markdownPath = path.join(__dirname, "..", "markdown", "position-fixed.md");
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
      title: "Position Fixed — Menu Fixo e Botão Flutuante",
      content:
        "Neste vídeo você vai aprender sobre a propriedade position, " +
        "como criar um menu fixo no topo com position: fixed, " +
        "compensar o espaço com padding-top no body, " +
        "usar top/bottom/left/right para posicionar elementos, " +
        "e criar um botão flutuante circular de suporte.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160898552",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Position Fixed — Menu Fixo e Botão Flutuante",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Menu Fixo
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Menu Fixo no Topo",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Menu Fixo no Topo",
      description:
        "Neste exercício você vai criar uma página com menu fixo no topo " +
        "que permanece visível ao rolar a página, compensando o espaço com padding-top.",
      instructions:
        "Crie uma página HTML com um menu fixo e conteúdo suficiente para rolar:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Importe fontes do Google Fonts\n" +
        "- body com margin: 0 e padding-top para compensar a altura do menu\n\n" +
        "**Menu (div com class=\"menu\"):**\n" +
        "- position: fixed\n" +
        "- top: 0\n" +
        "- width: 100%\n" +
        "- display: flex\n" +
        "- justify-content: space-between\n" +
        "- align-items: center\n" +
        "- padding: 15px 30px\n" +
        "- background-color: white\n" +
        "- box-sizing: border-box\n" +
        "- Dentro do menu: um h2 com o nome da loja e 3 links de navegação (Home, Produtos, Contato)\n\n" +
        "**Banner (div com class=\"banner\"):**\n" +
        "- height: 70vh\n" +
        "- Imagem de fundo com gradiente por cima\n" +
        "- Um h1 centralizado\n\n" +
        "**Vitrine (div com id=\"vitrine\"):**\n" +
        "- display: flex, flex-wrap: wrap, justify-content: center, gap: 20px\n" +
        "- Pelo menos 8 produtos (para gerar scroll)\n\n" +
        "**Teste:** role a página e confirme que o menu permanece fixo no topo.\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Botão Flutuante
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Botão Flutuante de Suporte",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Botão Flutuante de Suporte",
      description:
        "Neste exercício você vai criar um botão flutuante circular " +
        "fixo no canto da tela, como os botões de WhatsApp/suporte comuns em sites.",
      instructions:
        "Crie uma página HTML com um botão flutuante de suporte:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Importe o Google Material Symbols para os ícones\n" +
        "- body com margin: 0\n\n" +
        "**Botão de suporte (link <a> com class=\"support-button\"):**\n" +
        "- href apontando para um link do WhatsApp (ex: https://wa.me/5511999999999)\n" +
        "- Dentro: um ícone do Material Symbols (phone ou chat)\n" +
        "- position: fixed\n" +
        "- bottom: 24px\n" +
        "- right: 24px (canto inferior direito)\n" +
        "- width: 64px e height: 64px\n" +
        "- background-color: #25D366 (cor do WhatsApp) ou darkgreen\n" +
        "- color: white\n" +
        "- border-radius: 50% (transforma em círculo)\n" +
        "- display: flex, justify-content: center, align-items: center\n" +
        "- text-decoration: none\n" +
        "- font-size: 32px (tamanho do ícone)\n" +
        "- Adicione um efeito :hover que muda a cor\n\n" +
        "**Conteúdo da página:**\n" +
        "- Crie conteúdo suficiente para rolar (banner + vitrine com vários produtos)\n" +
        "- Confirme que o botão permanece fixo ao rolar\n\n" +
        "**Desafio extra:** crie um segundo botão fixo no canto inferior esquerdo " +
        "com um ícone diferente (ex: arrow_upward para voltar ao topo).\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Position Fixed e Posicionamento",
      content: "Teste seus conhecimentos sobre position fixed, top/bottom/left/right e elementos flutuantes.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "O que acontece quando definimos position: fixed em um elemento?",
          options: [
            "O elemento fica escondido",
            "O elemento sai do fluxo normal e fica fixo na tela, mesmo ao rolar",
            "O elemento fica maior",
            "O elemento muda de cor",
          ],
          correctAnswer: 1,
          explanation:
            "position: fixed faz o elemento sair do fluxo normal do HTML e ficar fixo na tela. " +
            "Ele permanece visível na mesma posição mesmo quando o usuário rola a página. " +
            "É como se ficasse em uma camada superior, flutuando.",
        },
        {
          question: "Por que um menu fixo precisa de width: 100%?",
          options: [
            "Porque position: fixed muda a cor do elemento",
            "Porque position: fixed faz o elemento ocupar apenas o tamanho necessário para seus filhos",
            "Porque o menu não aparece sem width",
            "Porque 100% é obrigatório em qualquer elemento",
          ],
          correctAnswer: 1,
          explanation:
            "Quando um elemento tem position: fixed, ele sai do fluxo e perde a referência de largura. " +
            "Por padrão, ele ocupa apenas o espaço mínimo necessário para caber seus filhos. " +
            "width: 100% força o menu a ocupar toda a largura da tela.",
        },
        {
          question: "Para que serve o padding-top no body quando temos um menu fixo?",
          options: [
            "Para aumentar o tamanho do menu",
            "Para empurrar o conteúdo para baixo e evitar que fique escondido atrás do menu",
            "Para mudar a cor de fundo",
            "Para centralizar o conteúdo",
          ],
          correctAnswer: 1,
          explanation:
            "O menu fixo sai do fluxo e flutua sobre o conteúdo. Sem padding-top, " +
            "o conteúdo (banner, produtos) fica escondido atrás do menu. " +
            "O padding-top no body empurra todo o conteúdo para baixo, compensando a altura do menu.",
        },
        {
          question: "Qual propriedade posiciona um elemento fixo no topo da tela?",
          options: [
            "margin-top: 0",
            "top: 0",
            "position-top: 0",
            "align-top: 0",
          ],
          correctAnswer: 1,
          explanation:
            "A propriedade top: 0 gruda o elemento no topo da tela. " +
            "Ela só funciona quando position é fixed, absolute, relative ou sticky. " +
            "Com position: static (padrão), top não tem efeito.",
        },
        {
          question: "Como transformar um quadrado em um círculo perfeito com CSS?",
          options: [
            "border-radius: 100px",
            "border-radius: 50% em um elemento com mesma largura e altura",
            "border-style: circle",
            "display: circle",
          ],
          correctAnswer: 1,
          explanation:
            "border-radius: 50% aplicado em um elemento quadrado (mesma width e height) " +
            "cria um círculo perfeito. Por exemplo, width: 64px + height: 64px + border-radius: 50% " +
            "resulta em um círculo de 64px de diâmetro.",
        },
        {
          question: "Qual a diferença entre position: static e position: fixed?",
          options: [
            "static é mais rápido que fixed",
            "static segue o fluxo normal; fixed fica fixo na tela e sai do fluxo",
            "static não aceita CSS; fixed aceita",
            "Não há diferença prática",
          ],
          correctAnswer: 1,
          explanation:
            "position: static (padrão) mantém o elemento no fluxo normal — ele se posiciona " +
            "conforme a ordem do HTML e as margens/paddings. position: fixed tira o elemento " +
            "do fluxo e o fixa na tela, permitindo usar top/bottom/left/right.",
        },
        {
          question: "Para criar um botão flutuante no canto inferior direito, quais propriedades usamos?",
          options: [
            "position: fixed, bottom: 24px, right: 24px",
            "position: static, margin-bottom: 24px",
            "float: right, bottom: 24px",
            "display: fixed, bottom: 24px",
          ],
          correctAnswer: 0,
          explanation:
            "position: fixed faz o elemento ficar fixo na tela. bottom: 24px posiciona " +
            "a 24px da parte de baixo, e right: 24px posiciona a 24px da direita. " +
            "Juntos, criam um botão flutuante no canto inferior direito.",
        },
        {
          question: "Por que usamos display: flex no botão circular em vez de display: block?",
          options: [
            "block não funciona com position: fixed",
            "block permite definir largura/altura, mas flex também centraliza o ícone dentro do botão",
            "flex deixa o botão mais bonito automaticamente",
            "Não há diferença entre block e flex nesse caso",
          ],
          correctAnswer: 1,
          explanation:
            "Tanto display: block quanto display: flex permitem definir largura e altura. " +
            "A vantagem do flex é que, com justify-content: center e align-items: center, " +
            "o ícone fica perfeitamente centralizado dentro do círculo — algo que block não faz sozinho.",
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
