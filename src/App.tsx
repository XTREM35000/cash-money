import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { clientsService, itemsService, transactionsService, paymentsService } from "@/services";

const queryClient = new QueryClient();

const App = () => {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Preload critical data before showing the UI to avoid flicker
    const prefetch = async () => {
      try {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ["clients"],
            queryFn: () => clientsService.getAll()
          }),
          queryClient.prefetchQuery({
            queryKey: ["items"],
            queryFn: () => itemsService.getAll()
          }),
          queryClient.prefetchQuery({
            queryKey: ["transactions"],
            queryFn: () => transactionsService.getAll()
          }),
          queryClient.prefetchQuery({
            queryKey: ["payments"],
            queryFn: () => paymentsService.getAll()
          })
        ]);
      } catch (e) {
        // silent - we'll still show UI even if some prefetch fails
        console.error('Prefetch error', e);
      } finally {
        setIsAppReady(true);
      }
    };

    prefetch();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {!isAppReady ? (
          <SplashScreen isAppReady={isAppReady} />
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
