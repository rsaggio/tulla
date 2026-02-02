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
    const markdownPath = path.join(__dirname, "..", "markdown", "estilizando-tabelas.md");
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
      title: "Estilizando Tabelas — thead, tbody, tfoot e nth-child",
      content:
        "Neste vídeo você vai aprender a dividir tabelas com thead, tbody e tfoot, " +
        "estilizar o cabeçalho com cores e negrito, usar border-collapse para grudar bordas, " +
        "alinhar colunas específicas com nth-child, entender especificidade CSS (id vs classe vs !important) " +
        "e criar classes utilitárias reutilizáveis.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160915252",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Estilizando Tabelas — thead, tbody, tfoot e nth-child",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Tabela Estilizada
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Tabela de Carrinho Estilizada",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Tabela de Carrinho Estilizada",
      description:
        "Neste exercício você vai criar uma tabela de carrinho de compras estilizada " +
        "com thead, tbody, tfoot, cabeçalho colorido, border-collapse e alinhamento por coluna.",
      instructions:
        "Crie uma página HTML com uma tabela de carrinho estilizada:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- lang=\"pt-BR\"\n" +
        "- Importe fontes do Google Fonts\n" +
        "- body com margin: 0\n\n" +
        "**Área de conteúdo (div com class=\"content\"):**\n" +
        "- display: flex, flex-direction: column, align-items: center\n" +
        "- padding: 0 20px\n\n" +
        "**Título:**\n" +
        "- h2 com class=\"default-title\" e texto \"Seu Carrinho\"\n" +
        "- .default-title com color: darkgreen e text-align: center\n\n" +
        "**Tabela com estrutura semântica:**\n" +
        "- Divida a tabela em <thead>, <tbody> e <tfoot>\n" +
        "- table com width: 100%, border-collapse: collapse, border: 1px solid #ddd, margin: 16px 0\n" +
        "- table td com padding: 8px\n\n" +
        "**Cabeçalho (thead):**\n" +
        "- background-color: green, color: white, font-weight: bold\n" +
        "- Colunas: Produto, Qtd, Preço Unit., Subtotal\n\n" +
        "**Corpo (tbody):**\n" +
        "- Pelo menos 3 produtos com nome, quantidade, preço unitário e subtotal\n\n" +
        "**Rodapé (tfoot):**\n" +
        "- \"Total\" com colspan=\"3\" e o valor total\n\n" +
        "**Alinhamento por coluna:**\n" +
        "- Use td:nth-child(2) para centralizar a coluna Qtd (tanto no thead quanto no tbody)\n" +
        "- Use td:nth-child(4) para alinhar à direita a coluna Subtotal\n\n" +
        "**Botão:**\n" +
        "- Link com class=\"button w-200\" e texto \"Finalizar Compra\"\n" +
        "- .button com background-color: darkgreen, color: white, padding: 12px, border-radius: 8px, text-align: center, text-decoration: none\n" +
        "- .w-200 com width: 200px\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Tabela de Notas com Alinhamento
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Tabela de Notas com nth-child e Especificidade",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Tabela de Notas com nth-child e Especificidade",
      description:
        "Neste exercício você vai criar uma tabela de notas de alunos " +
        "praticando nth-child para alinhamento, especificidade CSS e classes utilitárias.",
      instructions:
        "Crie uma página HTML com uma tabela de notas de alunos:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- body com margin: 0 e uma fonte do Google Fonts\n\n" +
        "**Conteúdo (div com class=\"content\"):**\n" +
        "- display: flex, flex-direction: column, align-items: center\n" +
        "- padding: 20px 40px\n\n" +
        "**Título:**\n" +
        "- h1 com texto \"Boletim Escolar\"\n\n" +
        "**Tabela com thead, tbody e tfoot:**\n" +
        "- Cabeçalho: Disciplina, Nota 1, Nota 2, Média\n" +
        "- thead com background-color: #2196F3 (azul), color: white, font-weight: bold\n" +
        "- Pelo menos 4 disciplinas com duas notas e a média\n" +
        "- tfoot com uma linha \"Média Geral\" usando colspan=\"3\" e a média geral\n" +
        "- table com border-collapse: collapse, border: 1px solid #ddd, margin: 16px 0\n" +
        "- table td com padding: 10px\n\n" +
        "**Alinhamento com nth-child:**\n" +
        "- Colunas 2, 3 e 4 (notas e média) centralizadas usando td:nth-child(2), td:nth-child(3), td:nth-child(4)\n" +
        "- Aplique o mesmo alinhamento no thead e no tbody (use vírgula para agrupar seletores)\n\n" +
        "**Seção \"Avisos\" com id e classe:**\n" +
        "- Crie uma div com id=\"notices\" e background-color: #fff3cd\n" +
        "- Adicione também a classe .no-background com background-color: transparent !important\n" +
        "- Observe que !important sobrescreve o id\n" +
        "- Depois remova a classe .no-background para ver o fundo amarelo aparecer\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Estilizando Tabelas e Especificidade CSS",
      content: "Teste seus conhecimentos sobre thead/tbody/tfoot, border-collapse, nth-child e especificidade CSS.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Quais são as três tags semânticas para dividir uma tabela HTML?",
          options: [
            "<header>, <body>, <footer>",
            "<thead>, <tbody>, <tfoot>",
            "<head>, <main>, <foot>",
            "<th>, <tb>, <tf>",
          ],
          correctAnswer: 1,
          explanation:
            "<thead> (table head) define o cabeçalho, <tbody> (table body) define o corpo com os dados, " +
            "e <tfoot> (table foot) define o rodapé. Visualmente não muda nada, mas melhora a semântica " +
            "e permite estilizar cada parte separadamente.",
        },
        {
          question: "O que faz a propriedade border-collapse: collapse em uma tabela?",
          options: [
            "Remove todas as bordas da tabela",
            "Gruda as bordas das células, eliminando o espaço entre elas",
            "Dobra a espessura das bordas",
            "Esconde as bordas internas e mostra só as externas",
          ],
          correctAnswer: 1,
          explanation:
            "Por padrão, cada célula tem sua própria borda separada com um espaço de 1px entre elas. " +
            "border-collapse: collapse faz as bordas se fundirem, eliminando esse espaço " +
            "e criando uma tabela visualmente mais limpa.",
        },
        {
          question: "Como selecionar apenas a segunda coluna de uma tabela com CSS?",
          options: [
            "td.second",
            "td:nth-child(2)",
            "td:column(2)",
            "td[col=2]",
          ],
          correctAnswer: 1,
          explanation:
            "O pseudo-seletor :nth-child(2) seleciona o segundo filho. " +
            "Aplicado em td, seleciona a segunda célula de cada linha, " +
            "ou seja, a segunda coluna. Para a terceira coluna seria td:nth-child(3), e assim por diante.",
        },
        {
          question: "Qual é a ordem de especificidade CSS, do mais fraco ao mais forte?",
          options: [
            "classe → tag → id → !important",
            "tag → classe → id → !important",
            "id → classe → tag → !important",
            "tag → id → classe → !important",
          ],
          correctAnswer: 1,
          explanation:
            "A especificidade CSS segue esta ordem: tag (td, div) é a mais fraca, " +
            "classe (.content) é média, id (#products) é forte, e !important é a máxima. " +
            "Quando há conflito, o seletor mais específico vence.",
        },
        {
          question: "Por que a classe .no-background não sobrescreve o background-color de um #id sem !important?",
          options: [
            "Porque classes não aceitam background-color",
            "Porque o id tem especificidade maior que a classe",
            "Porque o navegador ignora classes quando há id",
            "Porque background-color só funciona com id",
          ],
          correctAnswer: 1,
          explanation:
            "Na hierarquia de especificidade, o id (#products) é mais forte que a classe (.no-background). " +
            "Quando ambos definem a mesma propriedade, o id vence. " +
            "Para a classe ganhar, precisamos adicionar !important ao valor.",
        },
        {
          question: "O que é uma classe utilitária no CSS?",
          options: [
            "Uma classe que só funciona em elementos <div>",
            "Uma classe genérica e reutilizável que faz uma coisa só (ex: .w-200)",
            "Uma classe obrigatória em todo elemento HTML",
            "Uma classe que o navegador cria automaticamente",
          ],
          correctAnswer: 1,
          explanation:
            "Classes utilitárias são classes genéricas que fazem uma coisa específica e podem ser " +
            "reutilizadas em qualquer elemento. Exemplos: .w-200 (largura 200px), .no-background " +
            "(fundo transparente). Elas permitem combinar estilos sem criar CSS específico para cada elemento.",
        },
        {
          question: "O que faz flex-direction: column em um container flex?",
          options: [
            "Coloca os filhos lado a lado (horizontal)",
            "Empilha os filhos de cima para baixo (vertical)",
            "Cria colunas de uma tabela",
            "Divide o container em duas colunas iguais",
          ],
          correctAnswer: 1,
          explanation:
            "Por padrão, display: flex coloca os filhos lado a lado (row). " +
            "Com flex-direction: column, os filhos são empilhados verticalmente, de cima para baixo. " +
            "Combinado com align-items: center, centraliza todos horizontalmente.",
        },
        {
          question: "Por que devemos usar !important com moderação?",
          options: [
            "Porque deixa o site mais lento",
            "Porque se tudo for !important, perde-se o controle da especificidade e fica difícil sobrescrever estilos",
            "Porque !important só funciona uma vez por arquivo CSS",
            "Porque !important é uma propriedade experimental",
          ],
          correctAnswer: 1,
          explanation:
            "!important sobrescreve qualquer especificidade, o que é útil em casos pontuais. " +
            "Mas se usarmos !important em tudo, criamos uma guerra de !importants onde nenhum estilo " +
            "pode ser sobrescrito de forma previsível. É melhor resolver conflitos ajustando os seletores.",
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
