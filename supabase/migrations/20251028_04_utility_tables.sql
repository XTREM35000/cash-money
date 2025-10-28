-- Create utility tables
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT,
    read BOOLEAN DEFAULT false,
    action_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer les index de manière sécurisée avec gestion d'erreurs
DO $$ 
BEGIN
    -- Index pour audit_logs et notifications (tables déjà créées dans ce fichier)
    CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Une ou plusieurs tables ne sont pas encore créées';
    WHEN undefined_column THEN
        RAISE NOTICE 'Une ou plusieurs colonnes ne sont pas encore créées';
END $$;