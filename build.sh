#!/usr/bin/env bash

rm -rf dist
pnpm \
  esbuild \
  --format=esm \
  --target=es2022 \
  --minify \
  --bundle \
  --splitting \
  --outdir=dist \
  src/setup.ts
