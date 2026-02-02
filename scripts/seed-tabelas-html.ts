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
    const markdownPath = path.join(__dirname, "..", "markdown", "tabelas-html.md");
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
      title: "Tabelas HTML e Páginas Múltiplas",
      content:
        "Neste vídeo você vai aprender a criar uma segunda página (carrinho) e navegar entre páginas, " +
        "compartilhar estilos entre páginas, criar tabelas com table/tr/td, " +
        "mesclar colunas com colspan e linhas com rowspan, " +
        "e organizar conteúdo com classes reutilizáveis.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160910252",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Tabelas HTML e Páginas Múltiplas",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Carrinho com Tabela
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Página de Carrinho com Tabela",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Página de Carrinho com Tabela",
      description:
        "Neste exercício você vai criar uma página de carrinho de compras " +
        "usando tabelas HTML com colspan para o total.",
      instructions:
        "Crie uma página carrinho.html com um carrinho de compras:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- lang=\"pt-BR\"\n" +
        "- Importe fontes do Google Fonts\n" +
        "- body com margin: 0 e padding-top para o menu fixo\n\n" +
        "**Menu fixo (igual ao da home):**\n" +
        "- position: fixed, top: 0, width: 100%, box-sizing: border-box\n" +
        "- z-index: 10\n" +
        "- Links para home.html e carrinho.html\n\n" +
        "**Área de conteúdo (div com class=\"content\"):**\n" +
        "- padding: 0 20px\n\n" +
        "**Título:**\n" +
        "- h2 com class=\"default-title\" e texto \"Seu Carrinho\"\n" +
        "- .default-title com color: darkgreen e text-align: left\n\n" +
        "**Tabela de produtos:**\n" +
        "- Primeira linha (tr): cabeçalho com Produto, Qtd, Preço Unit., Subtotal\n" +
        "- Pelo menos 3 linhas de produtos com nome, quantidade, preço unitário e subtotal\n" +
        "- Última linha: \"Total\" com colspan=\"3\" e o valor total na última célula\n\n" +
        "**Tabela de frete:**\n" +
        "- h2 com class=\"default-title\" e texto \"Frete\"\n" +
        "- Célula \"Frete\" com rowspan=\"2\"\n" +
        "- Duas linhas: São Paulo R$ 15 e Rio de Janeiro R$ 16\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Tabela de Comparação
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Tabela de Comparação de Produtos",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Tabela de Comparação de Produtos",
      description:
        "Neste exercício você vai criar uma tabela de comparação de produtos " +
        "praticando colspan, rowspan e organização de dados tabulares.",
      instructions:
        "Crie uma página HTML com uma tabela de comparação de planos de assinatura:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- body com margin: 0 e uma fonte do Google Fonts\n\n" +
        "**Conteúdo (div com class=\"content\"):**\n" +
        "- padding: 20px 40px\n\n" +
        "**Título:**\n" +
        "- h1 com texto \"Compare nossos planos\"\n\n" +
        "**Tabela de comparação com 4 colunas:**\n" +
        "- Primeira linha (cabeçalho): \"Recurso\", \"Básico\", \"Pro\", \"Enterprise\"\n" +
        "- Linha: \"Preço\", \"R$ 29/mês\", \"R$ 59/mês\", \"R$ 99/mês\"\n" +
        "- Linha: \"Usuários\", \"1\", \"5\", \"Ilimitado\"\n" +
        "- Linha: \"Armazenamento\", \"10 GB\", \"100 GB\", \"1 TB\"\n" +
        "- Linha com colspan: uma célula \"Suporte\" ocupando colspan=\"1\", seguida de \"Email\" (colspan=\"1\"), \"Chat\" (colspan=\"1\"), \"24/7\" (colspan=\"1\")\n" +
        "- Linha com rowspan: \"Extras\" com rowspan=\"2\" na primeira coluna, " +
        "seguido de \"API\" / \"Sim\" / \"Sim\" na primeira linha e \"App Mobile\" / \"Sim\" / \"Sim\" na segunda\n\n" +
        "**CSS da tabela:**\n" +
        "- width: 100%\n" +
        "- table td com padding: 12px e border-bottom: 1px solid #eee\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Tabelas HTML e Páginas Múltiplas",
      content: "Teste seus conhecimentos sobre tabelas HTML, colspan, rowspan e navegação entre páginas.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Quais são as três tags principais para criar uma tabela em HTML?",
          options: [
            "<table>, <row>, <cell>",
            "<table>, <tr>, <td>",
            "<tab>, <line>, <data>",
            "<grid>, <tr>, <td>",
          ],
          correctAnswer: 1,
          explanation:
            "<table> cria o container da tabela, <tr> (table row) cria uma linha, " +
            "e <td> (table data) cria uma célula de dados. Cada <tr> pode ter múltiplas <td> " +
            "para formar as colunas.",
        },
        {
          question: "O que faz o atributo colspan=\"3\" em uma célula <td>?",
          options: [
            "Cria 3 colunas novas",
            "Faz a célula ocupar 3 colunas, mesclando-as horizontalmente",
            "Adiciona 3 pixels de espaçamento",
            "Repete o conteúdo da célula 3 vezes",
          ],
          correctAnswer: 1,
          explanation:
            "colspan=\"3\" faz uma célula se estender por 3 colunas horizontalmente. " +
            "É usado, por exemplo, para a linha de \"Total\" que precisa ocupar as colunas " +
            "de Produto, Qtd e Preço antes do valor.",
        },
        {
          question: "O que faz o atributo rowspan=\"2\" em uma célula <td>?",
          options: [
            "Cria 2 linhas novas",
            "Faz a célula ocupar 2 linhas, mesclando-as verticalmente",
            "Dobra a altura da célula sem mesclar",
            "Repete a linha 2 vezes",
          ],
          correctAnswer: 1,
          explanation:
            "rowspan=\"2\" faz uma célula se estender por 2 linhas verticalmente. " +
            "Na segunda <tr>, não é necessário incluir uma <td> para a coluna que já está " +
            "sendo ocupada pelo rowspan da linha anterior.",
        },
        {
          question: "Quando usamos rowspan, o que acontece com a <td> correspondente na linha seguinte?",
          options: [
            "Precisamos colocar uma <td> vazia",
            "Não incluímos a <td> — a célula do rowspan já ocupa aquele espaço",
            "Colocamos a mesma <td> duplicada",
            "Usamos <td hidden>",
          ],
          correctAnswer: 1,
          explanation:
            "Quando uma célula tem rowspan=\"2\", ela já ocupa a posição na próxima linha. " +
            "Se incluirmos uma <td> extra na segunda <tr>, a tabela ficará desalinhada. " +
            "A segunda <tr> deve ter uma <td> a menos.",
        },
        {
          question: "Como compartilhar estilos CSS entre duas páginas HTML (home.html e carrinho.html)?",
          options: [
            "Estilos são compartilhados automaticamente entre todas as páginas",
            "Copiar as mesmas tags <link> e <style> no <head> de cada página",
            "Colocar o CSS no <body> de uma página só",
            "Usar a tag <share> no HTML",
          ],
          correctAnswer: 1,
          explanation:
            "Cada página HTML é independente e precisa importar seus próprios estilos no <head>. " +
            "A forma mais simples é copiar as tags <link> (fontes, ícones) e <style> " +
            "para cada página. Com CSS externo (.css), basta linkar o mesmo arquivo.",
        },
        {
          question: "Qual a boa prática para nomear classes CSS?",
          options: [
            "Usar nomes em português, pois é mais fácil de entender",
            "Misturar inglês e português conforme a preferência",
            "Usar uma única língua (preferencialmente inglês) para todas as classes",
            "Usar números em vez de nomes",
          ],
          correctAnswer: 2,
          explanation:
            "A boa prática é usar uma única língua para todas as classes CSS, " +
            "preferencialmente inglês por ser o padrão da indústria. " +
            "Misturar línguas (.conteudo, .product, .desconto) torna o código confuso.",
        },
        {
          question: "O que significa <tr> em uma tabela HTML?",
          options: [
            "Table Reference — referência da tabela",
            "Table Row — uma linha da tabela",
            "Table Right — alinhamento à direita",
            "Table Render — renderização da tabela",
          ],
          correctAnswer: 1,
          explanation:
            "<tr> significa Table Row (linha da tabela). Cada <tr> cria uma nova linha horizontal. " +
            "Dentro de cada <tr>, colocamos <td> (table data) para criar as células/colunas.",
        },
        {
          question: "Para que serve a div com class=\"content\" na página do carrinho?",
          options: [
            "Para criar uma tabela",
            "Para organizar o conteúdo com padding e espaçamento adequados",
            "Para fixar o conteúdo na tela",
            "Para esconder o conteúdo",
          ],
          correctAnswer: 1,
          explanation:
            "A div com class=\"content\" serve como container para o conteúdo da página. " +
            "Com padding: 0 20px, ela cria espaçamento nas laterais para que o conteúdo " +
            "não fique grudado nas bordas, igual ao espaçamento do menu.",
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
