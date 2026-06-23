import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { printHook } from '../utils/logger.js';
import { parse } from '@babel/parser';
import traverseModule from '@babel/traverse';

const traverse = traverseModule.default || traverseModule;

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (dirPath.includes('node_modules') || dirPath.includes('.next')) return;
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

export default function splitCheck() {
  console.log(chalk.blue("⚖️  Auditando componentes gigantes (Fat Components Analyzer)..."));

  const srcDir = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDir)) {
    console.log(chalk.red("❌ No se encontró la carpeta 'src'."));
    return;
  }

  const fatComponents = [];

  walkDir(srcDir, filePath => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      const linesCount = content.split('\n').length;
      
      let ast;
      try {
        ast = parse(content, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript']
        });
      } catch (e) {
        return;
      }

      let hooksCount = 0;
      
      traverse(ast, {
        CallExpression(pathNode) {
          if (pathNode.node.callee.type === 'Identifier') {
            if (/^use[A-Z]/.test(pathNode.node.callee.name)) {
              hooksCount++;
            }
          }
        }
      });

      // Threshold: more than 250 lines or more than 8 hooks
      if (linesCount > 250 || hooksCount > 8) {
        fatComponents.push({
          file: path.relative(process.cwd(), filePath),
          lines: linesCount,
          hooks: hooksCount
        });
      }
    }
  });

  if (fatComponents.length === 0) {
    console.log(chalk.green("✨ ¡Excelente arquitectura! Ningún componente supera los límites recomendados."));
  } else {
    console.log(chalk.yellow(`\n⚠️  Se encontraron ${fatComponents.length} componentes "monstruo" que consumen muchos tokens de IA:`));
    fatComponents.forEach(c => {
      let reason = [];
      if (c.lines > 250) reason.push(`${c.lines} líneas`);
      if (c.hooks > 8) reason.push(`${c.hooks} hooks`);
      console.log(chalk.gray(`   - ${c.file} `) + chalk.red(`[${reason.join(', ')}]`));
    });
    console.log(chalk.cyan("\n💡 Sugerencia: Extrae lógica a Custom Hooks o divide el JSX en sub-componentes más pequeños para ahorrar tokens de contexto."));
    printHook(fatComponents.length * 200);
  }
}
