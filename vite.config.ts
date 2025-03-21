import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
const host = process.env.TAURI_DEV_HOST;

// Find the actual path to the package
function findPackagePath(packageName: string) {
  const basePath = path.resolve(__dirname, 'node_modules/.pnpm');
  const folders = fs.readdirSync(basePath);

  // Look for folders that start with the package name
  const packageFolder = folders.find((folder) =>
    folder.startsWith(`${packageName}@`)
  );

  if (packageFolder) {
    return path.join(
      basePath,
      packageFolder,
      'node_modules',
      packageName,
      'index.js'
    );
  }

  return null;
}

// https://vitejs.dev/config/
// @ts-expect-error  tailwindcss plugin always has this type error
export default defineConfig(async () => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // the reason this exists is because the when we use remark in a web worker,
      // it's dependent on this dependency, but the version used is `index.dom.js`,
      // which references `document` that doesn't exist in web worker
      // This is a known issue for a while and the workaround is specified here:
      // https://github.com/orgs/remarkjs/discussions/1083#discussioncomment-4347349
      'decode-named-character-reference':
        findPackagePath('decode-named-character-reference') ||
        'decode-named-character-reference',
    },
  },
  worker: {
    format: 'es',
    plugins: [],
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
}));
