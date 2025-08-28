"use client";

import { useState } from "react";
import { useSubscription } from "@/hooks/queries/use-subscription";
import { useSubscriptionUsage } from "@/hooks/queries/use-subscription-usage";
import { useCancelSubscription } from "@/hooks/mutations/use-cancel-subscription";
import { useChangePlan } from "@/hooks/mutations/use-change-plan";
import { useToast } from "@/hooks/use-toast";
import { getPlanById } from "@/lib/plans";
import {
  Header,
  CurrentPlanCard,
  ResourceUsageCard,
  AvailablePlansCard,
  PaymentHistoryCard,
  SubscriptionActionsCard,
  NoSubscriptionCard,
  CancelSubscriptionDialog,
} from "./components";

export default function AssinaturaPage() {
  const { data: subscriptionData, isLoading: isLoadingSubscription } =
    useSubscription();
  const { data: usageData, isLoading: isLoadingUsage } = useSubscriptionUsage();
  const cancelSubscription = useCancelSubscription();
  const changePlan = useChangePlan();
  const { toast } = useToast();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(true);

  if (isLoadingSubscription || isLoadingUsage) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Carregando assinatura...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <NoSubscriptionCard />
        </div>
      </div>
    );
  }

  const currentPlan = getPlanById(subscriptionData.subscription.planId);
  if (!currentPlan) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center py-12">
            <div className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4">
              <svg
                className="w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Plano não encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              O plano da sua assinatura não foi encontrado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCancelSubscription = () => {
    cancelSubscription.mutate({ cancelAtPeriodEnd });
    setShowCancelDialog(false);
  };

  const handleChangePlan = (newPlanId: string) => {
    changePlan.mutate({ newPlanId });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        <Header />

        <div className="space-y-8">
          <CurrentPlanCard subscriptionData={subscriptionData} />

          {usageData && (
            <ResourceUsageCard
              usageData={usageData}
              subscriptionData={subscriptionData}
            />
          )}

          <AvailablePlansCard
            subscriptionData={subscriptionData}
            onPlanChange={handleChangePlan}
            isChangingPlan={changePlan.isPending}
          />

          <PaymentHistoryCard
            paymentHistory={subscriptionData.paymentHistory}
          />

          <SubscriptionActionsCard
            onCancelSubscription={() => setShowCancelDialog(true)}
            isCancelling={cancelSubscription.isPending}
          />
        </div>

        <CancelSubscriptionDialog
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          onConfirm={handleCancelSubscription}
          cancelAtPeriodEnd={cancelAtPeriodEnd}
        />
      </div>
    </div>
  );
}
