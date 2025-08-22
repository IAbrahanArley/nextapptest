import { z } from "zod";

export const dashboardStatsSchema = z.object({
  storeId: z.string().uuid(),
});

export type DashboardStatsInput = z.infer<typeof dashboardStatsSchema>;



