# Prompts Log

---

## Step 1 — Project Scaffold

**Prompt**:
User said "local + proceed" confirming:
- Use `next/font/local` for Manrope font
- Proceed with Step 1 implementation

Full plan confirmed prior to this:
- Downgrade Next.js 16 → 15.x
- Move app/ → src/app/
- Update tsconfig.json path alias to src/*
- Install lucide-react, vitest, @testing-library/* stack
- Create vitest.config.ts + src/test/setup.ts
- Write globals.css with Tailwind v4 design tokens from design/README.md
- Write layout.tsx with next/font/local Manrope
- Create full src/ folder structure
- Copy data/data.json → src/data/data.json
- Create experiment/ folder and all log files

**Notes**:
- `create-next-app` had Next.js 16.2.2; downgraded to 15.5.14 via `npm install next@^15`
- Tailwind 4.2.2 was already installed
- `@custom-variant dark` syntax confirmed from Tailwind dist source inspection
- `node_modules/next/dist/docs/` does not exist in Next.js 15 (was a Next.js 16 addition)
- Vitest 4.1.2 and @vitejs/plugin-react 6.0.1 installed
