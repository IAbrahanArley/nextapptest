"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, AlertTriangle, RefreshCw } from "lucide-react";
import jsQR from "jsqr";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  storeId: string;
}

export function QRScanner({ onScan, onClose, storeId }: QRScannerProps) {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<any>(null);
  const [scanAttempts, setScanAttempts] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      setIsCameraReady(false);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Câmera não suportada neste navegador");
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
      if (err.name === "NotAllowedError") {
        setError("Permissão da câmera negada");
      } else if (err.name === "NotFoundError") {
        setError("Câmera não encontrada");
      } else {
        setError(`Erro ao acessar câmera: ${err.message}`);
      }
    }
  };

  const startQRDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const detectQR = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        try {
          const qrData = JSON.parse(code.data);

          if (!qrData.redemption_id || !qrData.store_id) {
            setScanAttempts((prev) => prev + 1);
            animationFrameRef.current = requestAnimationFrame(detectQR);
            return;
          }

          if (qrData.store_id !== storeId) {
            setError("QR code não pertence a esta loja");
            setScanAttempts((prev) => prev + 1);
            animationFrameRef.current = requestAnimationFrame(detectQR);
            return;
          }

          setScannedData(qrData);
          setError(null);
          setIsScanning(false);
          setScanAttempts(0);
          stopCamera();

          setTimeout(() => {
            onScan(code.data);
          }, 1000);

          return;
        } catch (parseError) {
          setScanAttempts((prev) => prev + 1);
          animationFrameRef.current = requestAnimationFrame(detectQR);
          return;
        }
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
    setError(null);
    setScannedData(null);
    setScanAttempts(0);
    stopCamera();
    setTimeout(startCamera, 500);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  if (scannedData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-green-600">QR Code Detectado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              QR code escaneado com sucesso! Processando...
            </p>
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
          Scanner de QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCameraReady ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Iniciando câmera...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border-2 border-blue-500"
                style={{ maxHeight: "400px" }}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Posicione o QR code na área da câmera
              </p>
              {scanAttempts > 0 && (
                <p className="text-xs text-gray-500">
                  Tentativas: {scanAttempts}
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="font-medium text-red-800">Erro</span>
            </div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleRetry} variant="outline" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Fechar
          </Button>
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </CardContent>
    </Card>
  );
}
