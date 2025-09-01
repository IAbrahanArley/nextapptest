import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import path from "path";

export async function GET() {
  try {
    console.log("=== Testando criação de bucket ===");

    // Usar arquivo de chave diretamente
    const keyFilePath = path.join(process.cwd(), "service-account-key.json");
    console.log("🔑 Caminho do arquivo de chave:", keyFilePath);

    const storage = new Storage({
      keyFilename: keyFilePath,
    });

    console.log("✅ Storage inicializado");

    // Testar criação de bucket
    const testBucketName = "loyalty-saas-test-" + Date.now();
    console.log("🧪 Tentando criar bucket de teste:", testBucketName);

    const bucket = storage.bucket(testBucketName);

    try {
      // Tentar criar o bucket
      console.log("🏗️ Criando bucket de teste...");
      await bucket.create({
        location: "US",
        storageClass: "STANDARD",
      });
      console.log("✅ Bucket de teste criado com sucesso!");

      // Configurar permissões públicas
      console.log("🌐 Configurando permissões públicas...");
      await bucket.makePublic();
      console.log("✅ Permissões públicas configuradas");

      // Limpar: deletar o bucket de teste
      console.log("🧹 Deletando bucket de teste...");
      await bucket.delete();
      console.log("✅ Bucket de teste deletado");

      return NextResponse.json({
        success: true,
        message: "Criação de bucket funcionando perfeitamente",
        test: {
          created: true,
          permissions: true,
          deleted: true,
        },
        note: "O service account tem permissão para criar buckets. O bucket 'branlyshop' será criado automaticamente no primeiro upload.",
      });
    } catch (createError) {
      console.error("❌ Erro ao criar bucket de teste:", createError);

      let errorType = "unknown";
      let errorMessage = "Erro desconhecido";

      if (createError instanceof Error) {
        errorMessage = createError.message;

        if (createError.message.includes("Permission")) {
          errorType = "permission_denied";
        } else if (createError.message.includes("Forbidden")) {
          errorType = "forbidden";
        } else if (createError.message.includes("Quota")) {
          errorType = "quota_exceeded";
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: "Erro ao criar bucket de teste",
          error: {
            type: errorType,
            message: errorMessage,
            details: "O service account não tem permissão para criar buckets",
          },
          suggestion:
            "Adicione a permissão 'Storage Admin' ao service account ou crie o bucket 'branlyshop' manualmente no Google Cloud Console",
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

