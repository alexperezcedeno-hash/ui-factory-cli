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

export default function fixClient() {
  console.log(chalk.blue("🔧 Escaneando componentes para inyectar 'use client' (Análisis AST)..."));

  let fixedCount = 0;
  const srcDir = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDir)) {
    console.log(chalk.red("❌ No se encontró la carpeta 'src'."));
    return;
  }

  walkDir(srcDir, filePath => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
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

      let hasUseClient = false;
      let needsUseClient = false;
      let firstStatementLine = 1;

      if (ast.program.directives) {
        for (const dir of ast.program.directives) {
          if (dir.value.value === 'use client') {
            hasUseClient = true;
          }
        }
      }

      if (hasUseClient) return;

      if (ast.program.body.length > 0) {
        firstStatementLine = ast.program.body[0].loc.start.line;
      }

      traverse(ast, {
        ImportDeclaration(path) {
          if (path.node.source.value === 'framer-motion') {
            needsUseClient = true;
          }
        },
        CallExpression(path) {
          if (path.node.callee.type === 'Identifier') {
            const name = path.node.callee.name;
            if (/^use[A-Z]/.test(name)) {
              needsUseClient = true;
            }
          }
        }
      });

      if (needsUseClient) {
        const lines = content.split('\n');
        // Insert before the first statement, preserving comments at the top
        lines.splice(firstStatementLine - 1, 0, '"use client";\n');
        const newContent = lines.join('\n');
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(chalk.gray(`✅ 'use client' inyectado de forma segura en ${path.relative(process.cwd(), filePath)}`));
        fixedCount++;
      }
    }
  });

  if (fixedCount === 0) {
    console.log(chalk.green("✨ Todos tus componentes dinámicos ya tienen 'use client'."));
  } else {
    console.log(chalk.green(`\n🎉 Fix completado (AST). Se añadieron directivas en ${fixedCount} archivos.`));
    printHook(fixedCount * 50);
  }
}
