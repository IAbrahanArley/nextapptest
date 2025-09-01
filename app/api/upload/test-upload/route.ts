import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    console.log("=== Teste de upload real ===");

    // Usar arquivo de chave diretamente
    const keyFilePath = path.join(process.cwd(), "service-account-key.json");
    console.log("🔑 Caminho do arquivo de chave:", keyFilePath);

    const storage = new Storage({
      keyFilename: keyFilePath,
    });

    console.log("✅ Storage inicializado");

    const formData = await request.formData();
    const image = formData.get("image") as File;
    const storeId = formData.get("storeId") as string;
    const storeName = formData.get("storeName") as string;

    console.log("📝 Dados recebidos:");
    console.log(
      "- Image:",
      image ? `${image.name} (${image.size} bytes)` : "Não fornecida"
    );
    console.log("- StoreId:", storeId);
    console.log("- StoreName:", storeName);

    if (!image) {
      return NextResponse.json(
        { error: "Nenhuma imagem fornecida" },
        { status: 400 }
      );
    }

    if (!storeId || !storeName) {
      return NextResponse.json(
        { error: "Dados da loja incompletos" },
        { status: 400 }
      );
    }

    // Acessar o bucket
    const bucketName = "branlyshop";
    console.log("🔍 Acessando bucket:", bucketName);
    const bucket = storage.bucket(bucketName);

    // Criar nome de arquivo de teste
    const timestamp = Date.now();
    const sanitizedStoreName = storeName
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .toLowerCase();
    const fileName = `stores/${sanitizedStoreName}/test-images/${timestamp}-${image.name}`;

    console.log("📁 Nome do arquivo:", fileName);

    // Converter File para Buffer
    console.log("🔄 Convertendo arquivo para buffer...");
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("✅ Buffer criado, tamanho:", buffer.length);

    // Fazer upload
    console.log("💾 Salvando arquivo...");
    const file = bucket.file(fileName);
    await file.save(buffer, {
      metadata: {
        contentType: image.type,
        cacheControl: "public, max-age=31536000",
        metadata: {
          storeId: storeId,
          storeName: storeName,
          uploadType: "test-image",
        },
      },
    });
    console.log("✅ Arquivo salvo com sucesso");

    // Tornar público
    console.log("🌐 Tornando arquivo público...");
    await file.makePublic();
    console.log("✅ Arquivo tornado público");

    // URL pública
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    console.log("🔗 URL pública:", publicUrl);

    return NextResponse.json({
      success: true,
      message: "Upload de teste realizado com sucesso",
      url: publicUrl,
      fileName: fileName,
      bucket: bucketName,
      store: {
        id: storeId,
        name: storeName,
        folder: `stores/${sanitizedStoreName}`,
      },
    });
  } catch (error) {
    console.error("❌ Erro no teste de upload:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro no teste de upload",
        error: error instanceof Error ? error.message : "Erro desconhecido",
        details: "Verifique os logs do servidor para mais informações",
      },
      { status: 500 }
    );
  }
}

