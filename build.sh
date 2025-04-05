#!/usr/bin/env bash

pnpm \
  esbuild \
  --format=esm \
  --target=es2022 \
  --minify \
  --bundle \
  --splitting \
  --outdir=dist \
  --chunk-names="[name]" \
  src/setup.ts
