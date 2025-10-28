import React, { createContext, useContext, useEffect, useState } from 'react';

type OnboardingStep = 'plan' | 'profile' | 'sms' | 'done' | null;

interface OnboardingState {
  currentStep: OnboardingStep;
  started: boolean;
  completed: boolean;
  start: () => void;
  next: (step?: OnboardingStep) => void;
  skip: () => void;
  reset: () => void;
}

const STORAGE_KEY = 'gcm_onboarding_state_v1';

const OnboardingContext = createContext<OnboardingState | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(null);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setStarted(!!parsed.started);
        setCompleted(!!parsed.completed);
        setCurrentStep(parsed.currentStep ?? null);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ started, completed, currentStep }));
    } catch (e) {
      // ignore
    }
  }, [started, completed, currentStep]);

  const start = () => {
    setStarted(true);
    setCurrentStep('plan');
    setCompleted(false);
  };

  const next = (step?: OnboardingStep) => {
    if (step) {
      setCurrentStep(step);
      if (step === 'done') setCompleted(true);
      return;
    }

    if (currentStep === 'plan') setCurrentStep('profile');
    else if (currentStep === 'profile') setCurrentStep('sms');
    else if (currentStep === 'sms') {
      setCurrentStep('done');
      setCompleted(true);
    }
  };

  const skip = () => {
    setCurrentStep('done');
    setCompleted(true);
  };

  const reset = () => {
    setStarted(false);
    setCurrentStep(null);
    setCompleted(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { }
  };

  return (
    <OnboardingContext.Provider value={{ currentStep, started, completed, start, next, skip, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
};

export default OnboardingProvider;
