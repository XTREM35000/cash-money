import React from 'react';
import PageWrapper from '@/components/PageWrapper';
import AnimatedLogo from '@/components/AnimatedLogo';

const Index = () => {
  return (
    <PageWrapper maxWidth="xl">
      <div className="p-4 bg-white/5 border-b">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <AnimatedLogo size={40} />
          <div>
            <h2 className="text-lg font-medium">Bienvenue</h2>
            <p className="text-sm text-muted-foreground">Accueil</p>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
      </div>
    </PageWrapper>
  );
}
export default Index;
