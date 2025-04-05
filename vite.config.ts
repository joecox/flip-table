import type { UserConfig } from "vite";

export default {
  build: {
    target: 'es2022',
    outDir: 'preview'
  },
} satisfies UserConfig;
