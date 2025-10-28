-- Create triggers for tables
DO $$ BEGIN
    -- Profiles table trigger
    CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Table profiles does not exist yet';
    WHEN duplicate_object THEN
        RAISE NOTICE 'Trigger already exists';
END $$;

DO $$ BEGIN
    -- Branches table trigger
    CREATE TRIGGER update_branches_updated_at
        BEFORE UPDATE ON public.branches
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Table branches does not exist yet';
    WHEN duplicate_object THEN
        RAISE NOTICE 'Trigger already exists';
END $$;

DO $$ BEGIN
    -- Clients table trigger
    CREATE TRIGGER update_clients_updated_at
        BEFORE UPDATE ON public.clients
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Table clients does not exist yet';
    WHEN duplicate_object THEN
        RAISE NOTICE 'Trigger already exists';
END $$;

DO $$ BEGIN
    -- Objects table trigger
    CREATE TRIGGER update_objects_updated_at
        BEFORE UPDATE ON public.objects
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Table objects does not exist yet';
    WHEN duplicate_object THEN
        RAISE NOTICE 'Trigger already exists';
END $$;

DO $$ BEGIN
    -- Loans table trigger
    CREATE TRIGGER update_loans_updated_at
        BEFORE UPDATE ON public.loans
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
    WHEN undefined_table THEN
        RAISE NOTICE 'Table loans does not exist yet';
    WHEN duplicate_object THEN
        RAISE NOTICE 'Trigger already exists';
END $$;