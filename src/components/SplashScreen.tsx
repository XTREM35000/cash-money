import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  /** pass true when the app has finished preloading data */
  isAppReady: boolean;
}

const SplashScreen = ({ isAppReady }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Keep the splash visible until the app reports ready.
  useEffect(() => {
    if (isAppReady) {
      // small delay to allow a smooth fade-out animation
      const t = setTimeout(() => setIsVisible(false), 450);
      return () => clearTimeout(t);
    }
  }, [isAppReady]);

  const services = [
    { icon: "💎", name: "Bijoux", delay: 0 },
    { icon: "⌚", name: "Montres", delay: 0.2 },
    { icon: "📱", name: "Électronique", delay: 0.4 },
    { icon: "🎨", name: "Art & Collection", delay: 0.6 },
    { icon: "💍", name: "Or & Métaux", delay: 0.8 },
    { icon: "💼", name: "Objets de Valeur", delay: 1.0 },
    { icon: "🔐", name: "Stockage Sécurisé", delay: 1.2 },
    { icon: "📊", name: "Expertise", delay: 1.4 }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Éléments flottants style "pièces et bijoux" */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl opacity-40"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '-50px',
                }}
                animate={{
                  y: [-50, -800],
                  opacity: [0, 0.8, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                {['💎', '💰', '🔑', '💍', '⌚', '📿'][i % 6]}
              </motion.div>
            ))}
          </div>

          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />

          <div className="relative text-center max-w-4xl mx-auto px-6">
            {/* Logo et titre principal */}
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                duration: 1
              }}
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{
                  y: [0, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* stylized gem symbol as fallback */}
                💎
              </motion.div>
              <h1 className="text-6xl font-bold text-white mb-4 tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                MontDePiété Pro
              </h1>
              <motion.p
                className="text-blue-100 text-xl font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Solution Professionnelle de Prêt sur Gages
              </motion.p>
            </motion.div>

            {/* Signature et photo */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {/* Texte de signature */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.p
                  className="text-blue-200 text-lg font-light mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Développé par
                </motion.p>
                <motion.h2
                  className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 1.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  Thierry Gogo
                </motion.h2>
                <motion.p
                  className="text-blue-300 text-md font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                >
                  Expert FinTech & Solutions Métier
                </motion.p>
              </motion.div>

              {/* Photo de profil */}
              <motion.div
                initial={{ scale: 0, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 2.0
                }}
              >
                <div className="relative inline-block">
                  <motion.div
                    className="w-20 h-20 rounded-full border-4 border-blue-400/80 shadow-2xl overflow-hidden bg-gray-200 mx-auto"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <img
                      src="/profile01.png"
                      alt="Thierry Gogo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute -inset-2 rounded-full border-2 border-cyan-400/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Badge de sécurité */}
                  <motion.div
                    className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2.5 }}
                  >
                    🔒
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Grille des services */}
            <motion.div
              className="grid grid-cols-4 gap-6 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  className="text-center group"
                  initial={{ opacity: 0, scale: 0, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 2.7 + service.delay,
                    type: "spring",
                    stiffness: 300
                  }}
                  whileHover={{
                    scale: 1.15,
                    y: -5,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                >
                  <motion.div
                    className="text-4xl mb-2 bg-gradient-to-br from-blue-400 to-purple-400 rounded-2xl p-3 shadow-lg group-hover:shadow-xl transition-all duration-300"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3 + index * 0.5,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  >
                    {service.icon}
                  </motion.div>
                  <p className="text-blue-100 text-sm font-medium group-hover:text-white transition-colors">
                    {service.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Barre de progression style "barre de métal précieux" */}
            <motion.div
              className="mt-8 w-80 h-3 bg-gray-700/50 rounded-full overflow-hidden mx-auto shadow-inner border border-gray-600/30"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow-lg relative"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
              >
                {/* Effet de brillance sur la barre */}
                <motion.div
                  className="absolute top-0 left-0 w-20 h-full bg-white/30 skew-x-45"
                  animate={{ x: [-100, 400] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Message de chargement */}
            <motion.div
              className="text-blue-200 text-sm mt-4 font-light space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              <p>Initialisation du système sécurisé...</p>
              <motion.p
                className="text-amber-300 font-medium"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🔐 Connexion cryptée active
              </motion.p>
            </motion.div>

            {/* Badges de sécurité en bas */}
            <motion.div
              className="flex justify-center gap-6 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5 }}
            >
              {['🔒 Bank-Level Security', '📊 RGPD Compliant', '💳 PCI DSS'].map((badge, index) => (
                <motion.span
                  key={badge}
                  className="text-xs text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-700/30"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 3.7 + index * 0.1 }}
                >
                  {badge}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
