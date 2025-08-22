import { relations } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  numeric,
  json,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";

/* ================================
   ENUMS
================================= */
export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "merchant",
  "admin",
]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "award",
  "redeem",
  "expire",
  "adjustment",
]);

export const rewardTypeEnum = pgEnum("reward_type", [
  "product",
  "discount",
  "coupon",
]);

export const redemptionStatusEnum = pgEnum("redemption_status", [
  "pending",
  "completed",
  "cancelled",
  "expired",
  "validated",
]);

export const redemptionValidationStatusEnum = pgEnum(
  "redemption_validation_status",
  ["pending", "validated", "rejected", "expired"]
);

/* ================================
   USER / AUTH TABLES
================================= */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 256 }),
  role: userRoleEnum("role").notNull().default("customer"),
  cpf: varchar("cpf", { length: 14 }),
  phone: varchar("phone", { length: 20 }),
  avatar_url: text("avatar_url"),
  password_hash: text("password_hash"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  oauth_provider: varchar("oauth_provider", { length: 64 }),
  oauth_provider_id: varchar("oauth_provider_id", { length: 256 }),
});

/* ================================
   STORE TABLES
================================= */
export const stores = pgTable("stores", {
  id: uuid("id").primaryKey().defaultRandom(),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: text("description"),
  logo_url: text("logo_url"),
  banner_url: text("banner_url"),
  cnpj: varchar("cnpj", { length: 18 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  website: text("website"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  whatsapp: text("whatsapp"),
  currency: varchar("currency", { length: 8 }).notNull().default("BRL"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const store_settings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  store_id: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  points_per_currency_unit: numeric("points_per_currency_unit", {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default("1"),
  min_purchase_value_to_award: numeric("min_purchase_value_to_award", {
    precision: 10,
    scale: 2,
  }).default("0"),
  points_validity_days: integer("points_validity_days").notNull().default(365),
  notification_whatsapp: boolean("notification_whatsapp")
    .notNull()
    .default(false),
  notification_email: boolean("notification_email").notNull().default(false),
  notification_expiration: boolean("notification_expiration")
    .notNull()
    .default(false),
  extras: json("extras"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

/* ================================
   POINTS / BALANCE TABLES
================================= */
export const user_store_balances = pgTable("user_store_balances", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  store_id: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  points: integer("points").notNull().default(0),
  reserved_points: integer("reserved_points").notNull().default(0),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const point_transactions = pgTable("point_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id),
  cpf: varchar("cpf", { length: 14 }),
  store_id: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  type: transactionTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  balance_after: integer("balance_after"),
  reference: varchar("reference", { length: 256 }),
  metadata: json("metadata"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  expires_at: timestamp("expires_at"),
});

export const pending_points = pgTable("pending_points", {
  id: uuid("id").primaryKey().defaultRandom(),
  cpf: varchar("cpf", { length: 14 }).notNull(),
  store_id: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  amount: integer("amount").notNull(),
  issued_at: timestamp("issued_at").defaultNow().notNull(),
  expires_at: timestamp("expires_at"),
  migrated: boolean("migrated").notNull().default(false),
  migrated_to_user_id: uuid("migrated_to_user_id").references(() => users.id),
  metadata: json("metadata"),
});

/* ================================
   REWARDS TABLES
================================= */
export const rewards = pgTable("rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  store_id: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  cost_points: integer("cost_points").notNull(),
  quantity: integer("quantity"),
  type: rewardTypeEnum("type").notNull().default("product"),
  payload: json("payload"),
  active: boolean("active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  redemption_validity_days: integer("redemption_validity_days")
    .notNull()
    .default(30),
  redemption_qr_code: text("redemption_qr_code"),
});

export const reward_redemptions = pgTable("reward_redemptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  store_id: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  reward_id: uuid("reward_id")
    .notNull()
    .references(() => rewards.id),
  cost_points: integer("cost_points").notNull(),
  status: redemptionStatusEnum("status").notNull().default("pending"),
  validation_status: redemptionValidationStatusEnum("validation_status")
    .notNull()
    .default("pending"),
  redeemed_at: timestamp("redeemed_at"),
  qr_code: text("qr_code"),
  metadata: json("metadata"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const reward_redemption_qr_codes = pgTable(
  "reward_redemption_qr_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    redemption_id: uuid("redemption_id")
      .notNull()
      .references(() => reward_redemptions.id),
    qr_code: text("qr_code").notNull().unique(),
    verification_code: varchar("verification_code", { length: 12 })
      .notNull()
      .unique(),
    expires_at: timestamp("expires_at").notNull(),
    is_used: boolean("is_used").notNull().default(false),
    used_at: timestamp("used_at"),
    validated_by_store: boolean("validated_by_store").notNull().default(false),
    validated_at: timestamp("validated_at"),
    store_validation_metadata: json("store_validation_metadata"),
    created_at: timestamp("created_at").defaultNow().notNull(),
  }
);

/* ================================
   COUPONS TABLES
================================= */
export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  store_id: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  code: varchar("code", { length: 64 }).notNull().unique(),
  description: text("description"),
  discount_percent: integer("discount_percent"),
  discount_amount: numeric("discount_amount", { precision: 10, scale: 2 }),
  valid_from: timestamp("valid_from"),
  valid_until: timestamp("valid_until"),
  usage_limit: integer("usage_limit"),
  metadata: json("metadata"),
  active: boolean("active").notNull().default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const coupon_redemptions = pgTable("coupon_redemptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  coupon_id: uuid("coupon_id")
    .notNull()
    .references(() => coupons.id),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  store_id: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  order_reference: varchar("order_reference", { length: 256 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

/* ================================
   SUBSCRIPTION TABLES
================================= */
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id),
  store_id: uuid("store_id")
    .notNull()
    .references(() => stores.id),
  stripe_subscription_id: varchar("stripe_subscription_id", { length: 256 })
    .notNull()
    .unique(),
  stripe_customer_id: varchar("stripe_customer_id", { length: 256 }).notNull(),
  status: varchar("status", { length: 64 }).notNull(),
  plan_id: varchar("plan_id", { length: 64 }).notNull(),
  current_period_start: timestamp("current_period_start"),
  current_period_end: timestamp("current_period_end"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

/* ================================
   RELATIONS
================================= */
export const usersRelations = relations(users, ({ many, one }) => ({
  stores: many(stores),
  userStoreBalances: many(user_store_balances),
  pointTransactions: many(point_transactions),
  rewardRedemptions: many(reward_redemptions),
  couponRedemptions: many(coupon_redemptions),
  subscriptions: many(subscriptions),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, {
    fields: [stores.owner_id],
    references: [users.id],
  }),
  settings: one(store_settings, {
    fields: [stores.id],
    references: [store_settings.store_id],
  }),
  userStoreBalances: many(user_store_balances),
  pointTransactions: many(point_transactions),
  pendingPoints: many(pending_points),
  rewards: many(rewards),
  rewardRedemptions: many(reward_redemptions),
  coupons: many(coupons),
  couponRedemptions: many(coupon_redemptions),
  subscriptions: many(subscriptions),
}));

export const storeSettingsRelations = relations(store_settings, ({ one }) => ({
  store: one(stores, {
    fields: [store_settings.store_id],
    references: [stores.id],
  }),
}));

export const userStoreBalancesRelations = relations(
  user_store_balances,
  ({ one }) => ({
    user: one(users, {
      fields: [user_store_balances.user_id],
      references: [users.id],
    }),
    store: one(stores, {
      fields: [user_store_balances.store_id],
      references: [stores.id],
    }),
  })
);

export const pointTransactionsRelations = relations(
  point_transactions,
  ({ one }) => ({
    user: one(users, {
      fields: [point_transactions.user_id],
      references: [users.id],
    }),
    store: one(stores, {
      fields: [point_transactions.store_id],
      references: [stores.id],
    }),
  })
);

export const pendingPointsRelations = relations(pending_points, ({ one }) => ({
  store: one(stores, {
    fields: [pending_points.store_id],
    references: [stores.id],
  }),
  migratedToUser: one(users, {
    fields: [pending_points.migrated_to_user_id],
    references: [users.id],
  }),
}));

export const rewardsRelations = relations(rewards, ({ one, many }) => ({
  store: one(stores, {
    fields: [rewards.store_id],
    references: [stores.id],
  }),
  redemptions: many(reward_redemptions),
}));

export const rewardRedemptionsRelations = relations(
  reward_redemptions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [reward_redemptions.user_id],
      references: [users.id],
    }),
    store: one(stores, {
      fields: [reward_redemptions.store_id],
      references: [stores.id],
    }),
    reward: one(rewards, {
      fields: [reward_redemptions.reward_id],
      references: [rewards.id],
    }),
    qrCodes: many(reward_redemption_qr_codes),
  })
);

export const rewardRedemptionQrCodesRelations = relations(
  reward_redemption_qr_codes,
  ({ one }) => ({
    redemption: one(reward_redemptions, {
      fields: [reward_redemption_qr_codes.redemption_id],
      references: [reward_redemptions.id],
    }),
  })
);

export const couponsRelations = relations(coupons, ({ one, many }) => ({
  store: one(stores, {
    fields: [coupons.store_id],
    references: [stores.id],
  }),
  redemptions: many(coupon_redemptions),
}));

export const couponRedemptionsRelations = relations(
  coupon_redemptions,
  ({ one }) => ({
    coupon: one(coupons, {
      fields: [coupon_redemptions.coupon_id],
      references: [coupons.id],
    }),
    user: one(users, {
      fields: [coupon_redemptions.user_id],
      references: [users.id],
    }),
    store: one(stores, {
      fields: [coupon_redemptions.store_id],
      references: [stores.id],
    }),
  })
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.user_id],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [subscriptions.store_id],
    references: [stores.id],
  }),
}));

/* ================================
   TYPES
================================= */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

export type StoreSetting = typeof store_settings.$inferSelect;
export type NewStoreSetting = typeof store_settings.$inferInsert;

export type UserStoreBalance = typeof user_store_balances.$inferSelect;
export type NewUserStoreBalance = typeof user_store_balances.$inferInsert;

export type PointTransaction = typeof point_transactions.$inferSelect;
export type NewPointTransaction = typeof point_transactions.$inferInsert;

export type PendingPoint = typeof pending_points.$inferSelect;
export type NewPendingPoint = typeof pending_points.$inferInsert;

export type Reward = typeof rewards.$inferSelect;
export type NewReward = typeof rewards.$inferInsert;

export type RewardRedemption = typeof reward_redemptions.$inferSelect;
export type NewRewardRedemption = typeof reward_redemptions.$inferInsert;

export type RewardRedemptionQrCode =
  typeof reward_redemption_qr_codes.$inferSelect;
export type NewRewardRedemptionQrCode =
  typeof reward_redemption_qr_codes.$inferInsert;

export type Coupon = typeof coupons.$inferSelect;
export type NewCoupon = typeof coupons.$inferInsert;

export type CouponRedemption = typeof coupon_redemptions.$inferSelect;
export type NewCouponRedemption = typeof coupon_redemptions.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
