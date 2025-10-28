-- Additional RLS policies for complete CRUD operations

-- Users policies for INSERT and UPDATE
CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admins can update any user" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'super_admin'
        )
    );

-- Plans policies for admin management
CREATE POLICY "Admins can manage plans" ON plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- User subscriptions management policies
CREATE POLICY "Users can create their own subscriptions" ON user_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON user_subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" ON user_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_phone_verified ON users(is_phone_verified);
CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_sms_verification_user ON sms_verifications(user_id, verified_at);