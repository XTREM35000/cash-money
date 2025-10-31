import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemins des fichiers à nettoyer
const pagesDir = path.resolve(__dirname, '../pages');
const files = [
  'Index.tsx',
  'Dashboard.tsx',
  'Clients.tsx',
  'NotFound.tsx'
];

// Configuration des tailles maximales par page
const maxWidthConfig = {
  'Index.tsx': 'xl',
  'Dashboard.tsx': '6xl',
  'Clients.tsx': '6xl',
  'NotFound.tsx': 'xl'
};

// Nettoyer chaque fichier
for (const file of files) {
  const filePath = path.join(pagesDir, file);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Nettoyer les balises fermantes en trop
    content = content.replace(/<\/div>\s*<\/div>\s*\n\s*<\/PageWrapper>/g, '\n    </PageWrapper>');

    // Mettre à jour la taille maximale
    content = content.replace(
      /maxWidth="[^"]*"/,
      `maxWidth="${maxWidthConfig[file]}"`
    );

    // Nettoyer les lignes vides en trop
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    // Écrire les changements
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned ${file}`);
  } else {
    console.log(`❌ File not found: ${file}`);
  }
}

console.log('🎉 Format cleanup completed!');