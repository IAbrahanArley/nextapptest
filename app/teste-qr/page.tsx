"use client";

import { QRTest } from "@/components/qr-test";
import { SEFAZQRTest } from "@/components/sefaz-qr-test";
import { NFCeScanner } from "@/components/nfce-scanner";

export default function TesteQRPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Teste do Sistema de QR Codes
          </h1>
          <p className="text-gray-600">
            Teste a funcionalidade de leitura de QR codes e NFC-e
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Teste Básico de QR Code
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Detecta qualquer QR code e mostra o conteúdo
            </p>
            <QRTest />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Validador SEFAZ
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Analisa se o QR code é de uma nota fiscal válida da SEFAZ
            </p>
            <SEFAZQRTest />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Scanner NFC-e Completo
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Sistema completo de processamento de notas fiscais
            </p>
            <NFCeScanner
              onScan={(data) => {
                console.log("QR Code escaneado:", data);
                alert(`QR Code detectado: ${data}`);
              }}
              onClose={() => {
                console.log("Scanner fechado");
              }}
              storeId="auto"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Instruções de Teste
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>1. Teste Básico:</strong> Use qualquer QR code para
              verificar se a detecção está funcionando
            </p>
            <p>
              <strong>2. Validador SEFAZ:</strong> Teste especificamente com QR
              codes de notas fiscais para validação
            </p>
            <p>
              <strong>3. Scanner Completo:</strong> Teste o sistema completo de
              processamento
            </p>
            <p>
              <strong>4. Verificação:</strong> O sistema agora detecta qualquer
              QR code e mostra o conteúdo
            </p>
            <p>
              <strong>5. Validação Real:</strong> Apenas QR codes da SEFAZ são
              aceitos para processamento
            </p>
            <p className="text-red-600 font-medium">
              <strong>⚠️ IMPORTANTE:</strong> Dados mockados foram removidos. O
              sistema só processa notas fiscais reais.
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">
            🔍 Debug e Solução de Problemas
          </h4>
          <div className="space-y-2 text-sm text-yellow-700">
            <p>
              <strong>Problema:</strong> Sistema retornava dados falsos (CNPJ:
              12345678000199, Valor: 50.00)
            </p>
            <p>
              <strong>Solução:</strong> Removidos dados mockados, implementada
              validação real
            </p>
            <p>
              <strong>Resultado:</strong> Apenas QR codes válidos da SEFAZ são
              processados
            </p>
            <p>
              <strong>Teste:</strong> Use o "Validador SEFAZ" para verificar se
              seu QR code é válido
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
