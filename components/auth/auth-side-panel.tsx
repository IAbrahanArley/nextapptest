"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";

interface AuthSidePanelProps {
  title?: string;
  subtitle?: string;
  features?: Array<{
    text: string;
    color: string;
  }>;
  footerText?: string;
}

export default function AuthSidePanel({
  title = "BranlyClub",
  subtitle = "O futuro da fidelização digital",
  features = [
    {
      text: "Pontos Inteligentes",
      color: "bg-blue-500/20 text-blue-100 border-blue-400/30",
    },
    {
      text: "Analytics",
      color: "bg-purple-500/20 text-purple-100 border-purple-400/30",
    },
    {
      text: "Integração Simples",
      color: "bg-green-500/20 text-green-100 border-green-400/30",
    },
    {
      text: "24/7",
      color: "bg-orange-500/20 text-orange-100 border-orange-400/30",
    },
  ],
  footerText = "Junte-se a milhares de empresas que já transformaram seus clientes em fãs leais com o BranlyClub",
}: AuthSidePanelProps) {
  return (
    <div className="w-2/3 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 bg-black/80 z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/mulherempresaria.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Conteúdo sobreposto */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-white text-center px-12">
        {/* Badges coloridas */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {features.map((feature, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`px-4 py-2 text-sm font-semibold border-2 ${feature.color}`}
            >
              {feature.text}
            </Badge>
          ))}
        </div>

        <div className="mb-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-xl text-blue-100">{subtitle}</p>
        </div>

        <div className="text-center">
          <p className="text-blue-100 text-sm leading-relaxed max-w-md">
            {footerText}
          </p>
        </div>
      </div>
    </div>
  );
}
