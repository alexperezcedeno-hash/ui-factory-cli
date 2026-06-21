import chalk from 'chalk';

export function printHook(savedTokens = 0) {
  console.log("");
  if (savedTokens > 0) {
    console.log(chalk.green(`✨ ¡Éxito! Aproximadamente ${savedTokens} tokens de IA ahorrados.`));
  }
  console.log(chalk.cyan(`🚀 Herramienta creada por Alex Perez Cedeno (@alexcodeui).`));
  console.log(chalk.yellow(`👉 Sígueme en X: https://x.com/alexcodeui`));
  console.log(chalk.magentaBright(`👉 Próximamente: The UI Factory - Componentes hiper-dinámicos listos para IA.`));
  console.log("");
}
