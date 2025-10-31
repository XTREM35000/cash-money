import { useState } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { supabase } from '../../lib/supabase';
import { useOnboarding } from '@/components/workflow/OnboardingContext';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '49.99',
    features: ['Accès basique', 'Support email', '5 utilisateurs']
  },
  {
    id: 'pro',
    name: 'Professionnel',
    price: '99.99',
    features: ['Accès complet', 'Support prioritaire', 'Utilisateurs illimités']
  }
];

export function PlanModal() {
  const { completeCurrentStep } = useOnboarding();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      // Get plan details
      const { data: planData } = await supabase
        .from('plans')
        .select('id')
        .eq('name', plans.find(p => p.id === selectedPlan)?.name)
        .single();

      if (!planData) throw new Error('Plan not found');

      // Create subscription
      const { error: subError } = await supabase
        .from('user_subscriptions')
        .insert([
          {
            user_id: user.id,
            plan_id: planData.id,
            status: 'active'
          }
        ]);

      if (subError) throw subError;

      completeCurrentStep();
    } catch (error) {
      console.error('Error selecting plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open>
      <div className="fixed inset-0 bg-black/50 z-50">
        <div className="container flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 className="text-2xl font-bold mb-4">Choisissez votre plan</h2>
            <p className="text-gray-600 mb-6">
              Sélectionnez le plan qui correspond à vos besoins.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <RadioGroup
                value={selectedPlan}
                onValueChange={setSelectedPlan}
                className="grid grid-cols-2 gap-4"
              >
                {plans.map((plan) => (
                  <div key={plan.id} className="relative">
                    <RadioGroupItem
                      value={plan.id}
                      id={plan.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={plan.id}
                      className="flex flex-col p-4 border-2 rounded-lg cursor-pointer peer-checked:border-blue-500"
                    >
                      <span className="text-lg font-semibold">{plan.name}</span>
                      <span className="text-2xl font-bold">${plan.price}/mois</span>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <span className="mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Button
                type="submit"
                className="w-full"
                disabled={!selectedPlan || loading}
              >
                {loading ? 'Configuration...' : 'Confirmer le plan'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Dialog>
  );
}