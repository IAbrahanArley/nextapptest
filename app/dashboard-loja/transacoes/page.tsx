"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/queries/use-transactions";
import { useTransactionsStats } from "@/hooks/queries/use-transactions-stats";
import {
  Header,
  StatsCards,
  SearchFilters,
  TransactionsList,
  Pagination,
} from "./components";

interface TransactionStats {
  totalPontos?: number;
  totalVendas?: number;
  transacoesHoje?: number;
}

export default function TransacoesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    error: transactionsError,
  } = useTransactions({
    page: currentPage,
    limit: 20,
    search: searchTerm || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useTransactionsStats();

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (transactionsError || statsError) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Erro ao carregar dados das transações
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const transactions = transactionsData?.transactions || [];
  const stats = (statsData as TransactionStats) || {};
  const totalPages = transactionsData?.totalPages || 1;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <Header />

        <StatsCards
          totalPontos={stats.totalPontos || 0}
          totalVendas={stats.totalVendas || 0}
          transacoesHoje={stats.transacoesHoje || 0}
        />

        <SearchFilters
          searchTerm={searchTerm}
          startDate={startDate}
          endDate={endDate}
          onSearchTermChange={setSearchTerm}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onSearch={handleSearch}
        />

        <TransactionsList
          transactions={transactions}
          total={transactionsData?.total || 0}
          isLoading={isLoadingTransactions || isLoadingStats}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
