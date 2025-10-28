-- Add initial data
INSERT INTO public.object_categories (name, description, min_loan_percentage, max_loan_percentage, interest_rate)
VALUES
    ('Or 18 carats', 'Bijoux et objets en or 18 carats', 70, 85, 3.5),
    ('Or 24 carats', 'Bijoux et objets en or 24 carats', 75, 90, 3.0),
    ('Diamants', 'Bijoux avec diamants certifiés', 60, 80, 4.0),
    ('Montres de luxe', 'Montres de marques premium', 50, 70, 4.5),
    ('Appareils électroniques', 'Smartphones, ordinateurs, etc.', 40, 60, 5.0)
ON CONFLICT DO NOTHING;