import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { printHook } from '../utils/logger.js';

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (dirPath.includes('node_modules') || dirPath.includes('.next')) return;
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

export default function pruneIcons() {
  console.log(chalk.blue("🧹 Escaneando importaciones de iconos no utilizados..."));

  let prunedCount = 0;
  const srcDir = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDir)) {
    console.log(chalk.red("❌ No se encontró la carpeta 'src'. Asegúrate de estar en la raíz de un proyecto Next.js."));
    return;
  }

  walkDir(srcDir, filePath => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      const importRegex = /import\s+{([^}]+)}\s+from\s+["'](react-icons\/[a-z0-9]+|lucide-react)["'];/g;
      let newContent = content;
      let modifiedFile = false;

      newContent = newContent.replace(importRegex, (fullImport, iconListStr, pkg) => {
        const icons = iconListStr.split(',').map(i => i.trim()).filter(i => i.length > 0);
        const usedIcons = [];
        
        const contentWithoutImport = content.replace(fullImport, '');

        icons.forEach(icon => {
          const usageRegex = new RegExp(`\\b${icon}\\b`);
          if (usageRegex.test(contentWithoutImport)) {
            usedIcons.push(icon);
          }
        });

        if (usedIcons.length !== icons.length) {
          modifiedFile = true;
          if (usedIcons.length === 0) {
            return '';
          } else {
            return `import { ${usedIcons.join(', ')} } from "${pkg}";`;
          }
        }
        return fullImport;
      });
      
      if (modifiedFile) {
        newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(chalk.gray(`✅ Limpiados iconos en ${path.relative(process.cwd(), filePath)}`));
        prunedCount++;
      }
    }
  });

  if (prunedCount === 0) {
    console.log(chalk.green("✨ ¡Todo limpio! No se encontraron importaciones de iconos sin usar."));
  } else {
    console.log(chalk.green(`\n🎉 Limpieza completa. Se optimizaron las importaciones en ${prunedCount} archivos.`));
    printHook(prunedCount * 120); // 120 tokens approx per file saved
  }
}
