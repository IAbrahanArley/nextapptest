import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import path from "path";

// Configuração do Google Cloud Storage usando arquivo de chave
let storage: Storage | null = null;
let bucketName: string | null = null;

try {
  console.log("=== Configurando Google Cloud Storage ===");

  // Usar arquivo de chave diretamente
  const keyFilePath = path.join(process.cwd(), "service-account-key.json");
  console.log("🔑 Caminho do arquivo de chave:", keyFilePath);

  storage = new Storage({
    keyFilename: keyFilePath,
  });

  bucketName = "branlyshop"; // Nome fixo do bucket
  console.log("✅ Google Cloud Storage configurado com sucesso");
  console.log("Bucket:", bucketName);
} catch (error) {
  console.error("❌ Erro ao configurar Google Cloud Storage:", error);
  storage = null;
  bucketName = null;
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Iniciando upload de imagem ===");

    // Verificar se o Google Cloud Storage está configurado
    if (!storage || !bucketName) {
      console.log("❌ Serviço não configurado");
      return NextResponse.json(
        {
          error:
            "Serviço de upload não configurado. Entre em contato com o suporte.",
          details: "Google Cloud Storage não configurado",
        },
        { status: 503 }
      );
    }

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
      console.log("❌ Nenhuma imagem fornecida");
      return NextResponse.json(
        { error: "Nenhuma imagem fornecida" },
        { status: 400 }
      );
    }

    if (!storeId || !storeName) {
      console.log("❌ Dados da loja incompletos");
      return NextResponse.json(
        { error: "Dados da loja incompletos" },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    if (!image.type.startsWith("image/")) {
      console.log("❌ Tipo de arquivo inválido:", image.type);
      return NextResponse.json(
        { error: "Arquivo deve ser uma imagem" },
        { status: 400 }
      );
    }

    // Validar tamanho (5MB)
    if (image.size > 5 * 1024 * 1024) {
      console.log("❌ Arquivo muito grande:", image.size);
      return NextResponse.json(
        { error: "Imagem deve ter menos de 5MB" },
        { status: 400 }
      );
    }

    // Acessar o bucket existente
    console.log("🔍 Acessando bucket:", bucketName);
    const bucket = storage.bucket(bucketName);

    // Criar nome de arquivo com pasta específica da loja
    const timestamp = Date.now();
    const sanitizedStoreName = storeName
      .replace(/[^a-zA-Z0-9-_]/g, "_")
      .toLowerCase();
    const fileName = `stores/${sanitizedStoreName}/profile-images/${timestamp}-${image.name}`;

    console.log("📁 Nome do arquivo:", fileName);
    console.log("🏪 Pasta da loja:", `stores/${sanitizedStoreName}`);

    // Converter File para Buffer
    console.log("🔄 Convertendo arquivo para buffer...");
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("✅ Buffer criado, tamanho:", buffer.length);

    // Fazer upload para o Google Cloud Storage
    console.log("☁️ Iniciando upload para Google Cloud Storage...");
    const file = bucket.file(fileName);

    console.log("💾 Salvando arquivo...");
    await file.save(buffer, {
      metadata: {
        contentType: image.type,
        cacheControl: "public, max-age=31536000", // 1 ano
        metadata: {
          storeId: storeId,
          storeName: storeName,
          uploadType: "profile-image",
        },
      },
    });
    console.log("✅ Arquivo salvo com sucesso");

    // Tornar o arquivo público
    console.log("🌐 Tornando arquivo público...");
    await file.makePublic();
    console.log("✅ Arquivo tornado público");

    // URL pública da imagem
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    console.log("🔗 URL pública:", publicUrl);

    // Preparar resposta de sucesso
    const successResponse = {
      success: true,
      url: publicUrl,
      fileName: fileName,
      bucket: bucketName,
      store: {
        id: storeId,
        name: storeName,
        folder: `stores/${sanitizedStoreName}`,
      },
    };

    console.log("✅ Resposta de sucesso preparada:", successResponse);
    return NextResponse.json(successResponse);
  } catch (error) {
    console.error("❌ Erro no upload:", error);

    // Verificar se é um erro específico do Google Cloud
    if (error instanceof Error) {
      if (error.message.includes("credentials")) {
        console.log("❌ Erro de credenciais detectado");
        return NextResponse.json(
          {
            error: "Erro de autenticação com o serviço de armazenamento",
            details: "Verifique as credenciais do Google Cloud",
          },
          { status: 500 }
        );
      }

      if (error.message.includes("bucket")) {
        console.log("❌ Erro de bucket detectado");
        return NextResponse.json(
          {
            error: "Erro ao acessar o bucket de armazenamento",
            details: "Verifique se o bucket existe e está acessível",
          },
          { status: 500 }
        );
      }

      if (error.message.includes("permission")) {
        console.log("❌ Erro de permissão detectado");
        return NextResponse.json(
          {
            error: "Erro de permissão no serviço de armazenamento",
            details: "Verifique as permissões do service account",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Erro interno do servidor durante o upload",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
