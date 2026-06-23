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

function resolveImportPath(importPath, currentFilePath) {
  let absolutePath = '';
  // Basic alias resolution assuming @/ maps to src/
  if (importPath.startsWith('@/')) {
    absolutePath = path.join(process.cwd(), 'src', importPath.replace('@/', ''));
  } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
    absolutePath = path.join(path.dirname(currentFilePath), importPath);
  } else {
    return null; // Node modules or other
  }

  // Check extensions
  const extensions = ['.tsx', '.ts', '.jsx', '.js'];
  if (fs.existsSync(absolutePath) && !fs.statSync(absolutePath).isDirectory()) {
    return absolutePath;
  }
  
  for (const ext of extensions) {
    if (fs.existsSync(absolutePath + ext)) return absolutePath + ext;
  }
  
  // Try index files
  for (const ext of extensions) {
    const indexPath = path.join(absolutePath, `index${ext}`);
    if (fs.existsSync(indexPath)) return indexPath;
  }

  return null;
}

export default function deadCode() {
  console.log(chalk.blue("👻 Buscando archivos huérfanos con AST Analyzer..."));

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

  const usedFiles = new Set();

  // Parse all files to find imports
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let ast;
    try {
      ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });
    } catch (e) {
      return;
    }

    traverse(ast, {
      ImportDeclaration(pathNode) {
        const source = pathNode.node.source.value;
        const resolved = resolveImportPath(source, file);
        if (resolved) {
          usedFiles.add(resolved.replace(/\\/g, '/'));
        }
      },
      CallExpression(pathNode) {
        if (pathNode.node.callee.type === 'Import' || pathNode.node.callee.name === 'require') {
          if (pathNode.node.arguments.length > 0 && pathNode.node.arguments[0].type === 'StringLiteral') {
            const source = pathNode.node.arguments[0].value;
            const resolved = resolveImportPath(source, file);
            if (resolved) {
              usedFiles.add(resolved.replace(/\\/g, '/'));
            }
          }
        }
      }
    });
  });

  const checkDirs = ['src/components', 'src/lib', 'src/hooks', 'src/utils'];
  const candidates = allFiles.filter(f => checkDirs.some(d => f.includes(d)));
  
  const orphans = [];

  candidates.forEach(cand => {
    const parsed = path.parse(cand);
    const baseName = parsed.name;
    if (baseName === 'index' || baseName === 'layout' || baseName === 'page' || baseName === 'route') return;
    
    // Si el archivo no está en la lista de usados
    if (!usedFiles.has(cand)) {
      orphans.push(cand);
    }
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
