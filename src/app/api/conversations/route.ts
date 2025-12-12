import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Conversation from "@/models/Conversation";
import User from "@/models/User";

// GET /api/conversations - Listar todas as conversas do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const conversations = await Conversation.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .select("_id title updatedAt messages");

    // Retornar conversas com preview da última mensagem
    const conversationsWithPreview = conversations.map((conv) => ({
      _id: conv._id,
      title: conv.title,
      updatedAt: conv.updatedAt,
      messageCount: conv.messages.length,
      lastMessage: conv.messages.length > 0
        ? conv.messages[conv.messages.length - 1].content.substring(0, 100)
        : "",
    }));

    return NextResponse.json(conversationsWithPreview);
  } catch (error) {
    console.error("Erro ao buscar conversas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar conversas" },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Criar nova conversa
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const body = await request.json();
    const { title } = body;

    const conversation = await Conversation.create({
      userId: user._id,
      title: title || "Nova Conversa",
      messages: [
        {
          role: "assistant",
          content: "Oi! Eu sou a Tulla, sua parceira de estudos em programação! 😊\n\nEstou aqui pra te ajudar com dúvidas, explicar conceitos, revisar código e o que mais você precisar na sua jornada como dev. Pode ficar à vontade!\n\nComo posso te ajudar hoje?",
          timestamp: new Date(),
        },
      ],
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Erro ao criar conversa:", error);
    return NextResponse.json(
      { error: "Erro ao criar conversa" },
      { status: 500 }
    );
  }
}
