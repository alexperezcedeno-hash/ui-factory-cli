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

export default function fixClient() {
  console.log(chalk.blue("🔧 Escaneando componentes para inyectar 'use client'..."));

  let fixedCount = 0;
  const srcDir = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDir)) {
    console.log(chalk.red("❌ No se encontró la carpeta 'src'."));
    return;
  }

  walkDir(srcDir, filePath => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      const usesHooks = /use(State|Effect|Ref|Memo|Callback|Context|Reducer|LayoutEffect)/.test(content);
      const usesFramer = /framer-motion/.test(content);
      
      if (usesHooks || usesFramer) {
        if (!content.includes('"use client"') && !content.includes("'use client'")) {
          // Extraer comentarios del inicio si los hay para poner use client debajo (opcional)
          // Pero lo más seguro es ponerlo justo al principio de todo
          const newContent = `"use client";\n\n${content}`;
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(chalk.gray(`✅ 'use client' inyectado en ${path.relative(process.cwd(), filePath)}`));
          fixedCount++;
        }
      }
    }
  });

  if (fixedCount === 0) {
    console.log(chalk.green("✨ Todos tus componentes dinámicos ya tienen 'use client'."));
  } else {
    console.log(chalk.green(`\n🎉 Fix completado. Se añadieron directivas en ${fixedCount} archivos.`));
    printHook(fixedCount * 50);
  }
}
