import { createRoot } from "react-dom/client";
import { startTransition } from "react";
import App from "./App.tsx";
import "./index.css";

// Précharger les ressources clés
const preloadResources = async () => {
  const images = [
    // Ajoutez ici les chemins des images importantes
  ];

  // Préchargement des images
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

// Initialiser l'application de manière asynchrone
const initApp = async () => {
  // Démarrer le préchargement en arrière-plan
  preloadResources();

  const container = document.getElementById("root");
  const root = createRoot(container!);

  // Envelopper le rendu dans startTransition pour ne pas bloquer l'UI
  startTransition(() => {
    root.render(<App />);
  });
};

initApp();
