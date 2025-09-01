"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Sparkles,
  BarChart3,
  Calendar,
  TrendingUp,
  Users,
  CreditCard,
  Brain,
} from "lucide-react";
import Link from "next/link";

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Relatórios Inteligentes</h1>
        <p className="text-muted-foreground mt-2">
          Análises avançadas e insights baseados em IA para seu programa de
          fidelidade
        </p>
      </div>

      {/* Card Principal com Cadeado */}
      <Card className="text-center py-16 max-w-4xl mx-auto">
        <CardContent className="space-y-6">
          {/* Ícone do Cadeado */}
          <div className="relative inline-block">
            <Lock className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
            </div>
          </div>

          {/* Título e Descrição */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              Funcionalidade em Desenvolvimento
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Estamos trabalhando em relatórios inteligentes que usarão
              inteligência artificial para fornecer insights valiosos sobre seu
              programa de fidelidade.
            </p>
          </div>

          {/* Recursos Futuros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="text-left space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                Análise Preditiva
              </h3>
              <p className="text-sm text-muted-foreground">
                Previsões de comportamento do cliente e tendências de vendas
                usando machine learning
              </p>
            </div>

            <div className="text-left space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Insights Automáticos
              </h3>
              <p className="text-sm text-muted-foreground">
                Descoberta automática de padrões e recomendações personalizadas
                para otimização
              </p>
            </div>

            <div className="text-left space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Segmentação Inteligente
              </h3>
              <p className="text-sm text-muted-foreground">
                Agrupamento automático de clientes baseado em comportamento e
                preferências
              </p>
            </div>

            <div className="text-left space-y-3">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Relatórios Adaptativos
              </h3>
              <p className="text-sm text-muted-foreground">
                Relatórios que se ajustam automaticamente aos dados e objetivos
                do seu negócio
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Quer ser notificado quando esta funcionalidade estiver disponível?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Fila de Espera
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Roadmap
              </Button>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Desenvolvimento ativo com IA</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Recursos Temporários */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Recursos Temporários Disponíveis
          </CardTitle>
          <CardDescription>
            Enquanto desenvolvemos os relatórios inteligentes, você pode usar
            estas funcionalidades básicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <CreditCard className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Dashboard Básico</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Visão geral das métricas principais
              </p>
              <Link href="/dashboard-loja">
                <Button size="sm" variant="outline" className="w-full">
                  Acessar
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg p-4 text-center">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Lista de Clientes</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Gerenciamento de clientes cadastrados
              </p>
              <Link href="/dashboard-loja/clientes">
                <Button size="sm" variant="outline" className="w-full">
                  Acessar
                </Button>
              </Link>
            </div>

            <div className="border rounded-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Transações</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Histórico de transações e pontos
              </p>
              <Link href="/dashboard-loja/transacoes">
                <Button size="sm" variant="outline" className="w-full">
                  Acessar
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
