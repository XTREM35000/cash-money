import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Package2, ChartBar, Wallet,
  AlertCircle, Activity, Clock, CheckCircle,
  Shield, ChevronLeft, type LucideIcon
} from "lucide-react";
import Gem from "@/components/icons/Gem";

import { useQuery } from "@tanstack/react-query";

import { AppSidebar } from "@/components/AppSidebar";
import StatsCard from "@/components/StatsCard";
import AnimatedLogo from "@/components/AnimatedLogo";
import UserMenu from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

import { clientsService, itemsService, transactionsService, paymentsService } from "@/services";
import { cn } from "@/lib/utils";

// ✅ Fake profile before auth setup
const mockProfile = {
  full_name: "Thierry Gogo",
  email: "thierry.gogo@gagecashmoney.com",
  avatar_url: null
};

// ✅ Demo Recent Activity (à remplacer plus tard par Supabase)
const recentActivity = [
  { icon: CheckCircle, title: 'Nouveau prêt validé', client: 'Marie Dubois', amount: 2500, time: 'Il y a 5 min', color: 'text-green-500' },
  { icon: Clock, title: 'Échéance proche', client: 'Jean Martin', amount: 1200, time: 'Dans 2 jours', color: 'text-yellow-500' },
  { icon: AlertCircle, title: 'Retard de paiement', client: 'Sophie Bernard', amount: 850, time: 'Il y a 1 jour', color: 'text-red-500' },
  { icon: Activity, title: 'Évaluation terminée', client: 'Pierre Petit', amount: 3400, time: 'Il y a 15 min', color: 'text-blue-500' },
];

export default function Dashboard() {
  const [totals, setTotals] = useState({
    activeClients: 0,
    totalItems: 0,
    itemsValue: 0,
    activeLoans: 0,
    totalLoaned: 0,
    totalInterest: 0,
    totalPayments: 0,
    lateLoans: 0,
  });

  const { data: clients, isLoading: loadingClients } = useQuery({
    queryKey: ["clients"],
    queryFn: () => clientsService.getAll()
  });

  const { data: items, isLoading: loadingItems } = useQuery({
    queryKey: ["items"],
    queryFn: () => itemsService.getAll()
  });

  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => transactionsService.getAll()
  });

  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentsService.getAll()
  });

  const isLoading = loadingClients || loadingItems || loadingTransactions || loadingPayments;

  useEffect(() => {
    if (!isLoading && clients && items && transactions && payments) {
      const today = new Date();
      const activeTransactions = transactions.filter(t => t.status === 'active');
      const lateTransactions = activeTransactions.filter(t => new Date(t.due_date) < today);

      const totalLoaned = activeTransactions.reduce((sum, t) => sum + Number(t.loan_amount), 0);
      const totalInterest = activeTransactions.reduce(
        (sum, t) => sum + Number(t.loan_amount) * Number(t.interest_rate) / 100, 0
      );

      setTotals({
        activeClients: clients.length,
        totalItems: items.length,
        itemsValue: items.reduce((sum, item) => sum + Number(item.estimated_value), 0),
        activeLoans: activeTransactions.length,
        totalLoaned,
        totalInterest,
        totalPayments: payments.reduce((sum, p) => sum + Number(p.amount), 0),
        lateLoans: lateTransactions.length
      });
    }
  }, [clients, items, transactions, payments, isLoading]);

  const stats: Array<{
    title: string;
    value: string;
    icon: LucideIcon;
    change: string;
    changeType: "neutral" | "positive" | "negative";
  }> = [
      { title: "Clients", value: totals.activeClients.toString(), icon: Users, change: "0", changeType: "neutral" },
      { title: "Objets en dépôt", value: totals.totalItems.toString(), icon: Package2, change: "0", changeType: "neutral" },
      { title: "Valeur du stock", value: new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(totals.itemsValue), icon: ChartBar, change: "0", changeType: "neutral" },
      { title: "Prêts actifs", value: totals.activeLoans.toString(), icon: Wallet, change: "0", changeType: "neutral" },
      { title: "Capital engagé", value: new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(totals.totalLoaned), icon: Gem as LucideIcon, change: "0", changeType: "neutral" },
      { title: "Intérêts attendus", value: new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(totals.totalInterest), icon: Activity, change: "0", changeType: "neutral" },
      { title: "Paiements reçus", value: new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(totals.totalPayments), icon: Shield, change: "0", changeType: "neutral" },
      { title: "Retards", value: totals.lateLoans.toString(), icon: AlertCircle, change: "0", changeType: "neutral" },
    ];

  return (
    <SidebarProvider>
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "100%" }}
        className="min-h-screen flex bg-gradient-to-br from-background via-secondary to-background"
      >
        <AppSidebar />

        <motion.div
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 flex flex-col"
        >
          {/* HEADER */}
          <motion.header
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 bg-card/50 backdrop-blur-md border-b border-border"
          >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <AnimatedLogo size={40} animated />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">GageMoney</h1>
                  <p className="text-sm text-muted-foreground">Tableau de bord</p>
                </div>
              </div>

              <UserMenu profile={mockProfile} isSuperAdmin />
            </div>
          </motion.header>

          {/* CONTENT */}
          <main className="flex-1 container mx-auto px-6 py-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
              <button
                onClick={() => window.history.back()}
                className="hover:text-primary flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Retour
              </button>
              <span>/</span>
              <span className="text-foreground">Dashboard</span>
            </nav>

            {/* Hero Banner amélioré */}
            <div className="w-full mb-6">
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl">
                {/* Image de fond avec superposition dégradée dorée */}
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"
                  alt="Gage en Cash Money"
                  className="absolute inset-0 w-full h-full object-cover object-center transform scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />

                {/* Overlay avec motif subtil */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpolygon points="0 0 20 0 10 10"%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E")',
                  backgroundSize: '15px 15px'
                }} />

                {/* Contenu principal */}
                <div className="relative h-full flex items-center px-8">
                  <div className="max-w-3xl space-y-6">
                    {/* Logo et titre */}
                    <div className="flex items-center gap-4 mb-2">
                      <AnimatedLogo size={64} className="filter drop-shadow-lg" />
                      <div className="h-12 w-px bg-white/20" />
                      <div>
                        <h2 className="text-white/90 font-medium">Gage en Cash Money</h2>
                        <p className="text-white/60 text-sm">Prêts sur Gages Premium & Services Financiers VIP</p>
                      </div>
                    </div>

                    {/* Message de bienvenue */}
                    <div className="space-y-4">
                      <h1 className="text-4xl font-bold text-white tracking-tight">
                        {new Date().getHours() < 12 ? 'Bonjour' : new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonsoir'},
                        <span className="text-amber-400 ml-2">{mockProfile.full_name}</span> 👋
                      </h1>
                      <p className="text-xl text-white/90">
                        Gérez vos prêts sur gages et suivez vos opérations en temps réel
                      </p>
                    </div>

                    {/* Badges d'informations */}
                    <div className="flex items-center gap-4 text-sm">
                      {/* Badge de rôle */}
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span className="text-white font-medium">Super Administrateur</span>
                      </div>

                      {/* Badge de statut */}
                      <div className="flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-300 font-medium">Système Actif</span>
                      </div>

                      {/* Badge avec l'heure */}
                      <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full">
                        <Clock className="w-4 h-4 text-white/70" />
                        <time className="text-white/70">
                          {new Date().toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </time>
                      </div>
                    </div>
                  </div>

                  {/* Décoration latérale */}
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <Gem className="w-32 h-32 text-amber-400/20 rotate-12" />
                  </div>
                </div>
              </div>
            </div>

            {/* SKELETON LOADING */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0 }}
                className="space-y-8"
              >
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map(stat => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0 }}
                    >
                      <StatsCard {...stat} />
                    </motion.div>
                  ))}
                </div>

                {/* Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left part */}
                  <div className="lg:col-span-2 bg-card/80 backdrop-blur border rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4 flex gap-2 items-center">
                      <Activity className="h-5 w-5 text-primary" /> Activité Récente
                    </h3>

                    <div className="space-y-4">
                      {recentActivity.map((a, i) => (
                        <div
                          key={i}
                          className="flex justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex gap-3 items-center">
                            <a.icon className={cn("w-6 h-6", a.color)} />
                            <div>
                              <p className="font-medium">{a.title}</p>
                              <p className="text-xs text-muted-foreground">{a.client}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(a.amount)}</p>
                            <p className="text-xs text-muted-foreground">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-3">
                    <Button className="w-full justify-start">Nouveau Client</Button>
                    <Button className="w-full justify-start" variant="outline">Enregistrer Objet</Button>
                    <Button className="w-full justify-start" variant="outline">Encaisser Paiement</Button>
                    <Button className="w-full justify-start" variant="outline">Rappels du Jour</Button>
                  </div>

                </div>
              </motion.div>
            )}

          </main>
        </motion.div>
      </motion.div>
    </SidebarProvider>
  );
}
