import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Iniciando upload de vídeo ===");

    const formData = await request.formData();
    const file = formData.get("video") as File;

    console.log("Arquivo recebido:", file ? file.name : "nenhum");
    console.log("Tamanho do arquivo:", file ? file.size : 0);
    console.log("Tipo do arquivo:", file ? file.type : "");

    if (!file) {
      console.log("ERRO: Nenhum arquivo enviado");
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      console.log("ERRO: Tipo de arquivo inválido:", file.type);
      return NextResponse.json(
        { error: "Tipo de arquivo inválido. Use MP4, WebM, OGG ou MOV" },
        { status: 400 }
      );
    }

    // Validar tamanho (máximo 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      console.log("ERRO: Arquivo muito grande:", file.size);
      return NextResponse.json(
        { error: "Arquivo muito grande. Tamanho máximo: 500MB" },
        { status: 400 }
      );
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `videos/${timestamp}-${sanitizedName}`;

    console.log("Nome do arquivo no blob:", fileName);
    console.log("Token disponível:", process.env.BLOB_READ_WRITE_TOKEN ? "SIM" : "NÃO");

    // Fazer upload para Vercel Blob
    console.log("Iniciando upload para Vercel Blob...");
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    });

    console.log("Upload concluído! URL:", blob.url);

    return NextResponse.json({
      success: true,
      videoUrl: blob.url,
      fileName: file.name,
    });
  } catch (error) {
    console.error("ERRO ao fazer upload do vídeo:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "");

    return NextResponse.json(
      {
        error: "Erro ao fazer upload do vídeo",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
