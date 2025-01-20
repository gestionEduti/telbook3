import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [
    vue(),
    vueDevTools(), // comentar si da problemas de overlay en cypress
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        // presets
        'vue',
        'vue-router',
        { pinia: ['defineStore', 'storeToRefs', 'acceptHMRUpdate'] },
        // custom
        {
          '@/services/supabaseClient': ['supabase', 'supabaseClient'],
          // add more here instead of creating another object
        },
        // types
        // {
        //   from: 'src/types/supabase',
        //   imports: ['Database', 'Tables'],
        //   type: true,
        // },
        {
          from: 'src/types/Error',
          imports: ['CustomError', 'ExtendedPostgresError'],
          type: true,
        },
        {
          from: '@supabase/supabase-js',
          imports: ['QueryData', 'Session', 'User', 'PostgrestError'],
          type: true,
        },
      ],
      dirs: ['src/stores/**/*.ts'],
      dts: true,
      viteOptimizeDeps: true,
    }),
    Components({
      dts: true,
      dirs: ['src/components', 'src/views'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
