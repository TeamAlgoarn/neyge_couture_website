-- Explicit transactional WhatsApp consent for Preview/Staging profiles.
-- Review before running. This migration does not touch Supabase Auth tables.

ALTER TABLE preview.profiles
    ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS whatsapp_opt_in_at TIMESTAMPTZ NULL,
    ADD COLUMN IF NOT EXISTS whatsapp_opt_in_source TEXT NULL;

-- Fail closed for any column that may have existed without the intended default.
UPDATE preview.profiles
SET whatsapp_opt_in = FALSE
WHERE whatsapp_opt_in IS NULL;

ALTER TABLE preview.profiles
    ALTER COLUMN whatsapp_opt_in SET DEFAULT FALSE,
    ALTER COLUMN whatsapp_opt_in SET NOT NULL;

DO $migration$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint AS constraint_record
        JOIN pg_class AS table_record
          ON table_record.oid = constraint_record.conrelid
        JOIN pg_namespace AS schema_record
          ON schema_record.oid = table_record.relnamespace
        WHERE constraint_record.conname = 'profiles_whatsapp_opt_in_source_check'
          AND table_record.relname = 'profiles'
          AND schema_record.nspname = 'preview'
    ) THEN
        ALTER TABLE preview.profiles
            ADD CONSTRAINT profiles_whatsapp_opt_in_source_check
            CHECK (
                whatsapp_opt_in_source IS NULL
                OR whatsapp_opt_in_source IN ('checkout', 'profile', 'admin_import')
            );
    END IF;
END
$migration$;
