import mongoose from "mongoose";
import { config } from "dotenv";

config();

import "../src/models/Course";
import "../src/models/Module";
import "../src/models/Project";

const Course = mongoose.models.Course;
const Module = mongoose.models.Module;
const Project = mongoose.models.Project;

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

    // Buscar o primeiro módulo do curso (Módulo 1)
    if (!course.modules || course.modules.length === 0) {
      throw new Error("Curso não tem módulos. Crie um módulo primeiro.");
    }

    const moduleId = course.modules[0];
    const module = await Module.findById(moduleId);
    if (!module) {
      throw new Error("Módulo 1 não encontrado.");
    }
    console.log(`Módulo encontrado: ${module.title}`);

    // Verificar se o projeto já existe
    const existingProject = await Project.findOne({
      moduleId: module._id,
      title: "Loja Virtual - TullaShop",
    });

    if (existingProject) {
      console.log("Projeto 'Loja Virtual - TullaShop' já existe. Pulando criação.");
      await mongoose.disconnect();
      return;
    }

    // Criar o projeto
    const project = await Project.create({
      moduleId: module._id,
      title: "Loja Virtual - TullaShop",
      description: `## Projeto Final do Módulo 1 — Loja Virtual

Chegou a hora de colocar em prática tudo o que você aprendeu neste módulo! Você vai construir uma **loja virtual completa** chamada **TullaShop**, usando apenas **HTML e CSS**.

### Objetivo
Criar um site de e-commerce estático com pelo menos **3 páginas** navegáveis entre si, aplicando todos os conceitos de HTML semântico e CSS que você aprendeu ao longo do módulo.

### Contexto
Imagine que um cliente pediu para você criar a interface de uma loja virtual de produtos de tecnologia (ou o tema que preferir: roupas, livros, games, etc.). O site não precisa ter funcionalidade de compra real — o foco é na **estrutura HTML** e na **estilização CSS**.

### Páginas Obrigatórias

#### 1. Página Home (\`index.html\`)
- **Header** com logo, navegação e barra de busca (visual, não precisa funcionar)
- **Banner principal** com imagem de destaque e texto promocional (use background-image e/ou gradientes)
- **Seção de categorias** com cards clicáveis (use flexbox)
- **Grade de produtos em destaque** (mínimo 6 produtos com imagem, nome, preço e botão "Comprar")
- **Footer** com informações de contato, links úteis e redes sociais

#### 2. Página de Produto (\`produto.html\`)
- **Breadcrumb** de navegação (Home > Categoria > Produto)
- **Imagem grande do produto** com galeria lateral (pode ser simulada com imagens menores)
- **Informações do produto**: nome, preço, preço com desconto, descrição detalhada
- **Botão "Adicionar ao Carrinho"** estilizado
- **Tabela de especificações** técnicas do produto (use \`<table>\`, \`<thead>\`, \`<tbody>\`)
- **Seção "Produtos Relacionados"** com 3-4 cards

#### 3. Página do Carrinho (\`carrinho.html\`)
- **Tabela com os itens do carrinho**: imagem miniatura, nome, quantidade, preço unitário, subtotal
- **Botões de remover item** (visual)
- **Resumo do pedido**: subtotal, frete, desconto, total
- **Formulário de cupom de desconto** (use \`<form>\`, \`<input>\`, \`<button>\`)
- **Botão "Finalizar Compra"** em destaque

### Dicas de Implementação
- Use **CSS externo** (arquivo \`style.css\` separado)
- Organize seu CSS com comentários por seção
- Use **variáveis CSS** (\`--cor-primaria\`, \`--cor-secundaria\`, etc.)
- Aplique **hover effects** nos botões e cards
- Use **flexbox** para layouts
- Use **position** para elementos como badges de desconto, menus fixos, etc.
- Todas as páginas devem ter **navegação funcional** entre si (links \`<a>\`)`,
      requirements: [
        "Mínimo de 3 páginas HTML: Home, Produto e Carrinho",
        "HTML semântico: usar tags como <header>, <nav>, <main>, <section>, <footer>, <article>",
        "CSS externo em arquivo separado (style.css)",
        "Uso de Flexbox para layout dos produtos e seções",
        "Pelo menos 1 tabela HTML com <thead>, <tbody> e <tfoot>",
        "Formulário com <form>, <input>, <label> e <button>",
        "Background-image ou gradiente CSS em pelo menos 1 seção",
        "Efeitos hover em botões e cards de produtos",
        "Navegação funcional entre todas as páginas (links <a>)",
        "Tipografia: usar pelo menos 1 fonte do Google Fonts",
        "Uso de ícones (Font Awesome, Material Icons ou similar)",
        "Design responsivo não é obrigatório, mas ganha pontos extras",
      ],
      deliverables: [
        "Pasta do projeto compactada (.zip) com todos os arquivos",
        "Arquivo index.html (página Home)",
        "Arquivo produto.html (página de Produto)",
        "Arquivo carrinho.html (página do Carrinho)",
        "Arquivo style.css (estilos)",
        "Pasta de imagens utilizadas",
      ],
      rubric: [
        {
          criterion: "Estrutura HTML Semântica",
          points: 20,
          description:
            "Uso correto de tags semânticas (header, nav, main, section, article, footer). HTML bem organizado e indentado. Todas as 3 páginas presentes e com conteúdo completo.",
        },
        {
          criterion: "Estilização CSS",
          points: 25,
          description:
            "CSS externo bem organizado com comentários. Uso de variáveis CSS. Cores, tipografia e espaçamentos consistentes. Uso de Google Fonts e ícones. Efeitos hover nos elementos interativos.",
        },
        {
          criterion: "Layout com Flexbox",
          points: 20,
          description:
            "Grid de produtos usando flexbox. Header/navbar com flexbox. Seções bem alinhadas e distribuídas. Cards de produto com layout organizado.",
        },
        {
          criterion: "Tabelas e Formulários",
          points: 15,
          description:
            "Tabela de especificações na página de produto com thead/tbody. Tabela do carrinho com itens e totais. Formulário de cupom com input e botão. Uso correto de labels.",
        },
        {
          criterion: "Navegação e Imagens",
          points: 10,
          description:
            "Links funcionais entre todas as páginas. Background-image ou gradiente em pelo menos 1 seção. Imagens de produtos com tamanhos adequados. Breadcrumb na página de produto.",
        },
        {
          criterion: "Organização e Boas Práticas",
          points: 10,
          description:
            "Código limpo e bem indentado. Arquivos organizados em pastas. Nomes de classes CSS descritivos. Comentários no CSS separando seções.",
        },
      ],
      estimatedHours: 12,
      githubRequired: false,
    });

    console.log(`\nProjeto criado com sucesso!`);
    console.log(`  Título: ${project.title}`);
    console.log(`  Módulo: ${module.title}`);
    console.log(`  Requisitos: ${project.requirements.length}`);
    console.log(`  Entregáveis: ${project.deliverables.length}`);
    console.log(`  Critérios de avaliação: ${project.rubric.length}`);
    console.log(`  Horas estimadas: ${project.estimatedHours}h`);
    console.log(`  GitHub obrigatório: ${project.githubRequired}`);

    await mongoose.disconnect();
    console.log("\nDesconectado do MongoDB. Script finalizado!");
  } catch (error) {
    console.error("Erro:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
