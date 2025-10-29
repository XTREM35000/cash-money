// Simple landing page — include a ModalHeader for consistency
import React from 'react';
import { ModalHeader } from '@/components/workflow/shared/ModalHeader';
import AnimatedLogo from '@/components/AnimatedLogo';

const Index = () => {
  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl overflow-hidden shadow-lg">
        <ModalHeader title="Bienvenue" subtitle="Accueil" headerLogo={<AnimatedLogo size={40} />} onClose={() => { }} />
        <div className="p-6 bg-white text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Your Blank App</h1>
          <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
