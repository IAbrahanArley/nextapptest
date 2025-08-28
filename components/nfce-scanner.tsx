"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  X,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import jsQR from "jsqr";
import { toast } from "sonner";

interface NFCeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  storeId?: string;
}

interface ScanResult {
  success: boolean;
  message: string;
  error?: string;
  nfceId?: string;
  status?: string;
  storeName?: string;
  estimatedTime?: string;
  // Campos de erro específicos
  notRegistered?: boolean;
  alreadyProcessed?: boolean;
}

export function NFCeScanner({ onScan, onClose, storeId }: NFCeScannerProps) {
  // Garantir que storeId sempre tenha um valor
  const finalStoreId =
    storeId === undefined || storeId === null ? "auto" : storeId;

  console.log("NFCeScanner: Componente montado", {
    storeId,
    finalStoreId,
    storeIdType: typeof storeId,
    hasStoreId: !!storeId,
    defaultValue: "auto",
  });

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [detectedContent, setDetectedContent] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startCamera = async () => {
    console.log("NFCeScanner: Iniciando câmera...");
    try {
      setError(null);
      setIsInitializing(true);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("NFCeScanner: MediaDevices não suportado");
        setError("Câmera não suportada neste navegador");
        setIsInitializing(false);
        return;
      }

      console.log("NFCeScanner: Solicitando permissão da câmera...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
      });

      console.log("NFCeScanner: Stream obtido:", stream);
      console.log("NFCeScanner: Verificando se videoRef existe...");

      if (videoRef.current) {
        console.log("NFCeScanner: videoRef existe, atribuindo stream...");
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        console.log(
          "NFCeScanner: Stream atribuído ao vídeo, aguardando onloadedmetadata..."
        );

        // Usar a mesma abordagem do QRScanner que funciona
        videoRef.current.onloadedmetadata = () => {
          console.log(
            "NFCeScanner: onloadedmetadata disparado, iniciando câmera..."
          );
          setIsCameraReady(true);
          setIsScanning(true);
          setIsInitializing(false);
          startQRDetection();
        };

        videoRef.current.onerror = (e) => {
          console.error("NFCeScanner: Erro no vídeo:", e);
          setError("Erro ao carregar o vídeo da câmera");
          setIsInitializing(false);
        };

        console.log(
          "NFCeScanner: Eventos configurados, iniciando verificação ativa..."
        );

        // Verificação ativa para dispositivos que não disparam onloadedmetadata
        const checkVideoReady = () => {
          console.log("NFCeScanner: Verificando se vídeo está pronto...");

          if (
            videoRef.current &&
            videoRef.current.videoWidth > 0 &&
            videoRef.current.videoHeight > 0
          ) {
            console.log(
              "NFCeScanner: Vídeo pronto detectado via polling, dimensões:",
              {
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
              }
            );
            setIsCameraReady(true);
            setIsScanning(true);
            setIsInitializing(false);
            startQRDetection();
            return;
          }

          // Se não estiver pronto, tentar novamente em 100ms
          console.log(
            "NFCeScanner: Vídeo ainda não pronto, tentando novamente em 100ms..."
          );
          setTimeout(checkVideoReady, 100);
        };

        // Iniciar verificação imediatamente
        console.log("NFCeScanner: Iniciando verificação ativa do vídeo...");
        checkVideoReady();

        // Fallback simples - aguardar um pouco e verificar
        setTimeout(() => {
          if (!isCameraReady && !error) {
            console.log(
              "NFCeScanner: Fallback - verificando se vídeo está pronto..."
            );
            if (videoRef.current && videoRef.current.videoWidth > 0) {
              console.log("NFCeScanner: Fallback funcionou, vídeo pronto");
              setIsCameraReady(true);
              setIsScanning(true);
              setIsInitializing(false);
              startQRDetection();
            } else {
              console.log(
                "NFCeScanner: Fallback falhou, aguardando verificação ativa..."
              );
            }
          }
        }, 2000);
      } else {
        console.log("NFCeScanner: videoRef não existe ainda, aguardando...");
        // Aguardar um pouco e tentar novamente
        setTimeout(() => {
          if (videoRef.current) {
            console.log(
              "NFCeScanner: videoRef agora existe, tentando novamente..."
            );
            startCamera();
          } else {
            console.error(
              "NFCeScanner: videoRef ainda não existe após timeout"
            );
            setError("Erro: elemento de vídeo não encontrado");
            setIsInitializing(false);
          }
        }, 1000); // Aumentado para 1 segundo
      }
    } catch (err: any) {
      console.error("NFCeScanner: Erro ao acessar câmera:", err);
      setIsInitializing(false);

      if (err.name === "NotAllowedError") {
        setError(
          "Permissão da câmera negada. Permita o acesso à câmera e tente novamente."
        );
      } else if (err.name === "NotFoundError") {
        setError(
          "Câmera não encontrada. Verifique se o dispositivo tem câmera."
        );
      } else if (err.name === "NotReadableError") {
        setError(
          "Câmera está sendo usada por outro aplicativo. Feche outros apps que usem a câmera."
        );
      } else {
        setError(`Erro ao acessar câmera: ${err.message}`);
      }
    }
  };

  const startQRDetection = () => {
    console.log("NFCeScanner: Iniciando detecção de QR Code...");

    // Evitar múltiplas chamadas simultâneas
    if (isScanning) {
      console.log("NFCeScanner: Detecção já está em andamento, ignorando...");
      return;
    }

    if (!videoRef.current || !canvasRef.current) {
      console.error("NFCeScanner: Refs não estão prontos");
      return;
    }

    const detectQR = () => {
      if (!videoRef.current || !canvasRef.current) {
        console.log("NFCeScanner: Refs não estão prontos");
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("NFCeScanner: Contexto do canvas não disponível");
        return;
      }

      // Verificar se o vídeo tem dimensões válidas
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.log("NFCeScanner: Vídeo ainda não tem dimensões válidas");
        animationFrameRef.current = requestAnimationFrame(detectQR);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      console.log(
        "NFCeScanner: Canvas dimensions:",
        canvas.width,
        "x",
        canvas.height
      );
      console.log(
        "NFCeScanner: ImageData dimensions:",
        imageData.width,
        "x",
        imageData.height
      );

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      console.log("NFCeScanner: jsQR result:", code);

      if (code) {
        console.log("NFCeScanner: QR Code detectado:", code.data);

        // Parar a detecção
        setIsScanning(false);
        stopCamera();

        // Verificar se é uma URL da SEFAZ
        if (code.data.includes("sefaz") && code.data.includes("gov.br")) {
          console.log("NFCeScanner: URL da SEFAZ válida detectada");
          setError(null);

          // Processar a NFC-e automaticamente
          processNFCE(code.data);
          return;
        } else {
          console.log(
            "NFCeScanner: QR Code não é da SEFAZ, mas permitindo processamento manual"
          );

          // Mostrar o conteúdo detectado e permitir processamento manual
          setDetectedContent(code.data);
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(detectQR);
    };

    detectQR();
  };

  const processNFCE = async (sefazUrl: string) => {
    try {
      setIsProcessing(true);

      console.log("NFCeScanner: processNFCE chamado com:", { sefazUrl });

      // Enviar apenas a URL da SEFAZ
      const requestBody = { sefazUrl };

      console.log("NFCeScanner: Enviando para processamento:", requestBody);

      const response = await fetch("/api/nfce/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = (await response.json()) as ScanResult;
      console.log("NFCeScanner: Resultado do processamento:", result);

      setScanResult(result);

      if (result.success) {
        toast.success(result.message);
        onScan(sefazUrl);
      } else {
        // Tratar diferentes tipos de erro
        if (result.error) {
          let errorMessage = result.message || result.error;

          // Mensagens específicas para diferentes tipos de erro
          if (result.notRegistered) {
            errorMessage = "Esta loja não está cadastrada no sistema.";
          } else if (result.alreadyProcessed) {
            errorMessage = "Esta nota fiscal já foi processada anteriormente.";
          }

          toast.error(errorMessage);
        } else {
          toast.error(
            result.message || "Erro desconhecido ao processar nota fiscal"
          );
        }
      }
    } catch (error) {
      console.error("Erro ao processar NFC-e:", error);

      let errorMessage = "Erro ao processar nota fiscal";

      // Tentar extrair mensagem de erro da resposta da API
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Se não conseguir fazer parse, usar a mensagem original
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);

      // Mostrar erro detalhado para debug
      setScanResult({
        success: false,
        message: `Erro ao processar: ${errorMessage}`,
        error: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const stopCamera = () => {
    console.log("NFCeScanner: Parando câmera...");

    // Limpar timeouts
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraReady(false);
    setIsScanning(false);
  };

  const handleRetry = () => {
    setError(null);
    setScanResult(null);
    stopCamera();
    setTimeout(startCamera, 500);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const getEstadoName = (codigo: string): string => {
    const estados: Record<string, string> = {
      "26": "Pernambuco (PE)",
      "25": "Paraíba (PB)",
      "35": "São Paulo (SP)",
      "33": "Rio de Janeiro (RJ)",
      "31": "Minas Gerais (MG)",
      "41": "Paraná (PR)",
      "42": "Santa Catarina (SC)",
      "43": "Rio Grande do Sul (RS)",
      "53": "Distrito Federal (DF)",
      "27": "Alagoas (AL)",
      "28": "Sergipe (SE)",
      "29": "Bahia (BA)",
      "21": "Maranhão (MA)",
      "22": "Piauí (PI)",
      "23": "Ceará (CE)",
      "24": "Rio Grande do Norte (RN)",
      "20": "Tocantins (TO)",
      "17": "Amapá (AP)",
      "16": "Amazonas (AM)",
      "15": "Pará (PA)",
      "14": "Rondônia (RO)",
      "13": "Acre (AC)",
      "12": "Roraima (RR)",
    };

    return estados[codigo] || `Estado ${codigo}`;
  };

  useEffect(() => {
    console.log("NFCeScanner: useEffect executado, aguardando videoRef...");

    // Aguardar o videoRef estar disponível
    const waitForVideoRef = () => {
      if (videoRef.current) {
        console.log("NFCeScanner: videoRef disponível, iniciando câmera...");
        startCamera();
      } else {
        console.log(
          "NFCeScanner: videoRef ainda não disponível, aguardando..."
        );
        setTimeout(waitForVideoRef, 100);
      }
    };

    waitForVideoRef();

    return () => {
      console.log("NFCeScanner: Componente desmontando, parando câmera...");
      stopCamera();
    };
  }, []);

  // Se temos um resultado, mostrar os detalhes
  if (scanResult) {
    console.log("NFCeScanner: Mostrando resultado:", scanResult);
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {scanResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            {scanResult.success
              ? "Nota Fiscal Válida!"
              : "Nota Fiscal Rejeitada"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`rounded-lg p-4 ${
              scanResult.success
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p
              className={`text-sm ${
                scanResult.success ? "text-green-800" : "text-red-800"
              }`}
            >
              {scanResult.message}
            </p>
          </div>

          {scanResult.success && (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Nota Fiscal Enviada com Sucesso!
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  {scanResult.message}
                </p>
              </div>

              {scanResult.storeName && (
                <div>
                  <span className="text-sm text-gray-600">Loja</span>
                  <p className="font-semibold">{scanResult.storeName}</p>
                </div>
              )}

              {scanResult.estimatedTime && (
                <div>
                  <span className="text-sm text-gray-600">Tempo Estimado</span>
                  <p className="font-semibold">{scanResult.estimatedTime}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Nota enviada para validação
                  </span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Nossa equipe irá validar a nota fiscal e creditar os pontos em
                  breve.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleRetry} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Escanear Outra
            </Button>
            <Button onClick={handleClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Se temos conteúdo detectado mas não é uma SEFAZ válida
  if (detectedContent) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            QR Code Detectado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Conteúdo detectado:</strong>
            </p>
            <p className="font-mono text-sm text-yellow-700 break-all bg-white p-2 rounded border">
              {detectedContent}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Status da Validação:</strong>
            </p>
            <p className="text-sm text-blue-700">
              Este QR Code foi detectado, mas não parece ser de uma nota fiscal
              da SEFAZ. Para processar uma nota fiscal, o QR code deve conter
              uma URL da SEFAZ (sefaz.gov.br).
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 mb-2">
              <strong>⚠️ Importante:</strong>
            </p>
            <p className="text-sm text-red-700">
              O sistema não processará dados mockados ou inválidos. Apenas notas
              fiscais reais da SEFAZ são aceitas para atribuição de pontos.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setDetectedContent(null);
                processNFCE(detectedContent);
              }}
              variant="outline"
              className="flex-1"
            >
              Tentar Processar (Não Recomendado)
            </Button>
            <Button onClick={handleRetry} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Escanear Outra
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Scanner de Nota Fiscal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Elemento de vídeo sempre presente */}
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-64 object-cover rounded-lg border-2 transition-all duration-300 ${
              isCameraReady
                ? "border-green-500 opacity-100"
                : "border-gray-300 opacity-0"
            }`}
          />

          {/* Indicador de câmera ativa */}
          {isCameraReady && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
              Câmera Ativa
            </div>
          )}
        </div>

        {/* Câmera inicializando */}
        {isInitializing && !isCameraReady && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Iniciando câmera...
            </p>
            <p className="text-sm text-gray-600">
              Aguarde enquanto configuramos sua câmera
            </p>
          </div>
        )}

        {/* Câmera com erro */}
        {error && !isInitializing && (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 text-red-500">
              <AlertTriangle className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Erro na câmera
            </p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRetry} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex gap-2">
          <Button onClick={handleRetry} variant="outline" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button onClick={handleClose} variant="outline" className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </div>

        {/* Botão de teste para debug */}
        {!isCameraReady && !isInitializing && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-xs text-yellow-800 mb-2">
              Debug - Câmera não inicializou:
            </p>
            <div className="space-y-1 text-xs text-yellow-700">
              <p>Status: {isCameraReady ? "✅ Pronta" : "❌ Não pronta"}</p>
              <p>Scanning: {isScanning ? "✅ Ativo" : "❌ Inativo"}</p>
              <p>Stream: {streamRef.current ? "✅ Ativo" : "❌ Inativo"}</p>
              <p>
                VideoRef: {videoRef.current ? "✅ Existe" : "❌ Não existe"}
              </p>
              {videoRef.current && (
                <p>
                  Dimensões: {videoRef.current.videoWidth} x{" "}
                  {videoRef.current.videoHeight}
                </p>
              )}
            </div>
            <Button
              onClick={handleRetry}
              size="sm"
              variant="outline"
              className="mt-2 w-full"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </CardContent>
    </Card>
  );
}
