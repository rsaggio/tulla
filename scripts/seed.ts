import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

// Carregar variáveis de ambiente do arquivo .env
config();

// Importe os modelos
import "../src/models/User";
import "../src/models/Course";
import "../src/models/Module";
import "../src/models/Lesson";
import "../src/models/Project";
import "../src/models/Progress";
import "../src/models/Quiz";
import "../src/models/Activity";

const User = mongoose.models.User;
const Course = mongoose.models.Course;
const Module = mongoose.models.Module;
const Lesson = mongoose.models.Lesson;
const Project = mongoose.models.Project;
const Progress = mongoose.models.Progress;
const Quiz = mongoose.models.Quiz;
const Activity = mongoose.models.Activity;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI não definida no .env");
}

async function seed() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado ao MongoDB");

    // Limpar dados existentes
    console.log("🗑️  Limpando dados existentes...");
    await User.deleteMany({});
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Lesson.deleteMany({});
    await Project.deleteMany({});
    await Progress.deleteMany({});
    await Quiz.deleteMany({});
    await Activity.deleteMany({});

    // Criar usuários
    console.log("👥 Criando usuários...");
    const hashedPassword = await bcrypt.hash("senha123", 10);

    const admin = await User.create({
      name: "Admin Sistema",
      email: "admin@bootcamp.com",
      password: hashedPassword,
      role: "admin",
    });

    const instrutor = await User.create({
      name: "João Instrutor",
      email: "instrutor@bootcamp.com",
      password: hashedPassword,
      role: "instrutor",
    });

    const aluno = await User.create({
      name: "Maria Aluna",
      email: "aluno@bootcamp.com",
      password: hashedPassword,
      role: "aluno",
    });

    console.log("✅ Usuários criados");

    // Criar curso
    console.log("📚 Criando curso...");
    const course = await Course.create({
      title: "Desenvolvimento Web Full-Stack",
      description:
        "Aprenda a criar aplicações web modernas do zero, dominando front-end, back-end e deploy em produção. Ideal para quem quer fazer transição de carreira.",
      duration: 180,
      prerequisites: [
        "Conhecimento básico de inglês técnico",
        "Computador com acesso à internet",
        "Vontade de aprender e dedicação",
      ],
      isActive: true,
      createdBy: admin._id,
      modules: [],
    });

    console.log("✅ Curso criado");

    // MÓDULO 1: Fundamentos Web
    console.log("📖 Criando Módulo 1...");
    const modulo1 = await Module.create({
      courseId: course._id,
      title: "Fundamentos da Web",
      description:
        "Aprenda os conceitos essenciais de HTML, CSS e JavaScript para criar suas primeiras páginas web.",
      order: 1,
      estimatedHours: 40,
      skills: ["HTML5", "CSS3", "JavaScript ES6", "Git", "GitHub"],
      lessons: [],
    });

    // Aulas do Módulo 1
    const aula1_1 = await Lesson.create({
      moduleId: modulo1._id,
      title: "Introdução ao HTML5",
      content: `# Introdução ao HTML5

HTML (HyperText Markup Language) é a linguagem de marcação padrão para criar páginas web.

## O que você vai aprender:

- Estrutura básica de um documento HTML
- Tags semânticas
- Formulários e inputs
- Tabelas e listas

## Estrutura Básica

\`\`\`html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Minha Primeira Página</title>
</head>
<body>
    <h1>Olá, Mundo!</h1>
    <p>Esta é minha primeira página HTML.</p>
</body>
</html>
\`\`\`

## Tags Semânticas

HTML5 introduziu tags semânticas que dão significado ao conteúdo:

- \`<header>\` - Cabeçalho
- \`<nav>\` - Navegação
- \`<main>\` - Conteúdo principal
- \`<article>\` - Artigo independente
- \`<section>\` - Seção do documento
- \`<footer>\` - Rodapé

Continue praticando e nos vemos na próxima aula!`,
      videoUrl: "https://www.youtube.com/watch?v=example1",
      order: 1,
      type: "teoria",
      resources: [
        {
          title: "MDN Web Docs - HTML",
          url: "https://developer.mozilla.org/pt-BR/docs/Web/HTML",
        },
        {
          title: "HTML5 Cheat Sheet",
          url: "https://htmlcheatsheet.com/",
        },
      ],
    });

    const aula1_2 = await Lesson.create({
      moduleId: modulo1._id,
      title: "CSS3 e Estilização",
      content: `# CSS3 e Estilização

CSS (Cascading Style Sheets) é a linguagem usada para estilizar páginas HTML.

## Conceitos Principais:

- Seletores
- Box Model
- Flexbox
- Grid Layout
- Responsividade

## Exemplo Básico

\`\`\`css
/* Resetando margens e paddings */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}
\`\`\`

## Flexbox

Flexbox é essencial para layouts modernos:

\`\`\`css
.flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
}
\`\`\`

Pratique criando diferentes layouts!`,
      videoUrl: "",
      order: 2,
      type: "teoria",
      resources: [
        {
          title: "CSS Tricks - A Complete Guide to Flexbox",
          url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
        },
      ],
    });

    const aula1_3 = await Lesson.create({
      moduleId: modulo1._id,
      title: "JavaScript Básico",
      content: `# JavaScript Básico

JavaScript é a linguagem de programação da web. Com ela, você adiciona interatividade às suas páginas.

## Tópicos desta aula:

- Variáveis e tipos de dados
- Funções
- Arrays e Objetos
- DOM Manipulation
- Eventos

## Variáveis

\`\`\`javascript
// Declaração de variáveis
let nome = "Maria";
const idade = 25;
var cidade = "São Paulo"; // Evite usar var

// Template strings
console.log(\`Olá, meu nome é \${nome}\`);
\`\`\`

## Funções

\`\`\`javascript
// Função tradicional
function somar(a, b) {
    return a + b;
}

// Arrow function
const multiplicar = (a, b) => a * b;

console.log(somar(2, 3)); // 5
console.log(multiplicar(2, 3)); // 6
\`\`\`

## Manipulando o DOM

\`\`\`javascript
// Selecionar elemento
const button = document.querySelector('#meuBotao');

// Adicionar evento
button.addEventListener('click', () => {
    alert('Botão clicado!');
});
\`\`\`

Continue praticando escrevendo código!`,
      videoUrl: "",
      order: 3,
      type: "teoria",
      resources: [
        {
          title: "JavaScript.info",
          url: "https://javascript.info/",
        },
      ],
    });

    // Aula de Vídeo
    const aula1_4 = await Lesson.create({
      moduleId: modulo1._id,
      title: "Git e GitHub na Prática",
      content: `# Git e GitHub na Prática

Nesta aula em vídeo, você vai aprender:

- Como inicializar um repositório Git
- Comandos básicos: add, commit, push, pull
- Como criar e gerenciar branches
- Como fazer pull requests
- Boas práticas de versionamento

Assista ao vídeo e pratique os comandos!`,
      videoUrl: "https://www.youtube.com/watch?v=DqTITcMq68k",
      order: 4,
      type: "video",
      duration: 45,
      resources: [
        {
          title: "Git Documentation",
          url: "https://git-scm.com/doc",
        },
        {
          title: "GitHub Guides",
          url: "https://guides.github.com/",
        },
      ],
    });

    // Aula de Quiz
    const aula1_5 = await Lesson.create({
      moduleId: modulo1._id,
      title: "Quiz: Fundamentos da Web",
      content: "Teste seus conhecimentos sobre HTML, CSS e JavaScript!",
      order: 5,
      type: "quiz",
      duration: 15,
    });

    // Criar Quiz associado à aula
    await Quiz.create({
      lessonId: aula1_5._id,
      title: "Quiz: Fundamentos da Web",
      description: "Teste seus conhecimentos sobre os conceitos fundamentais de desenvolvimento web.",
      questions: [
        {
          question: "Qual tag HTML é usada para o conteúdo principal da página?",
          options: ["<div>", "<main>", "<content>", "<body>"],
          correctAnswer: 1,
          explanation: "A tag <main> é semântica e representa o conteúdo principal do documento.",
        },
        {
          question: "Qual propriedade CSS é usada para criar um layout flexível?",
          options: ["display: grid", "display: flex", "display: block", "display: inline"],
          correctAnswer: 1,
          explanation: "display: flex ativa o Flexbox, que permite criar layouts flexíveis e responsivos.",
        },
        {
          question: "Como declarar uma variável constante em JavaScript?",
          options: ["var nome = 'João'", "let nome = 'João'", "const nome = 'João'", "constant nome = 'João'"],
          correctAnswer: 2,
          explanation: "const é usado para declarar constantes que não podem ser reatribuídas.",
        },
        {
          question: "Qual método é usado para selecionar um elemento pelo ID?",
          options: ["document.getElementByClass()", "document.querySelector()", "document.getElementById()", "document.select()"],
          correctAnswer: 2,
          explanation: "document.getElementById() é o método específico para selecionar elementos por ID.",
        },
        {
          question: "O que significa 'responsivo' em design web?",
          options: [
            "Site que responde rapidamente",
            "Site que se adapta a diferentes tamanhos de tela",
            "Site com muitas animações",
            "Site com servidor rápido"
          ],
          correctAnswer: 1,
          explanation: "Design responsivo significa que o site se adapta e funciona bem em diferentes dispositivos e tamanhos de tela.",
        },
      ],
      passingScore: 70,
      timeLimit: 15,
    });

    // Aula de Atividade
    const aula1_6 = await Lesson.create({
      moduleId: modulo1._id,
      title: "Atividade: Criando sua Primeira Página",
      content: "Hora de colocar em prática o que você aprendeu!",
      order: 6,
      type: "activity",
      duration: 60,
    });

    // Criar Activity associada à aula
    await Activity.create({
      lessonId: aula1_6._id,
      title: "Criando sua Primeira Página Web",
      description: `# Descrição da Atividade

Nesta atividade, você vai criar sua primeira página web completa aplicando os conceitos de HTML, CSS e JavaScript que aprendeu.

## Objetivo

Criar uma página web pessoal que inclui:
- Informações sobre você
- Suas habilidades e interesses
- Links para suas redes sociais
- Um formulário de contato

Esta atividade vai te ajudar a consolidar o conhecimento adquirido nas aulas anteriores.`,
      instructions: `# Instruções

Siga os passos abaixo para completar a atividade:

1. **Estrutura HTML**
   - Crie um arquivo index.html
   - Use tags semânticas (header, nav, main, section, footer)
   - Inclua um título, parágrafo de apresentação e lista de habilidades

2. **Estilização CSS**
   - Crie um arquivo styles.css
   - Aplique cores, fontes e espaçamentos
   - Use Flexbox para organizar os elementos
   - Torne a página responsiva com media queries

3. **Interatividade JavaScript**
   - Crie um arquivo script.js
   - Adicione pelo menos uma interação (exemplo: botão que muda cor, menu que abre/fecha)
   - Valide o formulário de contato

4. **Publicação**
   - Suba seu código para o GitHub
   - Cole o link do repositório na resposta

## Critérios de Avaliação

- Uso correto de tags HTML semânticas
- Estilização adequada com CSS
- Código JavaScript funcional
- Responsividade
- Organização e limpeza do código`,
      expectedFormat: "Link do repositório GitHub + descrição do que você fez",
      minWords: 50,
      maxWords: 500,
      resources: [
        {
          title: "Como criar um repositório no GitHub",
          url: "https://docs.github.com/pt/get-started/quickstart/create-a-repo",
        },
        {
          title: "HTML Semantic Elements",
          url: "https://www.w3schools.com/html/html5_semantic_elements.asp",
        },
      ],
    });

    // Atualizar módulo 1 com as aulas
    await Module.findByIdAndUpdate(modulo1._id, {
      lessons: [aula1_1._id, aula1_2._id, aula1_3._id, aula1_4._id, aula1_5._id, aula1_6._id],
    });

    // Projeto do Módulo 1
    const projeto1 = await Project.create({
      moduleId: modulo1._id,
      title: "Landing Page Responsiva",
      description:
        "Crie uma landing page responsiva para um produto ou serviço de sua escolha usando HTML, CSS e JavaScript.",
      requirements: [
        "Use HTML5 semântico",
        "Estilize com CSS3 (Flexbox ou Grid)",
        "Implemente um formulário de contato funcional",
        "Adicione pelo menos uma interação com JavaScript",
        "O site deve ser totalmente responsivo",
      ],
      deliverables: [
        "Repositório GitHub com código organizado",
        "README.md explicando o projeto",
        "Site hospedado (Vercel, Netlify ou GitHub Pages)",
      ],
      rubric: [
        {
          criterion: "HTML Semântico",
          points: 20,
          description: "Uso correto de tags semânticas HTML5",
        },
        {
          criterion: "CSS e Design",
          points: 30,
          description: "Layout atraente e uso adequado de CSS",
        },
        {
          criterion: "Responsividade",
          points: 25,
          description: "Site funciona bem em mobile, tablet e desktop",
        },
        {
          criterion: "JavaScript",
          points: 15,
          description: "Interatividade funcional e sem erros",
        },
        {
          criterion: "Código e Documentação",
          points: 10,
          description: "Código limpo, organizado e bem documentado",
        },
      ],
      estimatedHours: 20,
      githubRequired: true,
    });

    console.log("✅ Módulo 1 completo");

    // MÓDULO 2: React e Front-end Moderno
    console.log("📖 Criando Módulo 2...");
    const modulo2 = await Module.create({
      courseId: course._id,
      title: "React e Front-end Moderno",
      description:
        "Domine React, a biblioteca mais popular para criar interfaces de usuário modernas e interativas.",
      order: 2,
      estimatedHours: 60,
      skills: ["React", "Hooks", "Component Architecture", "State Management", "React Router"],
      lessons: [],
    });

    const aula2_1 = await Lesson.create({
      moduleId: modulo2._id,
      title: "Introdução ao React",
      content: `# Introdução ao React

React é uma biblioteca JavaScript para construir interfaces de usuário.

## Por que React?

- **Componentização**: Reutilize código
- **Virtual DOM**: Performance otimizada
- **Unidirecional**: Fluxo de dados previsível
- **Ecossistema rico**: Muitas bibliotecas e ferramentas

## Primeiro Componente

\`\`\`jsx
function Welcome({ name }) {
    return <h1>Olá, {name}!</h1>;
}

export default Welcome;
\`\`\`

## JSX

JSX é uma extensão de sintaxe para JavaScript que parece HTML:

\`\`\`jsx
const element = (
    <div className="container">
        <h1>Título</h1>
        <p>Parágrafo de texto</p>
    </div>
);
\`\`\`

Vamos mergulhar mais fundo no próximo módulo!`,
      order: 1,
      type: "teoria",
      resources: [
        {
          title: "React Docs",
          url: "https://react.dev/",
        },
      ],
    });

    await Module.findByIdAndUpdate(modulo2._id, {
      lessons: [aula2_1._id],
    });

    const projeto2 = await Project.create({
      moduleId: modulo2._id,
      title: "Aplicação To-Do com React",
      description:
        "Construa uma aplicação completa de gerenciamento de tarefas usando React com hooks e gerenciamento de estado.",
      requirements: [
        "Use componentes funcionais com hooks",
        "Implemente CRUD completo (Criar, Ler, Atualizar, Deletar)",
        "Use Context API ou Redux para gerenciamento de estado",
        "Adicione filtros (todas, ativas, completadas)",
        "Persista dados no localStorage",
      ],
      deliverables: [
        "Repositório GitHub",
        "Aplicação deployada",
        "Testes unitários para componentes principais",
      ],
      rubric: [
        {
          criterion: "Arquitetura de Componentes",
          points: 25,
          description: "Componentes bem organizados e reutilizáveis",
        },
        {
          criterion: "Gerenciamento de Estado",
          points: 25,
          description: "Uso correto de hooks e state management",
        },
        {
          criterion: "Funcionalidades",
          points: 30,
          description: "Todas as funcionalidades implementadas corretamente",
        },
        {
          criterion: "UI/UX",
          points: 20,
          description: "Interface intuitiva e responsiva",
        },
      ],
      estimatedHours: 30,
      githubRequired: true,
    });

    console.log("✅ Módulo 2 completo");

    // MÓDULO 3: Backend e APIs
    console.log("📖 Criando Módulo 3...");
    const modulo3 = await Module.create({
      courseId: course._id,
      title: "Backend com Node.js e APIs REST",
      description:
        "Aprenda a criar APIs RESTful robustas e escaláveis com Node.js, Express e MongoDB.",
      order: 3,
      estimatedHours: 80,
      skills: ["Node.js", "Express", "MongoDB", "REST APIs", "Autenticação JWT"],
      lessons: [],
    });

    const aula3_1 = await Lesson.create({
      moduleId: modulo3._id,
      title: "Fundamentos de Node.js",
      content: `# Fundamentos de Node.js

Node.js é um runtime JavaScript construído sobre o motor V8 do Chrome.

## Por que Node.js?

- **JavaScript no servidor**: Use a mesma linguagem em todo o stack
- **Assíncrono e não-bloqueante**: Alta performance
- **NPM**: Maior ecossistema de pacotes do mundo
- **Escalável**: Ideal para aplicações real-time

## Criando um servidor básico

\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Olá do Node.js!</h1>');
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
\`\`\`

## Express Framework

Express simplifica a criação de APIs:

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
    res.json({ users: [] });
});

app.listen(3000);
\`\`\`

Continue praticando criando suas próprias rotas!`,
      order: 1,
      type: "teoria",
      resources: [
        {
          title: "Node.js Docs",
          url: "https://nodejs.org/docs/",
        },
      ],
    });

    await Module.findByIdAndUpdate(modulo3._id, {
      lessons: [aula3_1._id],
    });

    const projeto3 = await Project.create({
      moduleId: modulo3._id,
      title: "API REST Completa",
      description:
        "Crie uma API RESTful completa com autenticação, CRUD de recursos e documentação.",
      requirements: [
        "Implemente autenticação JWT",
        "Crie pelo menos 3 recursos com CRUD completo",
        "Use MongoDB com Mongoose",
        "Implemente validações com Joi ou Zod",
        "Adicione tratamento de erros global",
        "Documente a API com Swagger",
      ],
      deliverables: [
        "Repositório GitHub com código",
        "API deployada (Render, Railway ou Heroku)",
        "Documentação da API",
        "Arquivo .env.example",
      ],
      rubric: [
        {
          criterion: "Arquitetura da API",
          points: 25,
          description: "Rotas bem organizadas, middlewares, controllers",
        },
        {
          criterion: "Autenticação e Segurança",
          points: 25,
          description: "JWT implementado corretamente, validações",
        },
        {
          criterion: "Database e Models",
          points: 20,
          description: "Models bem definidos, relacionamentos corretos",
        },
        {
          criterion: "Documentação",
          points: 15,
          description: "API bem documentada e fácil de usar",
        },
        {
          criterion: "Código e Boas Práticas",
          points: 15,
          description: "Código limpo, tratamento de erros, async/await",
        },
      ],
      estimatedHours: 40,
      githubRequired: true,
    });

    console.log("✅ Módulo 3 completo");

    // Atualizar curso com módulos
    await Course.findByIdAndUpdate(course._id, {
      modules: [modulo1._id, modulo2._id, modulo3._id],
    });

    console.log("✅ Curso atualizado com módulos");

    // Criar progresso para o aluno
    console.log("📈 Criando progresso do aluno...");
    await Progress.create({
      studentId: aluno._id,
      courseId: course._id,
      completedLessons: [],
      overallProgress: 0,
    });

    console.log("✅ Progresso do aluno criado");

    console.log("\n🎉 Seed completado com sucesso!");
    console.log("\n📊 Resumo:");
    console.log(`- 3 usuários criados (admin, instrutor, aluno)`);
    console.log(`- 1 curso criado: "${course.title}"`);
    console.log(`- 3 módulos criados`);
    console.log(`- 5 aulas criadas`);
    console.log(`- 3 projetos criados`);
    console.log(`- 1 registro de progresso criado`);
    console.log("\n🔐 Credenciais de acesso:");
    console.log("Admin: admin@bootcamp.com / senha123");
    console.log("Instrutor: instrutor@bootcamp.com / senha123");
    console.log("Aluno: aluno@bootcamp.com / senha123");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
