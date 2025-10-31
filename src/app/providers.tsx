import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface ProviderProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="animate-pulse text-4xl">⏳</div>
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </QueryClientProvider>
  );
}