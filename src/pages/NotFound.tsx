import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";
import PageWrapper from '@/components/PageWrapper';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PageWrapper maxWidth="xl" noPadding>
      <div className="w-full">
        {/* Hero Banner */}
        <div className="relative h-48 sm:h-72 mb-6">
          {/* Background image with overlay */}
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"
            alt="404 - Page non trouvée"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundSize: '15px 15px' }} />

          {/* Hero Content */}
          <div className="relative h-full flex items-center px-8">
            <div className="max-w-3xl space-y-6">
              {/* Header with logo */}
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-2 filter drop-shadow-lg" style={{ height: '64px' }}>
                  <AnimatedLogo size={45} />
                </div>
                <div className="h-12 w-px bg-white/20" />
                <div>
                  <h2 className="text-white/90 font-medium">Gage en Cash Money</h2>
                  <p className="text-white/60 text-sm">Page non trouvée</p>
                </div>
              </div>

              {/* Title and description */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  404 <span className="text-amber-400">Page Non Trouvée</span>
                </h1>
                <p className="text-xl text-white/90">
                  Désolé, la page que vous recherchez n'existe pas ou a été déplacée
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 text-sm">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full hover:bg-amber-600 transition-colors"
                >
                  Page d'accueil
                </button>
              </div>
            </div>

            {/* Decorative icon */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
              <AlertCircle className="w-32 h-32 text-amber-400/20 rotate-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="space-y-8">
        <div className="grid gap-6 text-center max-w-2xl mx-auto py-12">
          <h2 className="text-2xl font-semibold text-foreground">
            Suggestions
          </h2>
          <div className="text-muted-foreground space-y-2">
            <p>Vérifiez l'URL pour vous assurer qu'elle est correcte</p>
            <p>Utilisez la navigation principale pour trouver ce que vous cherchez</p>
            <p>Contactez le support si vous pensez qu'il s'agit d'une erreur</p>
          </div>
        </div>
      </div>

    </PageWrapper>
  );
}
