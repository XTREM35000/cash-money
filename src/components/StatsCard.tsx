import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  delay?: number;
}

const StatsCard = ({ icon: Icon, title, value, change, changeType, delay = 0 }: StatsCardProps) => {
  const changeColor = changeType === 'positive' ? 'text-success' : changeType === 'negative' ? 'text-destructive' : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-opacity duration-300" />
      <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-glass hover:shadow-elevated transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-lg">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className={`text-sm font-semibold ${changeColor}`}>
            {change}
          </span>
        </div>
        <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
