"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Download, Calendar, TrendingUp, Users, CreditCard } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { getSubscription } from "@/lib/subscription"
import { getPlanById } from "@/lib/plans"

// Dados simulados para relatórios
const vendasPorMes = [
  { mes: "Jan", vendas: 12500, clientes: 45, transacoes: 156 },
  { mes: "Fev", vendas: 15200, clientes: 52, transacoes: 189 },
  { mes: "Mar", vendas: 18900, clientes: 61, transacoes: 234 },
  { mes: "Abr", vendas: 16800, clientes: 58, transacoes: 201 },
  { mes: "Mai", vendas: 21300, clientes: 67, transacoes: 267 },
  { mes: "Jun", vendas: 19500, clientes: 63, transacoes: 245 },
]

const clientesPorCategoria = [
  { categoria: "Novos", valor: 35, cor: "#3b82f6" },
  { categoria: "Recorrentes", valor: 45, cor: "#10b981" },
  { categoria: "VIP", valor: 20, cor: "#f59e0b" },
]

export default function RelatoriosPage() {
  const subscription = getSubscription("1")
  const currentPlan = getPlanById(subscription?.planId || "basic")

  const hasAdvancedReports = currentPlan?.limits.relatoriosAvancados || false

  if (!hasAdvancedReports) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análises detalhadas do seu programa de fidelidade</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Relatórios Avançados</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Faça upgrade para o plano Profissional ou Premium para acessar relatórios detalhados e análises avançadas
              do seu programa de fidelidade.
            </p>
            <div className="space-x-4">
              <Button>Fazer Upgrade</Button>
              <Button variant="outline" className="bg-transparent">
                Ver Planos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análises detalhadas do seu programa de fidelidade</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Calendar className="h-4 w-4 mr-2" />
            Período
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 104.200</div>
            <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">351</div>
            <p className="text-xs text-muted-foreground">+8% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Retenção</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI do Programa</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245%</div>
            <p className="text-xs text-muted-foreground">+15% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Vendas</CardTitle>
            <CardDescription>Vendas mensais e número de clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Clientes</CardTitle>
            <CardDescription>Segmentação por tipo de cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={clientesPorCategoria}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="valor"
                  label={({ categoria, valor }) => `${categoria}: ${valor}%`}
                >
                  {clientesPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Relatórios Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>Baixe relatórios detalhados em diferentes formatos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Relatório de Vendas</h4>
              <p className="text-sm text-gray-600 mb-4">Análise completa das vendas por período</p>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Análise de Clientes</h4>
              <p className="text-sm text-gray-600 mb-4">Comportamento e segmentação de clientes</p>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar Excel
              </Button>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">ROI do Programa</h4>
              <p className="text-sm text-gray-600 mb-4">Retorno sobre investimento detalhado</p>
              <Button size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
