"use client";

import { Mail, Phone, MessageCircle, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function SuportePage() {
  return (
    <div className="min-h-screen bg-gradient-primary py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Precisa de
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              {" "}
              Ajuda?{" "}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Nossa equipe está aqui para ajudar você a resolver qualquer problema
          </p>
        </div>

        {/* Canais de Suporte */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Email */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Suporte por Email</h3>
              <p className="text-2xl font-bold text-primary mb-4">
                suporte@loyalty.com
              </p>
              <Button asChild className="w-full">
                <a href="mailto:suporte@loyalty.com">Enviar Email</a>
              </Button>
            </CardHeader>
          </Card>

          {/* WhatsApp */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <MessageCircle className="h-6 w-6" />
                </div>
              </div>
              <CardTitle>WhatsApp</CardTitle>
              <CardDescription>Atendimento rápido via WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-2xl font-bold text-primary mb-4">
                (11) 99999-9999
              </p>
              <Button asChild className="w-full" variant="outline">
                <a href="https://wa.me/5511999999999">Abrir WhatsApp</a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">Perguntas Frequentes</CardTitle>
            <CardDescription>
              Respostas para as dúvidas mais comuns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">
                  Como funciona o sistema de pontos?
                </h3>
                <p className="text-muted-foreground">
                  Os clientes acumulam pontos ao fazer compras em sua loja. Cada
                  real gasto pode gerar um ponto, dependendo da sua
                  configuração.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">
                  Posso alterar meu plano a qualquer momento?
                </h3>
                <p className="text-muted-foreground">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a
                  qualquer momento. As alterações entram em vigor no próximo
                  ciclo de cobrança.
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">
                  Como cadastrar meus clientes?
                </h3>
                <p className="text-muted-foreground">
                  Você pode cadastrar clientes manualmente através do dashboard
                  ou eles podem se cadastrar automaticamente ao usar o sistema
                  pela primeira vez.
                </p>
              </div>

              <div className="pb-4">
                <h3 className="font-semibold mb-2">
                  O sistema funciona offline?
                </h3>
                <p className="text-muted-foreground">
                  O sistema principal funciona online, mas você pode configurar
                  sincronização para funcionar mesmo com instabilidades de
                  conexão.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horário de Atendimento */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <CardTitle>Horário de Atendimento</CardTitle>
            <CardDescription>
              Estamos disponíveis nos seguintes horários
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Segunda a Sexta</h3>
                <p className="text-muted-foreground">8h às 18h</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sábados</h3>
                <p className="text-muted-foreground">9h às 14h</p>
              </div>
            </div>
            <div className="mt-6">
              <Badge variant="outline" className="text-sm">
                <Clock className="w-3 h-3 mr-1" />
                Resposta em até 2 horas
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Voltar */}
        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/dashboard-loja">Voltar ao Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
