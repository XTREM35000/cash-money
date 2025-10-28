import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, DollarSign, Clock, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import UserMenu from '@/components/UserMenu';

const Dashboard = () => {
  // Mock profile data for demo
  const mockProfile = {
    full_name: "Thierry Gogo",
    email: "thierry.gogo@montdepiete.com",
    avatar_url: null
  };
  const stats = [
    { icon: DollarSign, title: 'Prêts Actifs', value: '287 450 €', change: '+12.5%', changeType: 'positive' as const, delay: 0.1 },
    { icon: Users, title: 'Clients', value: '1,234', change: '+8.2%', changeType: 'positive' as const, delay: 0.2 },
    { icon: Package, title: 'Objets en Dépôt', value: '856', change: '-3.1%', changeType: 'negative' as const, delay: 0.3 },
    { icon: TrendingUp, title: 'CA du Mois', value: '45 230 €', change: '+18.7%', changeType: 'positive' as const, delay: 0.4 },
  ];

  const recentActivity = [
    { icon: CheckCircle, title: 'Nouveau prêt validé', client: 'Marie Dubois', amount: '2,500 €', time: 'Il y a 5 min', color: 'text-success' },
    { icon: Clock, title: 'Échéance proche', client: 'Jean Martin', amount: '1,200 €', time: 'Dans 2 jours', color: 'text-warning' },
    { icon: AlertCircle, title: 'Retard de paiement', client: 'Sophie Bernard', amount: '850 €', time: 'Il y a 1 jour', color: 'text-destructive' },
    { icon: Activity, title: 'Évaluation terminée', client: 'Pierre Petit', amount: '3,400 €', time: 'Il y a 15 min', color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-40"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏦</div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  MontDePiété Pro
                </h1>
                <p className="text-sm text-muted-foreground">Tableau de bord</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                Notifications
              </Button>
              <Button size="sm" className="bg-gradient-primary">
                Nouveau Prêt
              </Button>
              <UserMenu 
                profile={mockProfile} 
                isSuperAdmin={true}
                isAdmin={false}
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bienvenue, Thierry 👋
          </h2>
          <p className="text-muted-foreground">
            Voici un aperçu de votre activité aujourd'hui
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-glass"
          >
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activité Récente
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className={`p-2 rounded-lg ${activity.color} bg-current/10`}>
                    <activity.icon className={`h-5 w-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{activity.amount}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-glass"
          >
            <h3 className="text-xl font-bold text-foreground mb-6">
              Actions Rapides
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-gradient-primary text-primary-foreground" size="lg">
                <Users className="mr-2 h-5 w-5" />
                Nouveau Client
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Package className="mr-2 h-5 w-5" />
                Enregistrer Objet
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <DollarSign className="mr-2 h-5 w-5" />
                Encaisser Paiement
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Clock className="mr-2 h-5 w-5" />
                Rappels du Jour
              </Button>
            </div>

            {/* Info Card */}
            <div className="mt-6 p-4 bg-gradient-primary rounded-xl">
              <p className="text-sm text-primary-foreground/90 font-medium mb-2">
                💡 Astuce du jour
              </p>
              <p className="text-xs text-primary-foreground/80">
                Utilisez les raccourcis clavier pour accélérer votre workflow quotidien.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
