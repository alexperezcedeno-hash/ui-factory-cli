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

export default function syncEnv() {
  console.log(chalk.blue("🔐 Escaneando variables de entorno en uso..."));

  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.log(chalk.red("❌ No se encontró la carpeta 'src'."));
    return;
  }

  const envVars = new Set();
  
  walkDir(srcDir, filePath => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.match(/process\.env\.([A-Z0-9_]+)/g);
      if (matches) {
        matches.forEach(m => envVars.add(m.replace('process.env.', '')));
      }
    }
  });

  if (envVars.size === 0) {
    console.log(chalk.green("✨ No se encontraron variables de entorno en tu código."));
    return;
  }

  const envExamplePath = path.join(process.cwd(), '.env.example');
  let existingEnv = "";
  if (fs.existsSync(envExamplePath)) {
    existingEnv = fs.readFileSync(envExamplePath, 'utf8');
  }

  let added = 0;
  const newLines = [];
  envVars.forEach(v => {
    if (v === 'NODE_ENV') return;
    if (!existingEnv.includes(v)) {
      newLines.push(`${v}="your_${v.toLowerCase()}_here"`);
      added++;
    }
  });

  if (added > 0) {
    const finalContent = (existingEnv + "\n" + newLines.join("\n")).trim() + "\n";
    fs.writeFileSync(envExamplePath, finalContent, 'utf8');
    console.log(chalk.green(`✅ Se han sincronizado ${added} variables nuevas en .env.example`));
    console.log(chalk.gray(`   Variables detectadas:`));
    newLines.forEach(l => console.log(chalk.gray(`   + ${l}`)));
    printHook(30);
  } else {
    console.log(chalk.green("✨ Tu archivo .env.example ya está 100% sincronizado con tu código."));
  }
}
