<div align="center">

# 🤖 UI FACTORY CLI

![NPM Version](https://img.shields.io/npm/v/@alexcodeui/ui-factory-cli?style=for-the-badge&color=ff00ff)
![License](https://img.shields.io/npm/l/@alexcodeui/ui-factory-cli?style=for-the-badge&color=000000)
[![Twitter URL](https://img.shields.io/twitter/follow/alexcodeui?style=for-the-badge&color=1DA1F2)](https://twitter.com/alexcodeui)

**The Ultimate Next.js Agent Companion CLI**<br>
*Save AI context tokens, automate the boilerplate, and build faster.*

</div>

---

## ⚡ Stop Wasting AI Tokens

Are you building Next.js applications using AI assistants (Claude, ChatGPT, Cursor)? 
Stop wasting your context window and API tokens by making the AI manually scan for dead code, missing `"use client"` directives, or unused imports. 

**UI Factory CLI** is a suite of hyper-fast local tools designed to do the "dirty work" locally in milliseconds, saving you massive amounts of tokens and preventing your AI from getting stuck in repetitive loops.

---

## 🚀 Quick Start (No Installation Required)

You don't need to install anything. Just run the interactive CLI in the root of your Next.js project:

```bash
npx @alexcodeui/ui-factory-cli
```

> **🌎 Bilingual Support:** The interactive menu automatically supports English and Spanish!

### The Premium Interactive Menu
When you run the command, you will be greeted by our beautiful interactive menu where you can navigate with your arrow keys:

```text
? What optimization do you want to apply to your project?
❯ ✨ Generate Component (Scaffold)
  🧹 Clean Unused Icons (Prune Icons)
  👻 Scan Dead Code (Dead Code)
  🔧 Inject 'use client' in Hooks (Fix Client)
  🔐 Sync Environment Variables (.env.example)
  🎨 Check Dark Mode Support (Theme Check)
```

---

## 🛠️ Direct Commands (Pro Toolkit)

If you prefer to skip the interactive menu, you can run the commands directly:

### 1. `generate <name>`
Scaffold universal React components with the best practices instantly.
```bash
npx @alexcodeui/ui-factory-cli generate "Glitch Button"
```

### 2. `prune-icons`
Did the AI leave unused `react-icons` imports in your file? This command safely scans and removes them.
```bash
npx @alexcodeui/ui-factory-cli prune-icons
```

### 3. `dead-code`
The Ghost Hunter. Scans your entire `src/` folder and lists components, hooks, or utils that you created but are no longer imported anywhere.
```bash
npx @alexcodeui/ui-factory-cli dead-code
```

### 4. `fix-client`
The Next.js Savior. Scans your components and automatically injects `"use client";` if it detects the use of React hooks (`useState`, `useEffect`) or `framer-motion`.
```bash
npx @alexcodeui/ui-factory-cli fix-client
```

### 5. `sync-env`
Scans your code for `process.env.*` usage and automatically generates/updates a clean `.env.example` file so your team knows which keys are required.
```bash
npx @alexcodeui/ui-factory-cli sync-env
```

### 6. `theme-check`
Linter that checks the coverage of the `dark:` tailwind class in your components, ensuring your UI looks great at night.
```bash
npx @alexcodeui/ui-factory-cli theme-check
```

---

<div align="center">

### 🎁 Created by [@alexcodeui](https://x.com/alexcodeui)
*Coming soon: **The UI Factory** — Hyper-dynamic React components for the AI era.*

</div>
