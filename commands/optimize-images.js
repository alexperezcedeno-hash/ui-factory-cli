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

export default function optimizeImages() {
  console.log(chalk.blue("🖼️  Buscando etiquetas crudas <img> para optimizar (Análisis AST)..."));

  let unoptimizedCount = 0;
  const srcDir = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDir)) {
    console.log(chalk.red("❌ No se encontró la carpeta 'src'."));
    return;
  }

  const problematicFiles = [];

  walkDir(srcDir, filePath => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      let ast;
      try {
        ast = parse(content, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript']
        });
      } catch (e) {
        return;
      }

      let hasRawImg = false;
      
      traverse(ast, {
        JSXOpeningElement(pathNode) {
          if (pathNode.node.name.type === 'JSXIdentifier' && pathNode.node.name.name === 'img') {
            hasRawImg = true;
          }
        }
      });

      if (hasRawImg) {
        problematicFiles.push(path.relative(process.cwd(), filePath));
        unoptimizedCount++;
      }
    }
  });

  if (unoptimizedCount === 0) {
    console.log(chalk.green("✨ ¡Perfecto! Todas tus imágenes están optimizadas (no usas <img> crudo)."));
  } else {
    console.log(chalk.yellow(`\n⚠️  Se encontraron etiquetas <img> crudas en ${unoptimizedCount} archivos:`));
    problematicFiles.forEach(file => console.log(chalk.gray(`   - ${file}`)));
    console.log(chalk.cyan("\n💡 Sugerencia: Cambia estas etiquetas por el componente <Image> de 'next/image' para mejorar el performance y LCP."));
    printHook(unoptimizedCount * 30);
  }
}
