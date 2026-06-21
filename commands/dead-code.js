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

export default function deadCode() {
  console.log(chalk.blue("👻 Buscando archivos huérfanos (Código Muerto)..."));

  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.log(chalk.red("❌ No se encontró la carpeta 'src'."));
    return;
  }

  const allFiles = [];
  walkDir(srcDir, f => {
    if (f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')) {
      allFiles.push(f.replace(/\\/g, '/'));
    }
  });

  // Solo buscamos componentes, lib y utilidades (no pages/layouts ya que next las enruta)
  const checkDirs = ['src/components', 'src/lib', 'src/hooks', 'src/utils'];
  const candidates = allFiles.filter(f => checkDirs.some(d => f.includes(d)));
  
  const orphans = [];

  candidates.forEach(cand => {
    const parsed = path.parse(cand);
    const baseName = parsed.name;
    if (baseName === 'index' || baseName === 'layout' || baseName === 'page') return;
    
    const regex1 = new RegExp(`/${baseName}['"]`);
    const regex2 = new RegExp(`\\./${baseName}['"]`);
    
    let isUsed = false;
    for (const file of allFiles) {
      if (file === cand) continue; 
      const content = fs.readFileSync(file, 'utf8');
      if (regex1.test(content) || regex2.test(content)) {
        isUsed = true;
        break;
      }
    }
    
    if (!isUsed) orphans.push(cand);
  });

  if (orphans.length === 0) {
    console.log(chalk.green("✨ ¡Tu proyecto está inmaculado! No hay archivos huérfanos."));
  } else {
    console.log(chalk.yellow(`\n⚠️  Se encontraron ${orphans.length} archivos que no se importan en ninguna parte:`));
    orphans.forEach(o => console.log(chalk.gray(`   - ${path.relative(process.cwd(), o)}`)));
    console.log(chalk.cyan("\n💡 Revisa estos archivos antes de borrarlos manualmente."));
    printHook(orphans.length * 800);
  }
}
