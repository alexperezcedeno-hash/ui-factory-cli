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

export default function themeCheck() {
  console.log(chalk.blue("🎨 Escaneando soporte de Modo Oscuro (dark:)..."));

  const componentsDir = path.join(process.cwd(), 'src', 'components');
  if (!fs.existsSync(componentsDir)) {
    console.log(chalk.red("❌ No se encontró la carpeta 'src/components'."));
    return;
  }

  let componentsWithoutDark = [];
  let totalComponents = 0;

  walkDir(componentsDir, filePath => {
    if (filePath.endsWith('.tsx')) {
      totalComponents++;
      const content = fs.readFileSync(filePath, 'utf8');
      
      const hasDarkLogic = content.includes('dark:');
      
      if (!hasDarkLogic) {
        componentsWithoutDark.push(path.basename(filePath));
      }
    }
  });

  console.log(chalk.gray(`\n📊 Escaneados ${totalComponents} componentes en src/components/`));

  if (componentsWithoutDark.length === 0) {
    console.log(chalk.green("✨ ¡Perfecto! Todos tus componentes soportan el Modo Oscuro."));
  } else {
    console.log(chalk.yellow(`\n⚠️  Se encontraron ${componentsWithoutDark.length} componentes sin soporte de modo oscuro ('dark:' classes):`));
    componentsWithoutDark.forEach(c => console.log(chalk.gray(`   - ${c}`)));
    console.log(chalk.cyan("\n💡 Recuerda usar clases como 'bg-white dark:bg-black' para soportar ambos modos de Tailwind."));
    printHook(40);
  }
}
