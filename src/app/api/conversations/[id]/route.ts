import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db/mongodb";
import Conversation from "@/models/Conversation";
import User from "@/models/User";

// GET /api/conversations/[id] - Buscar conversa específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const conversation = await Conversation.findOne({
      _id: id,
      userId: user._id,
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Erro ao buscar conversa:", error);
    return NextResponse.json(
      { error: "Erro ao buscar conversa" },
      { status: 500 }
    );
  }
}

// DELETE /api/conversations/[id] - Deletar conversa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const conversation = await Conversation.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Conversa deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar conversa:", error);
    return NextResponse.json(
      { error: "Erro ao deletar conversa" },
      { status: 500 }
    );
  }
}

// PATCH /api/conversations/[id] - Atualizar título da conversa
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const conversation = await Conversation.findOneAndUpdate(
      { _id: id, userId: user._id },
      { title },
      { new: true }
    );

    if (!conversation) {
      return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Erro ao atualizar conversa:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar conversa" },
      { status: 500 }
    );
  }
}
