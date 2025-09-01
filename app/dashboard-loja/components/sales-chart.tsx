"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Registrar os componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  monthlyData: any[];
}

export function SalesChart({ monthlyData }: SalesChartProps) {
  // Gerar sempre 6 meses (mesmo sem dados)
  const generateSixMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      // CORRIGIDO: Usar formato inglês para corresponder aos dados da API
      const monthName = date.toLocaleDateString("en-US", { month: "short" });
      months.push(monthName);
    }

    return months;
  };

  const sixMonths = generateSixMonths();
  const hasValidData =
    monthlyData && Array.isArray(monthlyData) && monthlyData.length > 0;

  // Preparar dados para os gráficos (sempre 6 meses)
  const prepareChartData = () => {
    const monthData = new Map();

    // Mapear dados existentes
    if (hasValidData) {
      monthlyData.forEach((item) => {
        monthData.set(item.month, {
          vendas: Number(item.vendas || 0),
          pontos: Number(item.pontos || 0),
        });
      });
    }

    // Preencher todos os 6 meses (0 se não houver dados)
    const chartData = sixMonths.map((month) => ({
      month,
      vendas: monthData.get(month)?.vendas || 0,
      pontos: monthData.get(month)?.pontos || 0,
    }));

    return chartData;
  };

  const chartData = prepareChartData();

  const salesChartData = {
    labels: chartData.map((item) => item.month),
    datasets: [
      {
        label: "Vendas",
        data: chartData.map((item) => item.vendas),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Configuração do gráfico de pontos
  const pointsChartData = {
    labels: chartData.map((item) => item.month),
    datasets: [
      {
        label: "Pontos",
        data: chartData.map((item) => item.pontos),
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Opções comuns para os gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgb(156 163 175)",
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        ticks: {
          color: "rgb(156 163 175)",
        },
      },
      x: {
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        ticks: {
          color: "rgb(156 163 175)",
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas e Pontos</CardTitle>
        <CardDescription>
          Evolução mensal das vendas e pontos distribuídos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Gráfico de Vendas */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Evolução das Vendas
            </h3>
            <div className="w-full h-[300px] min-h-[300px]">
              <Bar data={salesChartData} options={chartOptions} />
            </div>
          </div>

          {/* Gráfico de Pontos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Evolução dos Pontos
            </h3>
            <div className="w-full h-[300px] min-h-[300px]">
              <Bar data={pointsChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
