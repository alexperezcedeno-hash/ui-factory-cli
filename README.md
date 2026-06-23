<div align="center">

# 🤖 UI FACTORY CLI (AST EDITION)

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

🔥 **NEW IN v1.0.4+ (AST Edition):** The CLI now uses `@babel/parser` and `@babel/traverse` to read your code natively as an Abstract Syntax Tree. 100% precision, no regex false positives!

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
  🖼️  Optimize Images (next/image)
  ⚖️  Split Check (Fat Components)
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
AST-based scan to safely remove unused `react-icons` or `lucide-react` imports.
```bash
npx @alexcodeui/ui-factory-cli prune-icons
```

### 3. `dead-code`
The Ghost Hunter. AST parser resolves aliased imports (`@/components`) to find completely orphaned files in your `src/` folder.
```bash
npx @alexcodeui/ui-factory-cli dead-code
```

### 4. `fix-client`
The Next.js Savior. Injects `"use client";` safely below existing directives if it detects React hooks or `framer-motion`.
```bash
npx @alexcodeui/ui-factory-cli fix-client
```

### 5. `sync-env`
Scans your code for `process.env.*` usage and updates your `.env.example`.
```bash
npx @alexcodeui/ui-factory-cli sync-env
```

### 6. `theme-check`
Checks the coverage of the `dark:` tailwind class in your components.
```bash
npx @alexcodeui/ui-factory-cli theme-check
```

### 7. `optimize-images`
Finds raw HTML `<img>` tags and suggests migrating to `<Image>` from `next/image` for better performance.
```bash
npx @alexcodeui/ui-factory-cli optimize-images
```

### 8. `split-check`
Identifies "fat components" (>250 lines or >8 hooks) that consume too many AI context tokens and suggests splitting them.
```bash
npx @alexcodeui/ui-factory-cli split-check
```

---

<div align="center">

### 🎁 Created by [@alexcodeui](https://x.com/alexcodeui)
*Coming soon: **The UI Factory** — Hyper-dynamic React components for the AI era.*

</div>

