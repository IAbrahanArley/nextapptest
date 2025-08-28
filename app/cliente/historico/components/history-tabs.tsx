import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionsTab } from "./transactions-tab";
import { RedemptionsTab } from "./redemptions-tab";
import { Transaction, RewardRedemption } from "../types";

interface HistoryTabsProps {
  transactions: Transaction[];
  rewardRedemptions: RewardRedemption[];
}

export function HistoryTabs({
  transactions,
  rewardRedemptions,
}: HistoryTabsProps) {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid w-full grid-cols-2 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <TabsTrigger
          value="transactions"
          className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
        >
          Transações de Pontos
        </TabsTrigger>
        <TabsTrigger
          value="redemptions"
          className="text-gray-900 dark:text-gray-100 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
        >
          Resgates de Prêmios
        </TabsTrigger>
      </TabsList>

      <TabsContent value="transactions" className="space-y-6 mt-6">
        <TransactionsTab transactions={transactions} />
      </TabsContent>

      <TabsContent value="redemptions" className="space-y-6 mt-6">
        <RedemptionsTab rewardRedemptions={rewardRedemptions} />
      </TabsContent>
    </Tabs>
  );
}


