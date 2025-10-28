import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Package2, ChartBar, Wallet,
  DollarSign, AlertCircle, Activity, Clock, CheckCircle,
  Shield
} from "lucide-react";

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
  email: "thierry.gogo@montdepiete.com",
  avatar_url: null
};

// ✅ Demo Recent Activity (à remplacer plus tard par Supabase)
const recentActivity = [
  { icon: CheckCircle, title: 'Nouveau prêt validé', client: 'Marie Dubois', amount: '2 500 €', time: 'Il y a 5 min', color: 'text-green-500' },
  { icon: Clock, title: 'Échéance proche', client: 'Jean Martin', amount: '1 200 €', time: 'Dans 2 jours', color: 'text-yellow-500' },
  { icon: AlertCircle, title: 'Retard de paiement', client: 'Sophie Bernard', amount: '850 €', time: 'Il y a 1 jour', color: 'text-red-500' },
  { icon: Activity, title: 'Évaluation terminée', client: 'Pierre Petit', amount: '3 400 €', time: 'Il y a 15 min', color: 'text-blue-500' },
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
    icon: typeof Users;
    change: string;
    changeType: "neutral" | "positive" | "negative";
  }> = [
      { title: "Clients", value: totals.activeClients.toString(), icon: Users, change: "0", changeType: "neutral" },
      { title: "Objets en dépôt", value: totals.totalItems.toString(), icon: Package2, change: "0", changeType: "neutral" },
      { title: "Valeur du stock", value: `${totals.itemsValue.toLocaleString()} €`, icon: ChartBar, change: "0", changeType: "neutral" },
      { title: "Prêts actifs", value: totals.activeLoans.toString(), icon: Wallet, change: "0", changeType: "neutral" },
      { title: "Capital engagé", value: `${totals.totalLoaned.toLocaleString()} €`, icon: DollarSign, change: "0", changeType: "neutral" },
      { title: "Intérêts attendus", value: `${totals.totalInterest.toLocaleString()} €`, icon: Activity, change: "0", changeType: "neutral" },
      { title: "Paiements reçus", value: `${totals.totalPayments.toLocaleString()} €`, icon: Shield, change: "0", changeType: "neutral" },
      { title: "Retards", value: totals.lateLoans.toString(), icon: AlertCircle, change: "0", changeType: "neutral" },
    ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-gradient-to-br from-background via-secondary to-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">

          {/* HEADER */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
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

            {/* SKELETON LOADING */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map(stat => <StatsCard key={stat.title} {...stat} />)}
                </div>

                {/* Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Left part */}
                  <div className="lg:col-span-2 bg-card/80 backdrop-blur border rounded-2xl p-6">
                    <h3 className="text-xl font-semibold mb-4 flex gap-2 items-center">
                      <Activity className="h-5 w-5 text-primary" /> Activité Réçente
                    </h3>

                    <div className="space-y-4">
                      {recentActivity.map((a, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="flex justify-between p-3 border rounded-lg"
                        >
                          <div className="flex gap-3 items-center">
                            <a.icon className={cn("w-6 h-6", a.color)} />
                            <div>
                              <p className="font-medium">{a.title}</p>
                              <p className="text-xs text-muted-foreground">{a.client}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{a.amount}</p>
                            <p className="text-xs text-muted-foreground">{a.time}</p>
                          </div>
                        </motion.div>
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
              </>
            )}

          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
