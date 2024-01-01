import { defineConfig } from 'tsup';

export default defineConfig({
	target: 'esnext',
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: 'esm',
  minify: true,
	outDir: 'cli',
  sourcemap: process.env.NODE_ENV !== 'production',
  treeshake: 'recommended'
});
