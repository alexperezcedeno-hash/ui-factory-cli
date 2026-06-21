import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { printHook } from '../utils/logger.js';

export default function generate(name) {
  const componentNameStr = name;
  const kebabName = componentNameStr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const pascalName = kebabName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

  const componentsDir = path.join(process.cwd(), 'src', 'components', 'ui');
  
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  const componentPath = path.join(componentsDir, `${kebabName}.tsx`);
  if (fs.existsSync(componentPath)) {
    console.log(chalk.red(`❌ El componente ${kebabName} ya existe en ${componentPath}`));
    return;
  }

  const componentContent = `/* 
 * Scaffolded with @ui-factory/cli
 * Created by Alex Perez Cedeno (@alexcodeui)
 * Premium, dynamic components for the AI era.
 */
"use client";

import React from "react";

export const ${pascalName} = ({ className }: { className?: string }) => {
  return (
    <div className={\`relative p-4 bg-zinc-950 dark:bg-white text-white dark:text-black border border-white/10 dark:border-black/10 rounded-xl \${className || ""}\`}>
      <p className="font-bold uppercase tracking-widest">${componentNameStr}</p>
    </div>
  );
};
`;

  fs.writeFileSync(componentPath, componentContent, 'utf8');

  console.log(chalk.blue(`\n🚀 Generando componente universal...`));
  console.log(chalk.green(`📁 Creado: ${componentPath}`));
  
  printHook(150); // Approximated tokens saved
}
