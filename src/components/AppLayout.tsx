import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import UserMenu from '@/components/UserMenu';
import AnimatedLogo from '@/components/AnimatedLogo';
// SidebarTrigger is not exported from '@/components/ui/sidebar'; use a simple responsive toggle button instead.
import OnboardingProvider from '@/components/workflow/OnboardingContext';
import OnboardingFlow from '@/components/workflow/OnboardingFlow';
import { ChevronLeft } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title, subtitle }) => {
  const mockProfile = {
    full_name: 'Thierry Gogo',
    email: 'thierry.gogo@gagecashmoney.com',
    avatar_url: null
  };

  return (
    <>
      <OnboardingProvider>
        <div className="min-h-screen flex bg-gradient-to-br from-background via-secondary to-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
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
            {/* Ensure the main content always takes the remaining viewport height to avoid initial truncation/reflow. */}
            <main className="flex-1 container mx-auto px-6 py-8 min-h-[calc(100svh-64px)]">
              {/* Breadcrumb + back button (hidden on dashboard/home) */}
              {(() => {
                const location = useLocation();
                const isRoot = location.pathname === "/" || (title && title.toLowerCase().includes("dashboard"));
                if (isRoot) return null;
                return (
                  <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
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
                );
              })()}

              {/* Children (pages render their hero + content) */}
              {children}
            </main>
          </div>

          {/* Onboarding flow at app root so its modals appear above everything */}
          {/* Onboarding flow at app root so its modals appear above everything */}
          <OnboardingFlow />
        </div>
      </OnboardingProvider>
    </>
  );
};
export default AppLayout;
