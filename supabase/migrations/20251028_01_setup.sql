-- Enable necessary extensions
-- Note: uuid-ossp is already enabled by default in Supabase
-- pg_crypto is not needed as we'll use built-in auth

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'agent', 'viewer');
    CREATE TYPE loan_status AS ENUM ('pending', 'active', 'overdue', 'paid', 'defaulted', 'liquidated');
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
    CREATE TYPE payment_type AS ENUM ('cash', 'bank_transfer', 'mobile_money', 'card');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;