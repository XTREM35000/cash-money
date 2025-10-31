import React, { Suspense, useEffect, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Providers } from "@/app/providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import OnboardingProvider from '@/components/workflow/OnboardingContext';
import AppLayout from '@/components/AppLayout';
import SplashScreen from "./components/SplashScreen";

// Use React.lazy for code splitting
const Dashboard = React.lazy(() => import("./pages/Dashboard2"));
const Clients = React.lazy(() => import("./pages/Clients"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<AppLayout title="Dashboard"><Dashboard /></AppLayout>} />
    <Route path="/clients" element={<AppLayout title="Clients"><Clients /></AppLayout>} />
    <Route path="*" element={<AppLayout title="404"><NotFound /></AppLayout>} />
  </Routes>
);

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Simuler un temps de chargement minimal pour éviter le flash
    const timer = setTimeout(() => setIsAppReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Providers>
      <TooltipProvider>
        <SidebarProvider>
          <BrowserRouter>
            <OnboardingProvider>
              {!isAppReady ? (
                <SplashScreen isAppReady={isAppReady} />
              ) : (
                <Suspense fallback={<div className="p-6 text-center">Chargement...</div>}>
                  <AppRoutes />
                </Suspense>
              )}
            </OnboardingProvider>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </Providers>
  );
};

export default App;
