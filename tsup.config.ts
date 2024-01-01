import { defineConfig } from 'tsup';

export default defineConfig({
	target: 'esnext',
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  format: 'esm',
  minify: true,
	outDir: 'bin',
  sourcemap: process.env.NODE_ENV !== 'production',
  treeshake: 'recommended'
});
