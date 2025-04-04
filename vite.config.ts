import type { UserConfig } from "vite";

export default {
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },
  },
} satisfies UserConfig;
