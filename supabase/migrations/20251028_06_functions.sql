-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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

-- Add audit triggers
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