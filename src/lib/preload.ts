// Fonction utilitaire pour précharger les images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Liste des ressources à précharger
export const criticalAssets = [
  '/profile01.png',
  // Ajoutez ici d'autres images critiques
];

// Précharge toutes les ressources critiques
export const preloadCriticalAssets = async () => {
  try {
    await Promise.all(criticalAssets.map(preloadImage));
    console.log('✅ Ressources critiques préchargées');
  } catch (error) {
    console.error('❌ Erreur lors du préchargement:', error);
  }
};