import React, { Suspense, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppSidebar } from '@/components/AppSidebar';
import UserMenu from '@/components/UserMenu';
import AnimatedLogo from '@/components/AnimatedLogo';
import OnboardingFlow from '@/components/workflow/OnboardingFlow';
import { ChevronLeft } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const PageTransition = ({ children, pathname }: { children: React.ReactNode; pathname: string }) => {
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 20, width: "100%" }}
      animate={{ opacity: 1, y: 0, width: "100%" }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.28 }}
      className="w-full min-w-[320px] flex-1 flex flex-col"
      style={{ width: "100%", minWidth: "100%" }}
    >
      {children}
    </motion.div>
  );
};

PageTransition.displayName = 'PageTransition';

export const AppLayout: React.FC<AppLayoutProps> = memo(({ children, title, subtitle }) => {
  const mockProfile = {
    full_name: 'Thierry Gogo',
    email: 'thierry.gogo@gagecashmoney.com',
    avatar_url: null
  };
  const location = useLocation();
  const isRoot = location.pathname === "/" || (title && title.toLowerCase().includes("dashboard"));

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-background via-secondary to-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-[320px]">
        {/* HEADER */}
        <header className="sticky top-0 z-40 bg-card/50 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                aria-label="Open sidebar"
                className="lg:hidden p-2 rounded-md hover:bg-accent"
              >
                {/* simple hamburger icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <AnimatedLogo size={40} animated />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">GageMoney</h1>
                <p className="text-sm text-muted-foreground">{title ?? 'Tableau de bord'}</p>
              </div>
            </div>

            <UserMenu profile={mockProfile} isSuperAdmin />
          </div>
        </header>

        {/* Page content area */}
        <main className="flex-1 w-full min-w-[320px] container mx-auto px-6 py-8 min-h-[calc(100svh-64px)] flex flex-col">
          {/* Breadcrumb + back button (hidden on dashboard/home) */}
          {!isRoot && (
            <nav className="w-full flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <button
                onClick={() => window.history.back()}
                className="hover:text-primary flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Retour
              </button>
              <span>/</span>
              <span className="text-foreground">{title ?? 'Page'}</span>
            </nav>
          )}

          {/* Children avec transition animée */}
          <Suspense
            fallback={
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="animate-pulse text-4xl">⌛</div>
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <PageTransition pathname={location.pathname}>{children}</PageTransition>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>

      {/* Onboarding flow at app root so its modals appear above everything */}
      <OnboardingFlow />
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

export default AppLayout;
