import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import path from "path";

export async function GET() {
  try {
    console.log("=== Testando acesso ao bucket ===");

    // Usar arquivo de chave diretamente
    const keyFilePath = path.join(process.cwd(), "service-account-key.json");
    console.log("🔑 Caminho do arquivo de chave:", keyFilePath);

    const storage = new Storage({
      keyFilename: keyFilePath,
    });

    console.log("✅ Storage inicializado");

    // Testar acesso ao bucket específico
    const bucketName = "branlyshop";
    console.log("🔍 Testando bucket:", bucketName);

    const bucket = storage.bucket(bucketName);

    try {
      // Tentar obter metadados do bucket (sem listar arquivos)
      console.log("🧪 Obtendo metadados do bucket...");
      const [metadata] = await bucket.getMetadata();

      console.log("✅ Bucket acessível!");
      console.log("📋 Metadados:", {
        name: metadata.name,
        location: metadata.location,
        storageClass: metadata.storageClass,
        versioning: metadata.versioning?.enabled || false,
        lifecycle: metadata.lifecycle?.rule ? "Configurado" : "Não configurado",
      });

      return NextResponse.json({
        success: true,
        message: "Bucket acessível com sucesso",
        bucket: {
          name: metadata.name,
          location: metadata.location,
          storageClass: metadata.storageClass,
          accessible: true,
        },
      });
    } catch (bucketError) {
      console.error("❌ Erro ao acessar bucket:", bucketError);

      let errorType = "unknown";
      let errorMessage = "Erro desconhecido";

      if (bucketError instanceof Error) {
        errorMessage = bucketError.message;

        if (bucketError.message.includes("Not Found")) {
          errorType = "not_found";
        } else if (bucketError.message.includes("Permission")) {
          errorType = "permission_denied";
        } else if (bucketError.message.includes("Forbidden")) {
          errorType = "forbidden";
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao acessar bucket",
          error: {
            type: errorType,
            message: errorMessage,
            details:
              "Verifique se o bucket existe e se o service account tem permissão",
          },
          bucket: {
            name: bucketName,
            accessible: false,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Erro geral:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Erro ao conectar com Google Cloud Storage",
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

