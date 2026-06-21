#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import generate from '../commands/generate.js';
import pruneIcons from '../commands/prune-icons.js';
import deadCode from '../commands/dead-code.js';
import fixClient from '../commands/fix-client.js';
import syncEnv from '../commands/sync-env.js';
import themeCheck from '../commands/theme-check.js';
import { locales } from '../utils/i18n.js';
import { getConfig, saveConfig } from '../utils/config.js';

const program = new Command();

program
  .name('uifactory')
  .description('The Ultimate Next.js AI Agent Companion CLI. Ahorra tokens y mantén tu código limpio.')
  .version('1.0.3');

// Comandos por defecto de la terminal
program.command('generate <name>').action(generate);
program.command('prune-icons').action(pruneIcons);
program.command('dead-code').action(deadCode);
program.command('fix-client').action(fixClient);
program.command('sync-env').action(syncEnv);
program.command('theme-check').action(themeCheck);

// MENÚ INTERACTIVO PREMIUM
async function interactiveMenu() {
  console.clear();
  console.log(chalk.magentaBright(`
   ██╗   ██╗██╗    ███████╗ █████╗  ██████╗████████╗ ██████╗ ██████╗ ██╗   ██╗
   ██║   ██║██║    ██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝
   ██║   ██║██║    █████╗  ███████║██║        ██║   ██║   ██║██████╔╝ ╚████╔╝ 
   ██║   ██║██║    ██╔══╝  ██╔══██║██║        ██║   ██║   ██║██╔══██╗  ╚██╔╝  
   ╚██████╔╝██║    ██║     ██║  ██║╚██████╗   ██║   ╚██████╔╝██║  ██║   ██║   
    ╚═════╝ ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
  `));
  console.log(chalk.gray(`     🤖 The Ultimate Next.js Agent Companion CLI\n`));

  let config = getConfig();
  if (!config.lang) {
    const { lang } = await inquirer.prompt([
      {
        type: 'select',
        name: 'lang',
        message: '🌎 Choose your preferred language / Elige tu idioma preferido:',
        choices: [
          { name: '🇬🇧 English', value: 'en' },
          { name: '🇪🇸 Español', value: 'es' }
        ]
      }
    ]);
    saveConfig({ lang });
    config.lang = lang;
  }

  const t = locales[config.lang] || locales.en;

  const { action } = await inquirer.prompt([
    {
      type: 'select',
      name: 'action',
      message: t.menu_message,
      choices: [
        { name: t.opt_generate, value: 'generate' },
        { name: t.opt_prune, value: 'prune-icons' },
        { name: t.opt_deadcode, value: 'dead-code' },
        { name: t.opt_fixclient, value: 'fix-client' },
        { name: t.opt_syncenv, value: 'sync-env' },
        { name: t.opt_themecheck, value: 'theme-check' },
        new inquirer.Separator(),
        { name: t.opt_exit, value: 'exit' }
      ]
    }
  ]);

  if (action === 'exit') {
    console.log(chalk.gray(t.bye));
    process.exit(0);
  }

  if (action === 'generate') {
    const { componentName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'componentName',
        message: t.prompt_component_name,
        validate: input => input ? true : t.prompt_component_error
      }
    ]);
    generate(componentName);
  } else if (action === 'prune-icons') {
    pruneIcons();
  } else if (action === 'dead-code') {
    deadCode();
  } else if (action === 'fix-client') {
    fixClient();
  } else if (action === 'sync-env') {
    syncEnv();
  } else if (action === 'theme-check') {
    themeCheck();
  }
}

// Si el usuario escribe simplemente "uifactory" sin argumentos, lanzamos el menú interactivo
if (process.argv.length === 2) {
  interactiveMenu();
} else {
  // Si pone argumentos (ej: "uifactory prune-icons"), usa Commander normal
  program.parse(process.argv);
}
