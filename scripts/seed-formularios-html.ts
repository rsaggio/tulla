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
    const markdownPath = path.join(__dirname, "..", "markdown", "formularios-html.md");
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
      title: "Formulários HTML — form, input, textarea e select",
      content:
        "Neste vídeo você vai aprender a criar formulários HTML com a tag form, " +
        "usar diferentes tipos de input (text, email, tel), conectar labels aos campos com for/id, " +
        "criar áreas de texto com textarea, listas de opções com select/option, " +
        "organizar campos com divs e flex-direction: column, e estilizar formulários com CSS.",
      order: nextOrder++,
      type: "video",
      videoUrl: "https://vimeo.com/1160922551",
    });
    console.log(`Aula de vídeo criada: ${aulaVideo.title} (ordem ${aulaVideo.order})`);

    // =============================================
    // AULA 2: Teoria
    // =============================================
    console.log("Criando aula de teoria...");
    const aulaTeoria = await Lesson.create({
      moduleId: modulo._id,
      title: "Formulários HTML — form, input, textarea e select",
      content: markdownContent,
      order: nextOrder++,
      type: "teoria",
    });
    console.log(`Aula de teoria criada: ${aulaTeoria.title} (ordem ${aulaTeoria.order})`);

    // =============================================
    // AULA 3: Exercício Prático 1 - Página de Contato
    // =============================================
    console.log("Criando exercício prático 1...");
    const aulaActivity1 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Página de Contato com Formulário",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity1._id,
      title: "Página de Contato com Formulário",
      description:
        "Neste exercício você vai criar uma página de contato completa " +
        "com formulário estilizado, campos de texto, e-mail, telefone, select e textarea.",
      instructions:
        "Crie uma página contato.html com um formulário de contato:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- lang=\"pt-BR\"\n" +
        "- Importe fontes do Google Fonts\n" +
        "- body com margin: 0 e padding-top para o menu fixo\n\n" +
        "**Menu fixo (igual ao das outras páginas):**\n" +
        "- position: fixed, top: 0, width: 100%, box-sizing: border-box\n" +
        "- Links para home.html, carrinho.html e contato.html\n\n" +
        "**Área de conteúdo (div com class=\"content\"):**\n" +
        "- padding: 0 20px\n" +
        "- h2 com class=\"default-title\" e texto \"Entre em Contato Conosco\"\n\n" +
        "**Formulário (form com action=\"#\"):**\n" +
        "- display: flex, flex-direction: column, gap: 16px\n" +
        "- width: 50%\n\n" +
        "**Campos (cada um dentro de uma div):**\n" +
        "- Cada div com display: flex e flex-direction: column\n" +
        "- Nome: label + input type=\"text\"\n" +
        "- E-mail: label + input type=\"email\"\n" +
        "- Telefone: label + input type=\"tel\"\n" +
        "- Assunto: label + select com pelo menos 3 options (Problemas com frete, Devolução de itens, Outro)\n" +
        "- Mensagem: label + textarea\n" +
        "- Cada label com for apontando para o id do campo\n\n" +
        "**Estilos dos campos:**\n" +
        "- form input, form textarea, form select: padding: 8px, border: 1px solid #ccc, border-radius: 8px, outline: none\n" +
        "- form textarea: resize: none, height: 200px\n" +
        "- form label: margin-bottom: 8px\n\n" +
        "**Botão de envio:**\n" +
        "- button type=\"submit\" com class=\"button\" e texto \"Enviar Contato\"\n" +
        "- form button com border: none\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 1 criado: ${aulaActivity1.title} (ordem ${aulaActivity1.order})`);

    // =============================================
    // AULA 4: Exercício Prático 2 - Formulário de Cadastro
    // =============================================
    console.log("Criando exercício prático 2...");
    const aulaActivity2 = await Lesson.create({
      moduleId: modulo._id,
      title: "Exercício: Formulário de Cadastro",
      content: "",
      order: nextOrder++,
      type: "activity",
    });

    await Activity.create({
      lessonId: aulaActivity2._id,
      title: "Formulário de Cadastro",
      description:
        "Neste exercício você vai criar um formulário de cadastro " +
        "praticando diferentes tipos de input, label, select e estilização de formulários.",
      instructions:
        "Crie uma página HTML com um formulário de cadastro de usuário:\n\n" +
        "**Estrutura da página:**\n" +
        "- Estrutura completa do HTML (DOCTYPE, html, head, body)\n" +
        "- body com margin: 0 e uma fonte do Google Fonts\n\n" +
        "**Conteúdo (div com class=\"content\"):**\n" +
        "- display: flex, flex-direction: column, align-items: center\n" +
        "- padding: 40px 20px\n\n" +
        "**Título:**\n" +
        "- h1 com texto \"Crie sua Conta\"\n\n" +
        "**Formulário:**\n" +
        "- display: flex, flex-direction: column, gap: 16px\n" +
        "- width: 400px\n\n" +
        "**Campos (cada um dentro de uma div com flex-direction: column):**\n" +
        "- Nome completo: label + input type=\"text\"\n" +
        "- E-mail: label + input type=\"email\"\n" +
        "- Telefone: label + input type=\"tel\"\n" +
        "- Estado: label + select com pelo menos 5 estados brasileiros como options\n" +
        "- Sobre você: label + textarea (resize: none, height: 120px)\n\n" +
        "**Estilos dos campos:**\n" +
        "- Todos com padding: 10px, border: 1px solid #ddd, border-radius: 8px, outline: none\n" +
        "- Labels com margin-bottom: 6px e font-weight: bold\n\n" +
        "**Botão:**\n" +
        "- button type=\"submit\" com texto \"Criar Conta\"\n" +
        "- background-color: #2196F3 (azul), color: white, padding: 12px, border: none, border-radius: 8px, font-size: 16px, cursor: pointer\n" +
        "- :hover com background-color: #1976D2\n\n" +
        "Escreva o código HTML completo com o CSS.",
    });
    console.log(`Exercício prático 2 criado: ${aulaActivity2.title} (ordem ${aulaActivity2.order})`);

    // =============================================
    // AULA 5: Quiz
    // =============================================
    console.log("Criando aula de quiz...");
    const aulaQuiz = await Lesson.create({
      moduleId: modulo._id,
      title: "Quiz: Formulários HTML",
      content: "Teste seus conhecimentos sobre form, input, textarea, select e estilização de formulários.",
      order: nextOrder++,
      type: "quiz",
      quiz: [
        {
          question: "Qual tag cria um formulário HTML?",
          options: [
            "<input>",
            "<form>",
            "<field>",
            "<formfield>",
          ],
          correctAnswer: 1,
          explanation:
            "A tag <form> cria o container do formulário. Ela agrupa todos os campos (inputs, textareas, selects) " +
            "e define para onde os dados serão enviados através do atributo action. " +
            "O <form> não tem aparência visual — o visual vem dos elementos dentro dele.",
        },
        {
          question: "Qual a diferença entre <input type=\"text\"> e <textarea>?",
          options: [
            "Não há diferença, são a mesma coisa",
            "input aceita uma linha de texto; textarea aceita múltiplas linhas",
            "textarea é mais rápido que input",
            "input é para números e textarea é para texto",
          ],
          correctAnswer: 1,
          explanation:
            "<input type=\"text\"> cria um campo de uma linha só, ideal para nome, e-mail e telefone. " +
            "<textarea> cria um campo de múltiplas linhas, ideal para mensagens e descrições. " +
            "São elementos diferentes com propósitos diferentes.",
        },
        {
          question: "Para que serve o atributo for no <label>?",
          options: [
            "Define a cor do label",
            "Conecta o label ao input pelo id — clicar no label foca no campo",
            "Define o tipo do campo",
            "Obriga o campo a ser preenchido",
          ],
          correctAnswer: 1,
          explanation:
            "O atributo for do label deve corresponder ao id do input. " +
            "Isso conecta visualmente e funcionalmente os dois: clicar no texto do label " +
            "foca automaticamente no campo correspondente. É importante para acessibilidade.",
        },
        {
          question: "Como criar uma lista dropdown de opções em um formulário?",
          options: [
            "<input type=\"list\">",
            "<select> com <option> dentro",
            "<dropdown> com <item> dentro",
            "<list> com <option> dentro",
          ],
          correctAnswer: 1,
          explanation:
            "A tag <select> cria uma lista dropdown. Dentro dela, cada <option> define uma opção. " +
            "O atributo value do option define o valor enviado no formulário, " +
            "e o texto entre as tags define o que o usuário vê.",
        },
        {
          question: "Por que agrupamos label + input dentro de uma <div> no formulário?",
          options: [
            "Porque é obrigatório pelo HTML",
            "Para que o gap do form não separe o label do seu campo",
            "Porque divs deixam o formulário mais bonito automaticamente",
            "Porque inputs não funcionam sem uma div pai",
          ],
          correctAnswer: 1,
          explanation:
            "Com flex-direction: column e gap no form, o espaço é aplicado entre TODOS os filhos — " +
            "incluindo entre o label e seu input. Agrupando em uma div, o gap se aplica " +
            "entre os grupos (div), mantendo label e input juntos.",
        },
        {
          question: "O que faz resize: none no textarea?",
          options: [
            "Remove o textarea da página",
            "Impede que o usuário redimensione o campo arrastando o canto",
            "Fixa o textarea no topo da página",
            "Muda a fonte do textarea",
          ],
          correctAnswer: 1,
          explanation:
            "Por padrão, o textarea tem uma alça no canto que permite ao usuário redimensioná-lo, " +
            "o que pode quebrar o layout da página. resize: none desabilita esse comportamento, " +
            "mantendo o textarea com o tamanho definido pelo CSS.",
        },
        {
          question: "O que faz outline: none nos campos do formulário?",
          options: [
            "Remove a borda do campo",
            "Remove o contorno azul que aparece quando o campo recebe foco",
            "Esconde o campo",
            "Remove o texto placeholder",
          ],
          correctAnswer: 1,
          explanation:
            "Quando o usuário clica em um campo, o navegador mostra um contorno azul (outline) ao redor. " +
            "outline: none remove esse contorno padrão. Note que outline é diferente de border — " +
            "border é a borda do elemento, outline é o contorno de foco.",
        },
        {
          question: "Qual a função do type=\"submit\" no botão de um formulário?",
          options: [
            "Limpa todos os campos do formulário",
            "Envia os dados do formulário para a URL definida no action do form",
            "Fecha a página",
            "Salva os dados no navegador",
          ],
          correctAnswer: 1,
          explanation:
            "O type=\"submit\" faz o botão enviar os dados de todos os campos do formulário " +
            "para a URL definida no atributo action do <form>. Cada campo é identificado " +
            "pelo seu atributo name. Por enquanto usamos action=\"#\" que não envia para lugar nenhum.",
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
