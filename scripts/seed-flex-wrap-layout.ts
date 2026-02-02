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
    const markdownPath = path.join(__dirname, "..", "markdown", "flex-wrap-layout.md");
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
      title: "Flex Wrap, Min-Width e Layout de Seções",
      content:
        "Neste vídeo você vai aprender a ajustar margens e paddings para deixar cartões mais compactos, " +
        "usar classes em vez de seletores de tag genéricos, aplicar min-width para controlar o tamanho mínimo, " +
        "flex-wrap para quebrar linha automaticamente e background-color para criar seções visuais.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160880158",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Flex Wrap, Min-Width e Layout de Seções",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Flex Wrap e Min-Width
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Vitrine com Flex Wrap",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Vitrine com Flex Wrap",
      description:
        "Neste exercício você vai criar uma vitrine de produtos que se organiza " +
        "automaticamente em múltiplas linhas usando flex-wrap, min-width e classes CSS.",
      instructions:
        "Crie uma página HTML de loja com pelo menos 8 produtos que se organizam em linhas:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Uma tag style no head\n" +
        "- body com margin: 0\n\n" +
        "**Container da vitrine (div com id=\"vitrine\"):**\n" +
        "- display: flex\n" +
        "- flex-wrap: wrap\n" +
        "- justify-content: center\n" +
        "- gap: 20px\n" +
        "- padding: 50px\n" +
        "- background-color: #f5f5f5\n\n" +
        "**Cada produto (div com class=\"product\"):**\n" +
        "- width: 250px\n" +
        "- min-width: 250px\n" +
        "- Uma imagem (pode usar https://via.placeholder.com/250x200)\n" +
        "- Um h2 com margin-top: 4px e margin-bottom: 0\n" +
        "- Um parágrafo de preço com margin-top: 4px e margin-bottom: 4px\n" +
        "- Um link com class=\"botao\" e texto \"Comprar\"\n\n" +
        "**Classe .botao:**\n" +
        "- display: flex, justify-content: center, align-items: center\n" +
        "- text-decoration: none\n" +
        "- background-color com uma cor de sua escolha\n" +
        "- color: white, font-weight: bold\n" +
        "- padding-top e padding-bottom de 8px\n" +
        "- border: none, border-radius: 8px\n" +
        "- Adicione um efeito .botao:hover\n\n" +
        "Crie pelo menos 8 produtos para ver o flex-wrap em ação. " +
        "Redimensione a janela do navegador para ver os produtos quebrando de linha.\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Seções com Background
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Página com Seções Coloridas",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Página com Seções Coloridas",
      description:
        "Neste exercício você vai criar uma página com múltiplas seções visuais distintas, " +
        "praticando background-color, ajuste de margens e organização de layout.",
      instructions:
        "Crie uma página de loja completa com 3 seções visuais distintas:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- Importe fontes do Google Fonts (Montserrat para títulos, Open Sans para corpo)\n" +
        "- body com margin: 0 e font-family: \"Open Sans\", sans-serif\n\n" +
        "**Seção 1: Header (div com id=\"header\")**\n" +
        "- background-color: escuro (ex: #333 ou #1a1a2e)\n" +
        "- color: white\n" +
        "- padding: 20px\n" +
        "- text-align: center\n" +
        "- Um h1 com o nome da loja usando font-family: \"Montserrat\"\n\n" +
        "**Seção 2: Vitrine (div com id=\"vitrine\")**\n" +
        "- background-color: #f5f5f5 (cinza claro)\n" +
        "- display: flex, flex-wrap: wrap, justify-content: center, gap: 20px\n" +
        "- padding: 40px\n" +
        "- Pelo menos 6 produtos com class=\"product\" (width e min-width: 220px)\n" +
        "- Cada produto com: imagem, h2 (margens ajustadas), preço e botão compacto\n\n" +
        "**Seção 3: Footer (div com id=\"footer\")**\n" +
        "- background-color: escuro (igual ao header)\n" +
        "- color: white\n" +
        "- padding: 20px\n" +
        "- text-align: center\n" +
        "- Um parágrafo com \"© 2025 Nome da Loja\"\n\n" +
        "A página deve ter contraste visual claro entre as seções.\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Flex Wrap, Min-Width e Layout",
      content: "Teste seus conhecimentos sobre flex-wrap, min-width, ajustes de margem e background-color.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "O que acontece quando os itens de um flex container ultrapassam a largura do container sem flex-wrap?",
          options: [
            "Os itens caem para a próxima linha automaticamente",
            "Os itens são espremidos ou criam uma barra de rolagem horizontal",
            "Os itens desaparecem",
            "O container cresce automaticamente",
          ],
          correctAnswer: 1,
          explanation:
            "Por padrão, flex-wrap é nowrap — o Flexbox tenta colocar todos os itens na mesma linha, " +
            "espremendo-os ou criando scroll horizontal. Para quebrar linha, precisamos de flex-wrap: wrap.",
        },
        {
          question: "Qual propriedade faz os itens quebrarem para a próxima linha quando não cabem?",
          options: [
            "flex-direction: wrap",
            "flex-wrap: wrap",
            "flex-break: line",
            "justify-content: wrap",
          ],
          correctAnswer: 1,
          explanation:
            "flex-wrap: wrap faz os itens quebrarem para a próxima linha quando não cabem " +
            "na largura do container. O valor padrão é nowrap (tudo na mesma linha).",
        },
        {
          question: "Para que serve a propriedade min-width?",
          options: [
            "Define a largura exata do elemento",
            "Define a largura máxima do elemento",
            "Define a largura mínima — o elemento nunca ficará menor que esse valor",
            "Define a largura da margem",
          ],
          correctAnswer: 2,
          explanation:
            "min-width define o tamanho mínimo que um elemento pode ter. Mesmo que o Flexbox " +
            "tente encolher o item, ele nunca ficará menor que o min-width definido.",
        },
        {
          question: "Por que devemos usar classes (.product) em vez de seletores de tag (div) para estilizar cartões?",
          options: [
            "Porque seletores de tag são mais lentos",
            "Porque seletores de tag afetam TODOS os elementos daquele tipo, podendo quebrar outros layouts",
            "Porque classes não funcionam em divs",
            "Porque seletores de tag não aceitam width",
          ],
          correctAnswer: 1,
          explanation:
            "Estilizar a tag div diretamente afeta todas as divs da página. Se você adicionar uma nova div " +
            "para outro propósito, ela herdará os estilos indesejados. Com classes, você aplica estilos " +
            "apenas nos elementos específicos.",
        },
        {
          question: "Qual a diferença entre margin: 4px e margin-top: 4px?",
          options: [
            "Não há diferença",
            "margin: 4px aplica em todos os lados; margin-top: 4px aplica só no topo",
            "margin: 4px aplica só no topo; margin-top: 4px aplica em todos os lados",
            "margin-top não existe, só margin",
          ],
          correctAnswer: 1,
          explanation:
            "margin: 4px é um atalho que aplica 4px em todos os lados (top, right, bottom, left). " +
            "margin-top: 4px aplica margem apenas no topo. Use as propriedades específicas " +
            "quando quiser controlar cada lado individualmente.",
        },
        {
          question: "Como mudar a cor de fundo de uma seção da página?",
          options: [
            "color: #f5f5f5",
            "background-color: #f5f5f5",
            "font-color: #f5f5f5",
            "fill-color: #f5f5f5",
          ],
          correctAnswer: 1,
          explanation:
            "background-color define a cor de fundo de qualquer elemento. " +
            "A propriedade color muda a cor do texto, não do fundo. " +
            "Pode usar nomes de cores (brown, green) ou valores hexadecimais (#f5f5f5).",
        },
        {
          question: "Para que serve adicionar uma borda temporária em um elemento durante o desenvolvimento?",
          options: [
            "Para deixar o site mais bonito",
            "Para visualizar onde o elemento começa e termina, ajudando no debug do layout",
            "Para aumentar o tamanho do elemento",
            "Para mudar a cor de fundo",
          ],
          correctAnswer: 1,
          explanation:
            "Adicionar border: 1px solid red temporariamente é uma técnica de debug. " +
            "Ajuda a visualizar os limites do elemento, entender espaçamentos e identificar " +
            "problemas de layout. Depois de resolver, removemos a borda.",
        },
        {
          question: "Quais são os três valores que uma borda precisa ter?",
          options: [
            "Cor, tamanho da fonte e margem",
            "Tamanho (width), estilo (style) e cor (color)",
            "Display, position e float",
            "Padding, margin e width",
          ],
          correctAnswer: 1,
          explanation:
            "Uma borda precisa de três valores: tamanho (border-width: 1px), " +
            "estilo (border-style: solid) e cor (border-color: red). " +
            "Ou na forma resumida: border: 1px solid red.",
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
