import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type OnboardingStep = 'splash' | 'admin' | 'plan' | 'sms' | 'auth' | 'complete';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  isLoading: boolean;
  checkWorkflowState: () => Promise<void>;
  completeCurrentStep: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('splash');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkWorkflowState = async () => {
    try {
      setIsLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCurrentStep('auth');
        return;
      }

      // Check if super admin exists
      const { data: superAdmin } = await supabase
        .from('users')
        .select('id, role')
        .eq('role', 'super_admin')
        .single();

      if (!superAdmin) {
        setCurrentStep('admin');
        return;
      }

      // If user is not super admin, check if they have a plan
      if (user) {
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('id, status')
          .eq('user_id', user.id)
          .single();

        if (!subscription) {
          setCurrentStep('plan');
          return;
        }

        // Check if phone is verified
        const { data: userProfile } = await supabase
          .from('users')
          .select('is_phone_verified')
          .eq('id', user.id)
          .single();

        if (!userProfile?.is_phone_verified) {
          setCurrentStep('sms');
          return;
        }
      }

      setCurrentStep('complete');
    } catch (error) {
      console.error('Error checking workflow state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeCurrentStep = () => {
    switch (currentStep) {
      case 'splash':
        checkWorkflowState();
        break;
      case 'admin':
        setCurrentStep('plan');
        break;
      case 'plan':
        setCurrentStep('sms');
        break;
      case 'sms':
        setCurrentStep('auth');
        break;
      case 'auth':
      case 'complete':
        navigate('/dashboard');
        break;
    }
  };

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (session) {
      checkWorkflowState();
    }
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        isLoading,
        checkWorkflowState,
        completeCurrentStep
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}