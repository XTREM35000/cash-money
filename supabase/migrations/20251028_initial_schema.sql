-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_crypto";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'agent', 'viewer');
    CREATE TYPE loan_status AS ENUM ('pending', 'active', 'overdue', 'paid', 'defaulted', 'liquidated');
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
    CREATE TYPE payment_type AS ENUM ('cash', 'bank_transfer', 'mobile_money', 'card');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable Row Level Security
ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'agent',
    phone_number TEXT,
    email TEXT,
    branch_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create branches table
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Côte d''Ivoire',
    phone TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES public.branches(id),
    full_name TEXT NOT NULL,
    id_type TEXT,
    id_number TEXT,
    phone_number TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    occupation TEXT,
    date_of_birth DATE,
    risk_level INT DEFAULT 0,
    total_loans INT DEFAULT 0,
    active_loans INT DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(id_type, id_number)
);

-- Create object_categories table
CREATE TABLE IF NOT EXISTS public.object_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    min_loan_percentage DECIMAL(5,2),
    max_loan_percentage DECIMAL(5,2),
    interest_rate DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create objects table
CREATE TABLE IF NOT EXISTS public.objects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id),
    category_id UUID REFERENCES public.object_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    serial_number TEXT,
    estimated_value DECIMAL(12,2) NOT NULL,
    max_loan_value DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'available',
    condition_notes TEXT,
    storage_location TEXT,
    photos TEXT[],
    is_liquidated BOOLEAN DEFAULT false,
    liquidation_date TIMESTAMPTZ,
    liquidation_price DECIMAL(12,2),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create loans table
CREATE TABLE IF NOT EXISTS public.loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id),
    object_id UUID REFERENCES public.objects(id),
    branch_id UUID REFERENCES public.branches(id),
    loan_number TEXT UNIQUE,
    principal_amount DECIMAL(12,2) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    term_months INT NOT NULL,
    status loan_status DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    next_payment_date DATE,
    total_paid DECIMAL(12,2) DEFAULT 0,
    remaining_balance DECIMAL(12,2),
    late_fees DECIMAL(12,2) DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loan_id UUID REFERENCES public.loans(id),
    amount DECIMAL(12,2) NOT NULL,
    payment_type payment_type NOT NULL,
    status payment_status DEFAULT 'pending',
    transaction_ref TEXT,
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    read BOOLEAN DEFAULT false,
    action_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_branch ON public.clients(branch_id);
CREATE INDEX IF NOT EXISTS idx_loans_client ON public.loans(client_id);
CREATE INDEX IF NOT EXISTS idx_loans_status ON public.loans(status);
CREATE INDEX IF NOT EXISTS idx_payments_loan ON public.payments(loan_id);
CREATE INDEX IF NOT EXISTS idx_objects_client ON public.objects(client_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.object_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid()
            AND role IN ('super_admin', 'admin')
        )
    );

-- Branches policies
CREATE POLICY "Users can view branches"
    ON public.branches FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only admins can modify branches"
    ON public.branches
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid()
            AND role IN ('super_admin', 'admin')
        )
    );

-- Clients policies
CREATE POLICY "Users can view clients in their branch"
    ON public.clients FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid()
            AND (
                role IN ('super_admin', 'admin')
                OR branch_id = clients.branch_id
            )
        )
    );

CREATE POLICY "Users can create clients in their branch"
    ON public.clients FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid()
            AND branch_id = NEW.branch_id
        )
    );

-- Objects policies
CREATE POLICY "Users can view objects in their branch"
    ON public.objects FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            JOIN public.clients c ON c.branch_id = p.branch_id
            WHERE p.user_id = auth.uid()
            AND c.id = objects.client_id
        )
    );

-- Loans policies
CREATE POLICY "Users can view loans in their branch"
    ON public.loans FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE user_id = auth.uid()
            AND (
                role IN ('super_admin', 'admin')
                OR branch_id = loans.branch_id
            )
        )
    );

-- Payments policies
CREATE POLICY "Users can view payments for their branch loans"
    ON public.payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            JOIN public.loans l ON l.branch_id = p.branch_id
            WHERE p.user_id = auth.uid()
            AND l.id = payments.loan_id
        )
    );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
DO $$ BEGIN
    CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Repeat for other tables
DO $$ BEGIN
    CREATE TRIGGER update_branches_updated_at
        BEFORE UPDATE ON public.branches
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add initial object categories
INSERT INTO public.object_categories (name, description, min_loan_percentage, max_loan_percentage, interest_rate)
VALUES
    ('Or 18 carats', 'Bijoux et objets en or 18 carats', 70, 85, 3.5),
    ('Or 24 carats', 'Bijoux et objets en or 24 carats', 75, 90, 3.0),
    ('Diamants', 'Bijoux avec diamants certifiés', 60, 80, 4.0),
    ('Montres de luxe', 'Montres de marques premium', 50, 70, 4.5),
    ('Appareils électroniques', 'Smartphones, ordinateurs, etc.', 40, 60, 5.0)
ON CONFLICT DO NOTHING;

-- Create function for audit logging
CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data,
        ip_address
    )
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        current_setting('request.headers')::json->>'x-real-ip'
    );
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Add audit triggers to important tables
DO $$ BEGIN
    CREATE TRIGGER audit_loans_changes
        AFTER INSERT OR UPDATE OR DELETE ON public.loans
        FOR EACH ROW
        EXECUTE FUNCTION audit_log_changes();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TRIGGER audit_payments_changes
        AFTER INSERT OR UPDATE OR DELETE ON public.payments
        FOR EACH ROW
        EXECUTE FUNCTION audit_log_changes();
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;