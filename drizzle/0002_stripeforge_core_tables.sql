-- Drizzle migration: StripeForge core entities

CREATE TABLE IF NOT EXISTS "merchant_accounts" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" TEXT NOT NULL,
  "business_email" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "merchant_account_members" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "merchant_account_id" TEXT NOT NULL REFERENCES "merchant_accounts"("id") ON DELETE CASCADE,
  "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "role" TEXT NOT NULL DEFAULT 'owner',
  "joined_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "merchant_account_member_user" UNIQUE ("merchant_account_id", "user_id")
);

CREATE TABLE IF NOT EXISTS "customers" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "merchant_account_id" TEXT NOT NULL REFERENCES "merchant_accounts"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "billing_address" TEXT,
  "payment_method_data" JSONB DEFAULT '{}',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "payments" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "merchant_account_id" TEXT NOT NULL REFERENCES "merchant_accounts"("id") ON DELETE CASCADE,
  "customer_id" TEXT NOT NULL REFERENCES "customers"("id") ON DELETE SET NULL,
  "amount" NUMERIC(12,2) NOT NULL,
  "currency" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'created',
  "source" TEXT,
  "reference" TEXT,
  "captured" BOOLEAN DEFAULT true,
  "refunded_amount" NUMERIC(12,2) DEFAULT 0.00,
  "description" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "invoices" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "merchant_account_id" TEXT NOT NULL REFERENCES "merchant_accounts"("id") ON DELETE CASCADE,
  "customer_id" TEXT NOT NULL REFERENCES "customers"("id") ON DELETE SET NULL,
  "payment_id" TEXT REFERENCES "payments"("id") ON DELETE SET NULL,
  "due_date" TIMESTAMPTZ NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "line_items" JSONB NOT NULL DEFAULT '[]',
  "total" NUMERIC(12,2) NOT NULL,
  "currency" TEXT NOT NULL,
  "notes" TEXT,
  "pdf_url" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "payouts" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "merchant_account_id" TEXT NOT NULL REFERENCES "merchant_accounts"("id") ON DELETE CASCADE,
  "amount" NUMERIC(12,2) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "destination" TEXT NOT NULL,
  "paid_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "activity_logs" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "merchant_account_id" TEXT NOT NULL REFERENCES "merchant_accounts"("id") ON DELETE CASCADE,
  "user_id" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "entity" TEXT NOT NULL,
  "entity_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "metadata" JSONB DEFAULT '{}',
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);