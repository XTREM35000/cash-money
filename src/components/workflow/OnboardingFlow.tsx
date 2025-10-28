import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { PlanSelectionModal } from './PlanSelectionModal';
import CreateProfileModal from './CreateProfileModal';
import { SMSValidationModal } from './SmsValidationModal';

// A small coordinator that shows the right modal for the current onboarding step
export const OnboardingFlow: React.FC = () => {
  const { currentStep, next, skip, start, started } = useOnboarding();

  // If onboarding not started, render a small sticky button to start it (user can dismiss)
  if (!started) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => start()}
          className="bg-amber-400 hover:bg-amber-500 text-black font-semibold px-4 py-2 rounded-full shadow-lg"
        >
          Démarrer l'Onboarding
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Plan */}
      <PlanSelectionModal
        isOpen={currentStep === 'plan'}
        onClose={() => skip()}
        onSuccess={() => next('profile')}
      />

      {/* Create profile */}
      <CreateProfileModal
        isOpen={currentStep === 'profile'}
        onClose={() => skip()}
        onCreated={() => next('sms')}
      />

      {/* SMS validation */}
      <SMSValidationModal
        isOpen={currentStep === 'sms'}
        onClose={() => skip()}
        onSuccess={() => next('done')}
      />
    </>
  );
};

export default OnboardingFlow;
