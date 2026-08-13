-- ============================================================================
-- Migration 002: Payment Sessions Hardening (Issue #14)
-- Adds idempotency, refund tracking, webhook event tracking table, and failure columns.
-- Run on Supabase BEFORE deploying the new backend code.
-- ============================================================================

-- Idempotency key: prevents duplicate Razorpay orders for the same cart checkout
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_sessions_idempotency_key
  ON payment_sessions (idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Refund tracking
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS refund_id TEXT;
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS refund_status TEXT;
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS refund_amount NUMERIC;
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS refund_reason TEXT;
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS refund_created_at TIMESTAMPTZ;

-- Webhook event tracking on payment_sessions
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS webhook_event_id TEXT;
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS webhook_verified_at TIMESTAMPTZ;

-- Failure reason tracking
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS failure_reason TEXT;

-- Processed Webhook Events Table (Deduplication)
CREATE TABLE IF NOT EXISTS processed_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);
