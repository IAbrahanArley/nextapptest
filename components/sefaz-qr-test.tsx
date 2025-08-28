"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import jsQR from "jsqr";

interface SEFAZTestResult {
  isValid: boolean;
  url: string;
  hostname: string;
  hasSefaz: boolean;
  hasGovBr: boolean;
  params: Record<string, string>;
  nfceAnalysis: any | null;
}

export function SEFAZQRTest() {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<SEFAZTestResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startCamera = async () => {
    try {
      setError(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("MediaDevices não suportado neste navegador");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
          setIsScanning(true);
          startQRDetection();
        };

        videoRef.current.onerror = () => {
          setError("Erro ao carregar o vídeo da câmera");
        };
      }
    } catch (err: any) {
      console.error("Erro ao acessar câmera:", err);

      if (err.name === "NotAllowedError") {
        setError("Permissão da câmera negada");
      } else if (err.name === "NotFoundError") {
        setError("Câmera não encontrada");
      } else if (err.name === "NotReadableError") {
        setError("Câmera está sendo usada por outro aplicativo");
      } else {
        setError(`Erro ao acessar câmera: ${err.message}`);
      }
    }
  };

  const analyzeSEFAZURL = (urlString: string): SEFAZTestResult => {
    try {
      const url = new URL(urlString);
      const params: Record<string, string> = {};

      // Extrair todos os parâmetros
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      // Verificar se é uma URL de nota fiscal
      const isNFCE =
        url.hostname.includes("sefaz") &&
        (url.pathname.includes("nfce") ||
          url.pathname.includes("consulta") ||
          url.pathname.includes("atf"));

      // Analisar o parâmetro 'p' se existir
      let nfceAnalysis = null;
      if (params.p) {
        nfceAnalysis = analyzeNFCEParams(params.p);
      }

      const result: SEFAZTestResult = {
        isValid: true,
        url: urlString,
        hostname: url.hostname,
        hasSefaz: url.hostname.includes("sefaz"),
        hasGovBr: url.hostname.includes("gov.br"),
        params,
        nfceAnalysis,
      };

      return result;
    } catch (error) {
      return {
        isValid: false,
        url: urlString,
        hostname: "N/A",
        hasSefaz: false,
        hasGovBr: false,
        params: {},
        nfceAnalysis: null,
      };
    }
  };

  const analyzeNFCEParams = (paramP: string) => {
    try {
      const parts = paramP.split("|");

      if (parts.length < 4) return null;

      const chaveAcesso = parts[0];
      const versao = parts[1];
      const ambiente = parts[2];
      const tipoEmissao = parts[3];
      const hash = parts[4] || "";

      if (chaveAcesso.length < 44) return null;

      const estado = chaveAcesso.substring(0, 2);
      const ano = chaveAcesso.substring(2, 4);
      const mes = chaveAcesso.substring(4, 6);
      const cnpj = chaveAcesso.substring(6, 20);
      const modelo = chaveAcesso.substring(20, 22);
      const serie = chaveAcesso.substring(22, 25);
      const numero = chaveAcesso.substring(25, 34);

      return {
        chaveAcesso,
        estado,
        ano,
        mes,
        cnpj,
        modelo,
        serie,
        numero,
        versao,
        ambiente,
        tipoEmissao,
        hash,
      };
    } catch (error) {
      return null;
    }
  };

  const startQRDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const detectQR = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      if (video.videoWidth === 0 || video.videoHeight === 0) {
        animationFrameRef.current = requestAnimationFrame(detectQR);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        console.log("QR Code detectado:", code.data);
        setTestResult(analyzeSEFAZURL(code.data));
        setIsScanning(false);
        stopCamera();
        return;
      }

      animationFrameRef.current = requestAnimationFrame(detectQR);
    };

    detectQR();
  };

  const stopCamera = () => {
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
    setTestResult(null);
    setError(null);
    stopCamera();
    setTimeout(startCamera, 500);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  if (testResult) {
    const isSEFAZValid = testResult.hasSefaz && testResult.hasGovBr;

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSEFAZValid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            Análise do QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`rounded-lg p-4 ${
              isSEFAZValid
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isSEFAZValid ? "default" : "destructive"}>
                {isSEFAZValid ? "✅ VÁLIDO" : "❌ INVÁLIDO"}
              </Badge>
              <span
                className={`font-medium ${
                  isSEFAZValid ? "text-green-800" : "text-red-800"
                }`}
              >
                {isSEFAZValid
                  ? "QR Code da SEFAZ detectado!"
                  : "Não é um QR Code da SEFAZ"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">URL Completa:</span>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
                {testResult.url}
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-600">Hostname:</span>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                {testResult.hostname}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Contém "sefaz":</span>
                <Badge variant={testResult.hasSefaz ? "default" : "secondary"}>
                  {testResult.hasSefaz ? "✅ Sim" : "❌ Não"}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">Contém "gov.br":</span>
                <Badge variant={testResult.hasGovBr ? "default" : "secondary"}>
                  {testResult.hasGovBr ? "✅ Sim" : "❌ Não"}
                </Badge>
              </div>
            </div>

            {Object.keys(testResult.params).length > 0 && (
              <div>
                <span className="text-sm text-gray-600">
                  Parâmetros da URL:
                </span>
                <div className="bg-gray-100 p-2 rounded space-y-1">
                  {Object.entries(testResult.params).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {testResult.nfceAnalysis && (
              <div>
                <span className="text-sm text-gray-600">
                  Análise da Nota Fiscal:
                </span>
                <div className="bg-blue-100 p-2 rounded space-y-1">
                  <div className="text-xs">
                    <span className="font-medium">Chave de Acesso:</span>{" "}
                    {testResult.nfceAnalysis.chaveAcesso}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Estado:</span>{" "}
                    {testResult.nfceAnalysis.estado}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Ano:</span>{" "}
                    {testResult.nfceAnalysis.ano}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Mês:</span>{" "}
                    {testResult.nfceAnalysis.mes}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">CNPJ:</span>{" "}
                    {testResult.nfceAnalysis.cnpj}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Modelo:</span>{" "}
                    {testResult.nfceAnalysis.modelo}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Série:</span>{" "}
                    {testResult.nfceAnalysis.serie}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Número:</span>{" "}
                    {testResult.nfceAnalysis.numero}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Versão:</span>{" "}
                    {testResult.nfceAnalysis.versao}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Ambiente:</span>{" "}
                    {testResult.nfceAnalysis.ambiente}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Tipo de Emissão:</span>{" "}
                    {testResult.nfceAnalysis.tipoEmissao}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Hash:</span>{" "}
                    {testResult.nfceAnalysis.hash}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRetry} className="flex-1">
              Escanear Outro
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Teste de QR Code SEFAZ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-64 object-cover rounded-lg border-2 ${
              isCameraReady ? "border-green-500" : "border-gray-300"
            }`}
          />

          {isCameraReady && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
              Câmera Ativa
            </div>
          )}
        </div>

        {error && (
          <div className="text-center py-4">
            <p className="text-red-600 mb-2">{error}</p>
            <Button onClick={handleRetry} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        )}

        {!isCameraReady && !error && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Iniciando câmera...</p>
          </div>
        )}

        {isScanning && (
          <div className="text-center py-2">
            <p className="text-sm text-blue-600">
              Escaneando QR Code da SEFAZ...
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Instruções:</strong> Aponte a câmera para um QR code de nota
            fiscal da SEFAZ. O sistema analisará se é válido para processamento.
          </p>
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </CardContent>
    </Card>
  );
}
