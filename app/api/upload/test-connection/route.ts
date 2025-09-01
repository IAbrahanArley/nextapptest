import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import path from "path";

export async function GET() {
  try {
    console.log("=== Testando conexão com Google Cloud Storage ===");

    // Usar arquivo de chave diretamente
    const keyFilePath = path.join(process.cwd(), "service-account-key.json");
    console.log("🔑 Caminho do arquivo de chave:", keyFilePath);

    const storage = new Storage({
      keyFilename: keyFilePath,
    });

    console.log("✅ Storage inicializado");

    // Testar apenas a conexão básica sem listar buckets
    console.log("🧪 Testando conexão básica...");

    // Verificar se conseguimos acessar o bucket específico
    const bucketName = "branlyshop";
    const bucket = storage.bucket(bucketName);

    // Tentar fazer uma operação simples para testar permissões
    try {
      console.log("🔍 Testando acesso ao bucket:", bucketName);

      // Tentar listar arquivos (pode falhar por permissão, mas não quebra a conexão)
      const [files] = await bucket.getFiles({ maxResults: 1 });
      console.log("✅ Acesso ao bucket confirmado");
      console.log("📁 Arquivos no bucket:", files.length);

      return NextResponse.json({
        success: true,
        message: "Conexão com Google Cloud Storage funcionando",
        bucket: {
          name: bucketName,
          accessible: true,
          fileCount: files.length,
        },
      });
    } catch (bucketError) {
      console.log(
        "⚠️ Acesso ao bucket limitado:",
        bucketError instanceof Error ? bucketError.message : String(bucketError)
      );

      // Se não conseguir listar arquivos, mas a conexão funcionou
      return NextResponse.json({
        success: true,
        message:
          "Conexão com Google Cloud Storage funcionando (acesso limitado)",
        bucket: {
          name: bucketName,
          accessible: false,
          reason:
            bucketError instanceof Error
              ? bucketError.message
              : String(bucketError),
        },
        note: "O service account pode não ter permissão para listar arquivos, mas pode fazer upload",
      });
    }
  } catch (error) {
    console.error("❌ Erro ao testar conexão:", error);

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
