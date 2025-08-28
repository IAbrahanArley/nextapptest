"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import jsQR from "jsqr";

export function QRTest() {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedQR, setDetectedQR] = useState<string | null>(null);
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
        setDetectedQR(code.data);
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
    setDetectedQR(null);
    setError(null);
    stopCamera();
    setTimeout(startCamera, 500);
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  if (detectedQR) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-green-600">QR Code Detectado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 break-all">{detectedQR}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleRetry} variant="outline" className="flex-1">
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
        <CardTitle>Teste de QR Code</CardTitle>
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
            <p className="text-sm text-blue-600">Escaneando QR Code...</p>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </CardContent>
    </Card>
  );
}


