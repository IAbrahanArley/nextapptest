CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "user_role" AS ENUM('customer', 'merchant', 'admin');
CREATE TYPE "transaction_type" AS ENUM('award', 'redeem', 'expire', 'adjustment');
CREATE TYPE "reward_type" AS ENUM('product', 'discount', 'coupon');
CREATE TYPE "redemption_status" AS ENUM('pending', 'completed', 'cancelled');

CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"name" varchar(256),
	"role" user_role NOT NULL DEFAULT 'customer',
	"cpf" varchar(14),
	"avatar_url" text,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	"oauth_provider" varchar(64),
	"oauth_provider_id" varchar(256),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" text,
	"logo_url" text,
	"currency" varchar(8) NOT NULL DEFAULT 'BRL',
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);

CREATE TABLE "store_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" uuid NOT NULL,
	"points_per_currency_unit" numeric(10,2) NOT NULL DEFAULT 1,
	"min_purchase_value_to_award" numeric(10,2) DEFAULT 0,
	"points_validity_days" integer,
	"extras" jsonb,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "user_store_balances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"points" integer NOT NULL DEFAULT 0,
	"reserved_points" integer NOT NULL DEFAULT 0,
	"updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "point_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"cpf" varchar(14),
	"store_id" uuid NOT NULL,
	"type" transaction_type NOT NULL,
	"amount" integer NOT NULL,
	"balance_after" integer,
	"reference" varchar(256),
	"metadata" jsonb,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"expires_at" timestamptz
);

CREATE TABLE "pending_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cpf" varchar(14) NOT NULL,
	"store_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"issued_at" timestamptz NOT NULL DEFAULT now(),
	"expires_at" timestamptz,
	"migrated" boolean NOT NULL DEFAULT false,
	"migrated_to_user_id" uuid,
	"metadata" jsonb
);

CREATE TABLE "rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"cost_points" integer NOT NULL,
	"quantity" integer,
	"type" reward_type NOT NULL DEFAULT 'product',
	"payload" jsonb,
	"active" boolean NOT NULL DEFAULT true,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "reward_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"reward_id" uuid NOT NULL,
	"cost_points" integer NOT NULL,
	"status" redemption_status NOT NULL DEFAULT 'pending',
	"metadata" jsonb,
	"created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"code" varchar(64) NOT NULL,
	"description" text,
	"discount_percent" integer,
	"discount_amount" numeric(10,2),
	"valid_from" timestamptz,
	"valid_until" timestamptz,
	"usage_limit" integer,
	"metadata" jsonb,
	"active" boolean NOT NULL DEFAULT true,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);

CREATE TABLE "coupon_redemptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coupon_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"order_reference" varchar(256),
	"created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"stripe_subscription_id" varchar(256) NOT NULL,
	"stripe_customer_id" varchar(256) NOT NULL,
	"status" varchar(64) NOT NULL,
	"plan_id" varchar(64) NOT NULL,
	"current_period_start" timestamptz,
	"current_period_end" timestamptz,
	"created_at" timestamptz NOT NULL DEFAULT now(),
	"updated_at" timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);

ALTER TABLE "stores" ADD CONSTRAINT "stores_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "store_settings" ADD CONSTRAINT "store_settings_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "user_store_balances" ADD CONSTRAINT "user_store_balances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "user_store_balances" ADD CONSTRAINT "user_store_balances_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "pending_points" ADD CONSTRAINT "pending_points_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "pending_points" ADD CONSTRAINT "pending_points_migrated_to_user_id_users_id_fk" FOREIGN KEY ("migrated_to_user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "reward_redemptions" ADD CONSTRAINT "reward_redemptions_reward_id_rewards_id_fk" FOREIGN KEY ("reward_id") REFERENCES "rewards"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE no action ON UPDATE no action;

