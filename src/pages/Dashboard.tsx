// import React from "react";
// import { useEffect, useState } from "react";
// import { Users, Package2, ChartBar, Activity, Clock, CheckCircle, AlertCircle } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import PageWrapper from "@/components/PageWrapper";
// import StatsCard from "@/components/StatsCard";
// import AnimatedLogo from "@/components/AnimatedLogo";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { clientsService, itemsService, transactionsService, paymentsService } from "@/services";
// import { cn } from "@/lib/utils";

// const mockProfile = { full_name: "Thierry Gogo" };

// const recentActivity = [
//   { icon: CheckCircle, title: "Nouveau prêt validé", client: "Marie Dubois", amount: 2500, time: "Il y a 5 min", color: "text-green-500" },
//   { icon: Clock, title: "Échéance proche", client: "Jean Martin", amount: 1200, time: "Dans 2 jours", color: "text-yellow-500" },
//   { icon: AlertCircle, title: "Retard de paiement", client: "Sophie Bernard", amount: 850, time: "Il y a 1 jour", color: "text-red-500" },
//   { icon: Activity, title: "Évaluation terminée", client: "Pierre Petit", amount: 3400, time: "Il y a 15 min", color: "text-blue-500" },
// ];

// export default function Dashboard() {
//   const [totals, setTotals] = useState({ activeClients: 0, totalItems: 0, itemsValue: 0, activeLoans: 0, totalLoaned: 0, totalInterest: 0, totalPayments: 0, lateLoans: 0 });

//   const { data: clients, isLoading: loadingClients } = useQuery({ queryKey: ["clients"], queryFn: () => clientsService.getAll() });
//   const { data: items, isLoading: loadingItems } = useQuery({ queryKey: ["items"], queryFn: () => itemsService.getAll() });
//   const { data: transactions, isLoading: loadingTransactions } = useQuery({ queryKey: ["transactions"], queryFn: () => transactionsService.getAll() });
//   const { data: payments, isLoading: loadingPayments } = useQuery({ queryKey: ["payments"], queryFn: () => paymentsService.getAll() });

//   const isLoading = loadingClients || loadingItems || loadingTransactions || loadingPayments;

//   useEffect(() => {
//     if (!isLoading && clients && items && transactions && payments) {
//       const activeTransactions = transactions.filter((t: any) => t.status === "active");
//       const totalLoaned = activeTransactions.reduce((s: number, t: any) => s + Number(t.loan_amount), 0);
//       setTotals({
//         activeClients: clients.length,
//         totalItems: items.length,
//         itemsValue: items.reduce((s: number, it: any) => s + Number(it.estimated_value), 0),
//         activeLoans: activeTransactions.length,
//         totalLoaned,
//         totalInterest: 0,
//         totalPayments: payments.reduce((s: number, p: any) => s + Number(p.amount), 0),
//         lateLoans: activeTransactions.filter((t: any) => new Date(t.due_date) < new Date()).length,
//       });
//     }
//   }, [clients, items, transactions, payments, isLoading]);

//   const stats = [
//     { title: "Clients", value: totals.activeClients.toString(), icon: Users, change: "0", changeType: "neutral" },
//     { title: "Objets en dépôt", value: totals.totalItems.toString(), icon: Package2, change: "0", changeType: "neutral" },
//     { title: "Valeur du stock", value: new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(totals.itemsValue), icon: ChartBar, change: "0", changeType: "neutral" },
//   ];

//   return (
//     <PageWrapper maxWidth="6xl" noPadding>
//       <div className="px-4 sm:px-8 py-6">
//         <div className="relative h-48 sm:h-72 rounded-xl sm:rounded-2xl overflow-hidden mb-6">
//           <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop" alt="hero" className="absolute inset-0 w-full h-full object-cover" />
//           <div className="absolute inset-0 bg-black/60" />
//           <div className="relative z-10 p-4 sm:p-8 text-white">
//             <div className="flex items-center gap-4">
//               <AnimatedLogo size={48} />
//               <div>
//                 <h1 className="text-2xl sm:text-4xl font-bold">Bonjour, <span className="text-amber-400">{mockProfile.full_name}</span></h1>
//                 <p className="text-sm sm:text-base">Tableau de bord</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(6)].map((_, i) => <Skeleton key={i} className="w-full min-w-[200px] rounded-xl h-[120px]" />)}
//           </div>
//         ) : (
//           <div className="space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {stats.map(s => (
//                 <div key={s.title} className="bg-white rounded-xl p-4 shadow">
//                   <StatsCard {...s} />
//                 </div>
//               ))}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 bg-card/80 backdrop-blur border rounded-2xl p-6">
//                 <h3 className="text-xl font-semibold mb-4 flex gap-2 items-center"><Activity className="h-5 w-5 text-primary" /> Activité Récente</h3>

//                 <div className="space-y-4">
//                   {recentActivity.map((a, i) => (
//                     <div key={i} className="flex justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
//                       <div className="flex gap-3 items-center">
//                         <a.icon className={cn("w-6 h-6", a.color)} />
//                         <div>
//                           <p className="font-medium">{a.title}</p>
//                           <p className="text-xs text-muted-foreground">{a.client}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold">{new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(a.amount)}</p>
//                         <p className="text-xs text-muted-foreground">{a.time}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <Button className="w-full justify-start">Nouveau Client</Button>
//                 <Button className="w-full justify-start" variant="outline">Enregistrer Objet</Button>
//                 <Button className="w-full justify-start" variant="outline">Encaisser Paiement</Button>
//                 <Button className="w-full justify-start" variant="outline">Rappels du Jour</Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </PageWrapper>
//   );
// }
// import { useEffect, useState } from "react";
// import {
//   Users, Package2, ChartBar, Wallet,
//   AlertCircle, Activity, Clock, CheckCircle,
//   Shield, ChevronLeft, type LucideIcon
// } from "lucide-react";
// import Gem from "@/components/icons/Gem";

// import { useQuery } from "@tanstack/react-query";

// // Layout is applied by AppLayout; leave page content (hero + main) here
// import StatsCard from "@/components/StatsCard";
// import AnimatedLogo from "@/components/AnimatedLogo";
// import UserMenu from "@/components/UserMenu";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";

// import { clientsService, itemsService, transactionsService, paymentsService } from "@/services";
// import { cn } from "@/lib/utils";

// // ✅ Fake profile before auth setup
// const mockProfile = {
//   full_name: "Thierry Gogo",
//   email: "thierry.gogo@gagecashmoney.com",
//   avatar_url: null
// };

// // ✅ Demo Recent Activity (à remplacer plus tard par Supabase)
// const recentActivity = [
//   { icon: CheckCircle, title: 'Nouveau prêt validé', client: 'Marie Dubois', amount: 2500, time: 'Il y a 5 min', color: 'text-green-500' },
//   { icon: Clock, title: 'Échéance proche', client: 'Jean Martin', amount: 1200, time: 'Dans 2 jours', color: 'text-yellow-500' },
//   { icon: AlertCircle, title: 'Retard de paiement', client: 'Sophie Bernard', amount: 850, time: 'Il y a 1 jour', color: 'text-red-500' },
//   { icon: Activity, title: 'Évaluation terminée', client: 'Pierre Petit', amount: 3400, time: 'Il y a 15 min', color: 'text-blue-500' },
// ];

// import PageWrapper from "@/components/PageWrapper";

// export default function Dashboard() {
//   const [totals, setTotals] = useState({
//     activeClients: 0,
//     totalItems: 0,
//     itemsValue: 0,
//     activeLoans: 0,
//     totalLoaned: 0,
//     totalInterest: 0,
//     totalPayments: 0,
//     lateLoans: 0,
//   });

//   const { data: clients, isLoading: loadingClients } = useQuery({
//     queryKey: ["clients"],
//     queryFn: () => clientsService.getAll(),
//   });

//   const { data: items, isLoading: loadingItems } = useQuery({
//     queryKey: ["items"],
//     queryFn: () => itemsService.getAll(),
//   });

//   const { data: transactions, isLoading: loadingTransactions } = useQuery({
//     queryKey: ["transactions"],
//     queryFn: () => transactionsService.getAll(),
//   });

//   const { data: payments, isLoading: loadingPayments } = useQuery({
//     queryKey: ["payments"],
//     queryFn: () => paymentsService.getAll(),
//   });

//   const isLoading = loadingClients || loadingItems || loadingTransactions || loadingPayments;

//   useEffect(() => {
//     if (!isLoading && clients && items && transactions && payments) {
//       const today = new Date();
//       const activeTransactions = transactions.filter((t: any) => t.status === 'active');
//       const lateTransactions = activeTransactions.filter((t: any) => new Date(t.due_date) < today);

//       const totalLoaned = activeTransactions.reduce((sum: number, t: any) => sum + Number(t.loan_amount), 0);
//       const totalInterest = activeTransactions.reduce((sum: number, t: any) => sum + Number(t.loan_amount) * Number(t.interest_rate) / 100, 0);

//       setTotals({
//         activeClients: clients.length,
//         totalItems: items.length,
//         itemsValue: items.reduce((sum: number, item: any) => sum + Number(item.estimated_value), 0),
//         activeLoans: activeTransactions.length,
//         totalLoaned,
//         totalInterest,
//         totalPayments: payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0),
//         lateLoans: lateTransactions.length,
//       });
//     }
//   }, [clients, items, transactions, payments, isLoading]);

//   const stats: Array<{
//     title: string;
//     value: string;
//     icon: LucideIcon;
//     change: string;
//     changeType: "neutral" | "positive" | "negative";
//   }> = [
//       { title: "Clients", value: totals.activeClients.toString(), icon: Users, change: "0", changeType: "neutral" },
//       { title: "Objets en dépôt", value: totals.totalItems.toString(), icon: Package2, change: "0", changeType: "neutral" },
//       { title: "Valeur du stock", value: new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(totals.itemsValue), icon: ChartBar, change: "0", changeType: "neutral" },
//       { title: "Prêts actifs", value: totals.activeLoans.toString(), icon: Wallet, change: "0", changeType: "neutral" },
//       { title: "Capital engagé", value: new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(totals.totalLoaned), icon: Gem as LucideIcon, change: "0", changeType: "neutral" },
//       { title: "Intérêts attendus", value: new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(totals.totalInterest), icon: Activity, change: "0", changeType: "neutral" },
//       { title: "Paiements reçus", value: new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(totals.totalPayments), icon: Shield, change: "0", changeType: "neutral" },
//       { title: "Retards", value: totals.lateLoans.toString(), icon: AlertCircle, change: "0", changeType: "neutral" },
//     ];

//   return (
//     <PageWrapper maxWidth="6xl" noPadding>
//       <div className="w-full">
//         {/* Hero Banner */}
//         <div className="w-full mb-6">
//           <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl">
//             {/* Reserve the hero area height to avoid layout shift; load image eagerly */}
//             <img
//               src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"
//               alt="Gage en Cash Money"
//               loading="eager"
//               className="absolute inset-0 w-full h-full object-cover object-center"
//             />
//             <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />

//             <div className="absolute inset-0 opacity-10" style={{
//               backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpolygon points="0 0 20 0 10 10"%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E")',
//               backgroundSize: '15px 15px'
//             }} />

//             <div className="relative h-full flex items-center px-8">
//               <div className="max-w-3xl space-y-6">
//                 <div className="flex items-center gap-4 mb-2">
//                   <AnimatedLogo size={64} className="filter drop-shadow-lg" />
//                   <div className="h-12 w-px bg-white/20" />
//                   <div>
//                     <h2 className="text-white/90 font-medium">Gage en Cash Money</h2>
//                     <p className="text-white/60 text-sm">Prêts sur Gages Premium & Services Financiers VIP</p>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h1 className="text-4xl font-bold text-white tracking-tight">
//                     {new Date().getHours() < 12 ? 'Bonjour' : new Date().getHours() < 18 ? 'Bon après-midi' : 'Bonsoir'},
//                     <span className="text-amber-400 ml-2">{mockProfile.full_name}</span> 👋
//                 </div>
//               </div>
//             </div>
//             )}
//           </div>
//         </PageWrapper>
//         );
//     }
//         <span className="text-white font-medium">Super Administrateur</span>
//       </div>

//       <div className="flex items-center gap-2 bg-emerald-500/10 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20">
//         <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//         <span className="text-emerald-300 font-medium">Système Actif</span>
//       </div>

//       <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full">
//         <Clock className="w-4 h-4 text-white/70" />
//         <time className="text-white/70">
//           {new Date().toLocaleTimeString('fr-FR', {
//             hour: '2-digit',
//             minute: '2-digit'
//           })}
//         </time>
//       </div>
//     </div>
//               </div >

//     <div className="absolute right-8 top-1/2 -translate-y-1/2">
//       <Gem className="w-32 h-32 text-amber-400/20 rotate-12" />
//     </div>
//             </div >
//           </div >
//         </div >

//     {/* SKELETON LOADING for stats cards — rendered instantly, replaced by cards when data is available */ }
//   {
//     isLoading ? (
//       <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[...Array(8)].map((_, i) => (
//           <Skeleton key={i} className="w-full min-w-[200px] rounded-xl h-[136px]" />
//         ))}
//       </div>
//     ) : (
//       <div className="space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat) => (
//             <div key={stat.title}>
//               <StatsCard {...stat} />
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 bg-card/80 backdrop-blur border rounded-2xl p-6">
//             <h3 className="text-xl font-semibold mb-4 flex gap-2 items-center">
//               <Activity className="h-5 w-5 text-primary" /> Activité Récente
//             </h3>

//             <div className="space-y-4">
//               {recentActivity.map((a, i) => (
//                 <div
//                   key={i}
//                   className="flex justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
//                 >
//                   <div className="flex gap-3 items-center">
//                     <a.icon className={cn("w-6 h-6", a.color)} />
//                     <div>
//                       <p className="font-medium">{a.title}</p>
//                       <p className="text-xs text-muted-foreground">{a.client}</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold">{new Intl.NumberFormat("fr-CI", { style: "currency", currency: "XOF" }).format(a.amount)}</p>
//                     <p className="text-xs text-muted-foreground">{a.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="space-y-3">
//             <Button className="w-full justify-start">Nouveau Client</Button>
//             <Button className="w-full justify-start" variant="outline">Enregistrer Objet</Button>
//             <Button className="w-full justify-start" variant="outline">Encaisser Paiement</Button>
//             <Button className="w-full justify-start" variant="outline">Rappels du Jour</Button>
//           </div>

//         </div>
//       </div>
//     )
//   }
//       </div >
//     </div >
//     </div >
//   );
// }
