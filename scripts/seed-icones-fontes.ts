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
    const markdownPath = path.join(__dirname, "..", "markdown", "icones-e-fontes.md");
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
      title: "Ícones e Google Fonts",
      content:
        "Neste vídeo você vai aprender a adicionar ícones do Google Material Symbols " +
        "na sua página, alinhar ícones com texto usando flexbox, " +
        "e importar fontes personalizadas do Google Fonts para deixar sua página com tipografia profissional.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160876295",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Ícones e Google Fonts",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Ícones no Botão
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Adicionando Ícones aos Botões",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Adicionando Ícones aos Botões",
      description:
        "Neste exercício você vai praticar a importação do Google Material Symbols " +
        "e adicionar ícones dentro de botões, alinhando ícone e texto com flexbox.",
      instructions:
        "Crie uma página HTML de loja com botões que incluem ícones:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- No head, importe a biblioteca de ícones do Google Material Symbols usando a tag link\n" +
        "- Uma tag style no head\n" +
        "- body com margin: 0\n\n" +
        "**Conteúdo:**\n" +
        "- Um h1 com o texto \"Minha Loja\"\n" +
        "- Uma div com id=\"vitrine\" usando display: flex, justify-content: center e gap: 20px\n" +
        "- Pelo menos 2 cartões de produto, cada um com:\n" +
        "  - Uma imagem (pode usar https://via.placeholder.com/250x200)\n" +
        "  - Um h2 com o nome do produto\n" +
        "  - Um parágrafo com o preço, incluindo preço antigo riscado usando uma classe .riscado (NÃO estilize a tag span diretamente)\n" +
        "  - Um link <a> com class=\"botao\" contendo um ícone shopping_cart e o texto \"Adicionar ao carrinho\"\n\n" +
        "**CSS da classe .botao:**\n" +
        "- display: flex (para alinhar ícone e texto)\n" +
        "- justify-content: center\n" +
        "- align-items: center\n" +
        "- gap: 8px\n" +
        "- text-decoration: none\n" +
        "- background-color com uma cor de sua escolha\n" +
        "- color: white\n" +
        "- font-weight: bold\n" +
        "- padding-top e padding-bottom de 18px\n" +
        "- border-radius: 8px\n" +
        "- Adicione um efeito .botao:hover\n\n" +
        "**CSS da classe .riscado:**\n" +
        "- text-decoration: line-through\n" +
        "- color: gray\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Google Fonts
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Tipografia com Google Fonts",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Tipografia com Google Fonts",
      description:
        "Neste exercício você vai importar fontes do Google Fonts " +
        "e aplicá-las em diferentes partes da página para criar uma tipografia profissional.",
      instructions:
        "Crie uma página HTML de portfólio pessoal usando Google Fonts:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- No head, importe 3 fontes do Google Fonts:\n" +
        "  - **Bunge** (para o logo/nome)\n" +
        "  - **Montserrat** com pesos 400 e 700 (para títulos)\n" +
        "  - **Open Sans** com pesos 400 e 700 (para texto do corpo)\n" +
        "- Uma tag style no head\n\n" +
        "**CSS:**\n" +
        "- body com font-family: \"Open Sans\", sans-serif e margin: 0\n" +
        "- h1, h2, h3 com font-family: \"Montserrat\", sans-serif\n" +
        "- Uma classe .logo com font-family: \"Bunge\", cursive e font-size: 36px\n\n" +
        "**Conteúdo da página:**\n" +
        "- Um header com:\n" +
        "  - Um h1 com class=\"logo\" e seu nome (ou nome fictício)\n" +
        "  - Um parágrafo com uma descrição curta (ex: \"Desenvolvedor Web\")\n" +
        "- Uma seção \"Sobre mim\" com:\n" +
        "  - Um h2 com font-weight: 700\n" +
        "  - Um parágrafo com font-weight: 400\n" +
        "- Uma seção \"Projetos\" com:\n" +
        "  - Um h2\n" +
        "  - Pelo menos 2 cartões de projeto com h3 e descrição\n\n" +
        "Observe como as diferentes fontes dão personalidade para cada parte da página.\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Ícones e Google Fonts",
      content: "Teste seus conhecimentos sobre ícones do Google Material Symbols e Google Fonts.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Como adicionamos a biblioteca de ícones do Google Material Symbols na página?",
          options: [
            "Com uma tag <script> no body",
            "Com uma tag <link> no head apontando para fonts.googleapis.com",
            "Baixando os ícones e salvando na pasta do projeto",
            "Com uma tag <icon> no head",
          ],
          correctAnswer: 1,
          explanation:
            "A biblioteca de ícones é importada com uma tag <link rel=\"stylesheet\"> no <head>, " +
            "apontando para o URL do Google Fonts. Isso carrega a fonte de ícones para uso na página.",
        },
        {
          question: "Qual é a forma correta de exibir um ícone de carrinho de compras?",
          options: [
            "<icon>shopping_cart</icon>",
            "<i class=\"icon\">cart</i>",
            "<span class=\"material-symbols-outlined\">shopping_cart</span>",
            "<img src=\"shopping_cart.png\">",
          ],
          correctAnswer: 2,
          explanation:
            "Usamos um <span> com a classe \"material-symbols-outlined\" e o nome do ícone como texto " +
            "dentro do span. A biblioteca transforma esse texto no ícone visual correspondente.",
        },
        {
          question: "Por que estilizar a tag span diretamente pode causar problemas quando usamos ícones?",
          options: [
            "Porque span não aceita CSS",
            "Porque os ícones do Material Symbols usam <span>, então os estilos afetam os ícones também",
            "Porque span é uma tag depreciada",
            "Porque span só funciona com id, não com seletores de tag",
          ],
          correctAnswer: 1,
          explanation:
            "Os ícones do Material Symbols são renderizados em <span>. Se você aplica estilos " +
            "diretamente na tag span (ex: span { text-decoration: line-through }), isso afeta " +
            "todos os spans, incluindo os ícones. A solução é usar classes específicas.",
        },
        {
          question: "Para alinhar um ícone e texto lado a lado dentro de um botão, usamos:",
          options: [
            "display: block com text-align: center",
            "display: inline com margin: auto",
            "display: flex com align-items: center e gap",
            "display: grid com columns: 2",
          ],
          correctAnswer: 2,
          explanation:
            "display: flex no botão alinha os filhos (ícone + texto) lado a lado. " +
            "align-items: center alinha verticalmente e gap cria espaço entre eles. " +
            "justify-content: center centraliza tudo horizontalmente.",
        },
        {
          question: "Por que ícones do Material Symbols podem ter seu tamanho alterado com font-size?",
          options: [
            "Porque são imagens SVG",
            "Porque são uma fonte especial — se comportam como texto",
            "Porque são elementos de bloco",
            "Porque usam a propriedade width internamente",
          ],
          correctAnswer: 1,
          explanation:
            "Os ícones do Material Symbols são na verdade uma fonte tipográfica especial. " +
            "Cada ícone é um caractere dessa fonte. Por isso, propriedades de texto como " +
            "font-size e color funcionam para mudar tamanho e cor dos ícones.",
        },
        {
          question: "Como importamos uma fonte do Google Fonts no HTML?",
          options: [
            "Com <script src=\"fonts.google.com/...\">",
            "Com <font name=\"Montserrat\">",
            "Com <link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Montserrat...\">",
            "Com @import no body",
          ],
          correctAnswer: 2,
          explanation:
            "Fontes do Google são importadas com uma tag <link rel=\"stylesheet\"> no <head>, " +
            "apontando para o URL da fonte no Google Fonts. O parâmetro wght define os pesos desejados.",
        },
        {
          question: "O que significa font-weight: 700?",
          options: [
            "O tamanho da fonte é 700 pixels",
            "A fonte fica em negrito (bold)",
            "O espaçamento entre letras é 700",
            "A opacidade da fonte é 70%",
          ],
          correctAnswer: 1,
          explanation:
            "font-weight controla o peso (espessura) da fonte. O valor 400 equivale a normal " +
            "e 700 equivale a bold (negrito). Outros valores comuns são 100 (thin), 300 (light) " +
            "e 900 (extra bold/black).",
        },
        {
          question: "No CSS, qual é a função do valor após a vírgula em font-family: \"Montserrat\", sans-serif?",
          options: [
            "Define o tamanho da fonte",
            "É um fallback — fonte alternativa caso a principal não carregue",
            "Define o peso da fonte",
            "É obrigatório e não tem função especial",
          ],
          correctAnswer: 1,
          explanation:
            "O segundo valor é um fallback (reserva). Se a fonte \"Montserrat\" não carregar " +
            "(por falta de internet, por exemplo), o navegador usa uma fonte genérica sans-serif " +
            "como alternativa, mantendo a página legível.",
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
