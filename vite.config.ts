import type { UserConfig } from "vite";

export default {
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },
  },
} satisfies UserConfig;
