-- Create business tables
CREATE TABLE IF NOT EXISTS public.object_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    min_loan_percentage DECIMAL(5,2),
    max_loan_percentage DECIMAL(5,2),
    interest_rate DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS public.loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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