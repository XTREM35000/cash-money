import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemins des fichiers à mettre à jour
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

// Mise à jour de chaque fichier
for (const file of files) {
  const filePath = path.join(pagesDir, file);

  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Ajouter l'import si nécessaire
    if (!content.includes("import PageWrapper")) {
      content = `import PageWrapper from '@/components/PageWrapper';\n${content}`;
    }

    // Remplacer la structure div externe par PageWrapper
    content = content.replace(
      /return \(\s*<div[^>]*>\s*<div[^>]*>/g,
      `return (\n    <PageWrapper maxWidth="${maxWidthConfig[file]}">`
    );

    // Nettoyer les fermetures de div en trop
    content = content.replace(
      /\s*<\/div>\s*<\/div>\s*\);/g,
      '\n    </PageWrapper>\n  );'
    );

    // Écrire les changements
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${file}`);
  } else {
    console.log(`❌ File not found: ${file}`);
  }
}

console.log('🎉 Page wrapper updates completed!');