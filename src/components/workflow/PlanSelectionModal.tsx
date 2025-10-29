// src\components\workflow\PlanSelectionModal.tsx
// 
import { useState, useEffect } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  X,
  Check,
  Star,
  Zap,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormModal } from '@/components/ui/FormModal';
import AnimatedLogo from '@/components/AnimatedLogo';
import { supabase } from '@/lib/supabase';

interface PlanSelectionModalProps {
  // support both shapes: (open/onOpenChange) and (isOpen/onClose) for backwards compatibility
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onSuccess?: (selectedPlan: Plan) => void;
}

interface PlanFeatures {
  max_organizations: number;
  max_garages_per_org: number;
  max_users_per_org: number;
  max_vehicles_per_garage: number;
  support_level: 'email' | 'priority' | 'premium';
  analytics: boolean;
  setup_days?: number;
  caution_amount?: number;
  additional_activities?: number;
  additional_instances?: number;
}

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  features: PlanFeatures; // Mise à jour du type
  popular?: boolean;
  gradient: string;
  color: string;
}

interface SubscriptionPlanDB {
  id: string;
  name: string;
  type: string;
  price: number;
  duration_days: number;
  features: any;
  created_at: string;
  is_active: boolean;
}

export const PlanSelectionModal = ({ open, isOpen: isOpenProp, onOpenChange, onClose, onSuccess }: PlanSelectionModalProps) => {
  const modalOpen = open ?? isOpenProp ?? false;
  const handleClose = () => {
    if (typeof onOpenChange === 'function') onOpenChange(false);
    else if (typeof onClose === 'function') onClose();
  };
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState<'sees' | 'other'>('sees');

  // Constante utilisée pour représenter une durée illimitée dans la logique des plans
  const UNLIMITED_DAYS = 9999;

  // Charger les plans depuis la base de données
  useEffect(() => {
    loadPlansFromDatabase();
    // ...existing code...
  }, []);

  // Ensure selection stays valid when plans or business filter changes
  useEffect(() => {
    if (!plans.length) return;
    const visible = plans.filter(p => business === 'sees' ? p.type.startsWith('sees') || p.type === 'free' : !p.type.startsWith('sees') || p.type === 'free');
    if (!visible.length) return;
    if (!selectedPlan || !visible.find(v => v.id === selectedPlan)) {
      setSelectedPlan(visible[0].id);
    }
  }, [plans, business]);

  const loadPlansFromDatabase = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des plans...');

      const { data, error } = await (supabase as any)
        .from('subscription_plans')
        .select('id, name, type, price, duration_days, features, created_at, is_active')
        .order('price', { ascending: true });

      if (error) throw error;

      let rawPlans = data || [];
      if (!rawPlans.length) {
        console.log('⚠️ Aucun plan trouvé, création des plans par défaut...');
        // Create seed plans tuned for two business types.
        // Note: SeeS pricing: 10 000 F / month, 100 000 F / year (paiement initial: 2 x 50 000 F non remboursable)
        const seed = [
          {
            name: 'Gratuit',
            type: 'free',
            price: 0,
            duration_days: 7,
            features: {
              max_organizations: 1,
              max_garages_per_org: 1,
              max_users_per_org: 5,
              max_vehicles_per_garage: 50,
              support_level: 'email',
              analytics: false,
              setup_days: 0,
              caution_amount: 0,
              additional_activities: 0,
              additional_instances: 0
            },
            is_active: true
          },
          // SeeS monthly
          {
            name: 'SeeS Mensuel',
            type: 'sees_monthly',
            price: 10000,
            duration_days: 30,
            features: {
              max_organizations: 1,
              max_garages_per_org: 1,
              max_users_per_org: 10,
              max_vehicles_per_garage: 200,
              support_level: 'priority',
              analytics: true,
              setup_days: 1,
              caution_amount: 0,
              additional_activities: 1,
              additional_instances: 0
            },
            is_active: true,
            gradient: 'from-emerald-400 to-emerald-600'
          },
          // SeeS annual
          {
            name: 'SeeS Annuel',
            type: 'sees_annual',
            price: 100000,
            duration_days: 365,
            features: {
              max_organizations: 2,
              max_garages_per_org: 2,
              max_users_per_org: 50,
              max_vehicles_per_garage: 1000,
              support_level: 'premium',
              analytics: true,
              setup_days: 2,
              caution_amount: 50000,
              startup_payment: { count: 2, amount: 50000, refundable: false },
              additional_activities: 0,
              additional_instances: 2
            },
            is_active: true,
            gradient: 'from-yellow-400 to-amber-600'
          },
          // Other business - monthly
          {
            name: 'Pro Mensuel',
            type: 'monthly',
            price: 15000,
            duration_days: 30,
            features: {
              max_organizations: 1,
              max_garages_per_org: 1,
              max_users_per_org: 20,
              max_vehicles_per_garage: 500,
              support_level: 'priority',
              analytics: true,
              setup_days: 2,
              caution_amount: 50000,
              additional_activities: 2,
              additional_instances: 0
            },
            is_active: true
          },
          // Other business - annual
          {
            name: 'Pro Annuel',
            type: 'annual',
            price: 150000,
            duration_days: 365,
            features: {
              max_organizations: 2,
              max_garages_per_org: 2,
              max_users_per_org: 100,
              max_vehicles_per_garage: 2000,
              support_level: 'premium',
              analytics: true,
              setup_days: 2,
              caution_amount: 50000,
              additional_activities: 0,
              additional_instances: 3
            },
            is_active: true
          }
        ];

        await (supabase as any).from('subscription_plans').insert(seed);
        console.log('✅ Plans par défaut créés');

        const { data: reloaded, error: reloadError } = await (supabase as any)
          .from('subscription_plans')
          .select('id, name, type, price, duration_days, features, created_at, is_active')
          .order('price', { ascending: true });

        if (reloadError) throw reloadError;
        rawPlans = reloaded || [];
      }

      console.log('🔄 Formatage des plans...');
      const formattedPlans: Plan[] = (rawPlans as any[]).map((plan: any) => {
        console.log(`📝 Formatage du plan ${plan.name}:`, {
          id: plan.id,
          type: plan.type,
          duration_days: plan.duration_days,
          features: plan.features
        });

        // Normalize price to a number (fallback to 0) and ensure features is an object
        const priceNumber = plan.price != null ? Number(plan.price) : 0;
        const featuresObj = plan.features && typeof plan.features === 'object' ? plan.features : (() => {
          try { return JSON.parse(plan.features); } catch { return {}; }
        })();

        return {
          id: plan.id,
          name: plan.name,
          type: plan.type,
          price: priceNumber,
          duration: plan.duration_days === UNLIMITED_DAYS ? 'Illimité' : `${plan.duration_days} jours`,
          features: featuresObj as any,
          popular: plan.type === 'monthly',
          gradient: plan.gradient || getGradientByType(plan.type),
          color: getColorByType(plan.type)
        };
      });

      console.log('✅ Plans formatés:', formattedPlans);
      setPlans(formattedPlans);

      if (!selectedPlan && formattedPlans.length) {
        setSelectedPlan(formattedPlans[0].id);
        console.log('📌 Plan par défaut sélectionné:', formattedPlans[0].name);
      }
    } catch (error) {
      console.error('❌ Erreur chargement plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
      console.log('🏁 Chargement terminé');
    }
  };

  // Nouvelle fonction pour sauvegarder le plan
  const saveSelectedPlan = async (plan: Plan) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          selected_plan: plan.type,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Build subscription payload for all non-free plans and free plan as well
      const days = plan.duration === 'Illimité' ? UNLIMITED_DAYS : (plan.duration.includes('jours') ? Number(plan.duration.split(' ')[0]) : (plan.duration.includes('30') ? 30 : 365));
      const now = new Date();
      const periodEnd = new Date(now.getTime() + (Number((plan as any).duration_days || (days === UNLIMITED_DAYS ? 0 : days)) * 24 * 60 * 60 * 1000)).toISOString();

      // Fetch profile to provide tenant_id for subscription if available
      let tenant_id: string | null = null;
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('tenant_id')
          .eq('id', user.id)
          .single();
        tenant_id = (profileData as any)?.tenant_id ?? null;
      } catch (err) {
        // ignore, tenant_id remains null
      }

      const payload: any = {
        user_id: user.id,
        plan: plan.type, // required non-null column
        plan_id: plan.id,
        status: plan.type === 'free' ? 'active' : 'trial',
        price: plan.price,
        billing_period: plan.type === 'monthly' || plan.type === 'sees_monthly' ? 'monthly' : (plan.type === 'annual' || plan.type === 'sees_annual' ? 'annual' : 'monthly'),
        tenant_id,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd,
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      };

      const { error: subscriptionError } = await (supabase as any)
        .from('subscriptions')
        .upsert(payload, {
          onConflict: 'user_id,plan_id'
        });

      if (subscriptionError) throw subscriptionError;

      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde plan:', error);
      return false;
    }
  };

  // Mettre à jour handleContinue
  const handleContinue = async () => {
    if (selectedPlan) {
      setLoading(true);
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      if (selectedPlanData) {
        const success = await saveSelectedPlan(selectedPlanData);
        if (success) {
          onSuccess?.(selectedPlanData);
        }
      }
      setLoading(false);
    }
  };

  return (
    <FormModal
      isOpen={modalOpen}
      onClose={handleClose}
      draggable
      className="max-w-2xl"
      title="Choisissez votre Plan"
    >
      <div className="space-y-4">
        {/* Business selector */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setBusiness('sees')}
            className={cn('flex items-center gap-2 px-3 py-1 rounded-full transition-all',
              business === 'sees' ? 'bg-emerald-100 ring-2 ring-emerald-300' : 'bg-white/60')}
            aria-pressed={business === 'sees'}
          >
            <motion.span
              animate={{ y: business === 'sees' ? [-4, 0, -4] : [0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-lg"
            >
              🐟
            </motion.span>
            <span className="text-sm font-semibold">SeeS</span>
          </button>
          <button
            onClick={() => setBusiness('other')}
            className={cn('flex items-center gap-2 px-3 py-1 rounded-full transition-all',
              business === 'other' ? 'bg-amber-100 ring-2 ring-amber-300' : 'bg-white/60')}
            aria-pressed={business === 'other'}
          >
            <motion.span
              animate={{ y: business === 'other' ? [-3, 0, -3] : [0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="text-lg"
            >
              🐌
            </motion.span>
            <span className="text-sm font-semibold">Autre Business</span>
          </button>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plans
            .filter(p => business === 'sees' ? p.type.startsWith('sees') || p.type === 'free' : !p.type.startsWith('sees') || p.type === 'free')
            .map((plan) => {
              const features = typeof plan.features === 'string' ?
                JSON.parse(plan.features) : plan.features || {};
              const isSelected = selectedPlan === plan.id;
              const isPopular = plan.type === 'monthly';

              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "relative transition-all duration-200 cursor-pointer",
                    isSelected ? "ring-2 ring-primary shadow-lg scale-[1.02]" : "hover:shadow-md",
                    getPlanColor(plan.type)
                  )}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader className="pb-2">
                    {isPopular && (
                      <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-emerald-600">
                        ⭐ Populaire
                      </Badge>
                    )}
                    <CardTitle className="text-sm font-bold">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="mb-2 flex items-baseline justify-between">
                      <div>
                        <p className="text-lg font-bold">
                          {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString('fr-FR')} F`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {plan.type === 'free' ? '1 semaine' :
                            plan.type.includes('monthly') ? '/mois' : '/an'}
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        {renderStartupText(features)}
                      </div>
                    </div>

                    <ul className="space-y-1 text-xs mb-2">
                      {formatFeatures(features).slice(0, 4).map((f, idx) => (
                        <FeatureItem key={idx} text={f} />
                      ))}
                    </ul>

                    <div className="text-xs text-gray-600">
                      <p className="font-semibold text-sm mb-1">Avantages</p>
                      <ul className="list-inside list-disc">
                        <li>Intégration rapide et support prioritaire</li>
                        <li>Sauvegarde et analytics</li>
                        <li>Accès multi-utilisateurs</li>
                        {plan.type === 'sees_annual' &&
                          <li>Économie annuelle: ~20% (paiement unique)</li>}
                        {plan.type === 'sees_monthly' &&
                          <li>Flexibilité mensuelle, activation immédiate</li>}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Annuler
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedPlan || loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sauvegarde...
              </>
            ) : (
              <>
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </FormModal>
  );
};

type FeatureKey =
  | 'max_organizations'
  | 'max_garages_per_org'
  | 'max_users_per_org'
  | 'max_vehicles_per_garage'
  | 'support_level'
  | 'analytics';

// Labels pour les features
const FEATURE_LABELS: Record<FeatureKey, (value: any) => string> = {
  max_organizations: (value) => `${value} Organisation(s)`,
  max_garages_per_org: (value) => `${value} Garage(s) par org`,
  max_users_per_org: (value) => `${value} Utilisateur(s)`,
  max_vehicles_per_garage: (value) => `Jusqu'à ${value} Véhicules`,
  support_level: (value) => `Support ${value}`,
  analytics: (value) => (value ? 'Analytics Avancées' : 'Analytics Basiques')
};

const formatFeatures = (features: any): string[] => {
  try {
    const obj = typeof features === 'string' ? JSON.parse(features) : features;
    if (!obj || typeof obj !== 'object') return [];
    return Object.entries(obj).map(([key, value]) => {
      const formatter = FEATURE_LABELS[key as FeatureKey];
      return formatter ? formatter(value) : `${key}: ${String(value)}`;
    });
  } catch (error) {
    console.error('Erreur parsing features:', error);
    return [];
  }
};

// Helper to render startup payment text safely
const renderStartupText = (features: any) => {
  try {
    const startup = features?.startup_payment;
    if (!startup) return null;
    const count = typeof startup === 'object' && startup.count ? startup.count : (typeof startup === 'number' ? 1 : undefined);
    const amount = typeof startup === 'object' ? (startup.amount ?? null) : (typeof startup === 'number' ? startup : (typeof startup === 'string' ? Number(startup) : null));
    const amountDisplay = amount != null ? amount.toLocaleString('fr-FR') : String(startup);
    return (<p className="text-amber-700">Démarrage: {count ? `${count} × ` : ''}{amountDisplay} F (non remboursable)</p>);
  } catch (e) {
    return null;
  }
};

const getGradientByType = (type: string): string => {
  switch (type) {
    case 'free':
      return 'from-gray-500 to-gray-600';
    case 'monthly':
      return 'from-blue-500 to-blue-600';
    default:
      return 'from-purple-500 to-purple-600';
  }
};

const getColorByType = (type: string): string => {
  switch (type) {
    case 'free':
      return 'gray';
    case 'monthly':
      return 'blue';
    default:
      return 'purple';
  }
};

const calculateSavings = (plan: Plan): number => {
  if (plan.type === 'annual') {
    return 20; // 20% d'économie pour le plan annuel
  }
  return 0;
};

// Composant réutilisable pour afficher une feature
const FeatureItem = ({ text }: { text: string }) => (
  <li className="flex items-center text-xs">
    <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
    <span className="text-gray-700">{text}</span>
  </li>
);

// Fonction utilitaire pour obtenir la couleur du plan
const getPlanColor = (type: string): string => {
  switch (type) {
    case 'free':
      return 'bg-gray-50 hover:bg-gray-100';
    case 'monthly':
      return 'bg-emerald-50 hover:bg-emerald-100';
    default:
      return 'bg-purple-50 hover:bg-purple-100';
  }
};
