import { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmailInput } from '../ui/email-input';
import { PasswordInput } from '../ui/password-input';
import { Label } from '../ui/label';
import { supabase } from '../../lib/supabase';
import { useOnboarding } from '../../contexts/OnboardingContext';

export function AuthenticationModal() {
  const { completeCurrentStep } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) throw error;
      completeCurrentStep();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
      });

      if (error) throw error;
      completeCurrentStep();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open>
      <div className="fixed inset-0 bg-black/50 z-50">
        <div className="container flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="register">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <EmailInput
                      value={loginData.email}
                      onChange={(v) => setLoginData({ ...loginData, email: v })}
                      required
                      label="Email"
                    />
                  </div>

                  <div className="space-y-2">
                    <PasswordInput
                      value={loginData.password}
                      onChange={(v) => setLoginData({ ...loginData, password: v })}
                      required
                      label="Mot de passe"
                      showStrength={false}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <EmailInput
                      value={registerData.email}
                      onChange={(v) => setRegisterData({ ...registerData, email: v })}
                      required
                      label="Email"
                    />
                  </div>

                  <div className="space-y-2">
                    <PasswordInput
                      value={registerData.password}
                      onChange={(v) => setRegisterData({ ...registerData, password: v })}
                      required
                      label="Mot de passe"
                    />
                  </div>

                  <div className="space-y-2">
                    <PasswordInput
                      value={registerData.confirmPassword}
                      onChange={(v) => setRegisterData({ ...registerData, confirmPassword: v })}
                      required
                      label="Confirmer le mot de passe"
                      showStrength={false}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Inscription...' : "S'inscrire"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Dialog>
  );
}