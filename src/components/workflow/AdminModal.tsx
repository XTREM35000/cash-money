import { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { supabase } from '../../lib/supabase';
import { useOnboarding } from '../../contexts/OnboardingContext';

export function AdminModal() {
  const { completeCurrentStep } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create super admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Set user role as super_admin
        const { error: roleError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email,
              role: 'super_admin',
            }
          ]);

        if (roleError) throw roleError;

        completeCurrentStep();
      }
    } catch (error) {
      console.error('Error creating super admin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open>
      <div className="fixed inset-0 bg-black/50 z-50">
        <div className="container flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Configuration Administrateur</h2>
            <p className="text-gray-600 mb-6">
              Créez le compte super administrateur pour commencer.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email administrateur"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Création...' : 'Créer le compte administrateur'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
}