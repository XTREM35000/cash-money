import React from 'react';
import { motion } from 'framer-motion';
import { Coins, DollarSign } from 'lucide-react';

interface AnimatedLogoProps {
  size?: number;
  animated?: boolean;
  showText?: boolean;
  mainColor?: string;
  secondaryColor?: string;
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 40,
  animated = true,
  showText = false,
  mainColor = 'text-amber-400',
  secondaryColor = 'text-yellow-600',
  className = ''
}) => {
  const mainIconSize = Math.round(size * 0.7);
  const secondaryIconSize = Math.round(size * 0.38);

  return (
    <div className={`flex items-center gap-2 ${className}`} style={{ height: size }}>
      <motion.div
        className="relative"
        animate={animated ? { y: [0, -6, 0], rotate: [0, 5, -5, 0] } : undefined}
        transition={animated ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        <Coins className={`${mainColor} drop-shadow-lg`} style={{ width: mainIconSize, height: mainIconSize }} />
        <DollarSign 
          className={`${secondaryColor} absolute -top-1 -right-1`} 
          style={{ width: secondaryIconSize, height: secondaryIconSize }} 
        />
      </motion.div>

      {showText && (
        <span className="font-semibold text-sm text-gray-900 dark:text-white">GageMoney</span>
      )}
    </div>
  );
};

export default AnimatedLogo;
