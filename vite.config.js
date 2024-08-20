import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    css: {
        // additionalData: `@import "/DED-WDS/src/styles/variables.scss";`
    },
    resolve: {
        alias: {
            // '@src': '/src',
            // '@style': '/src/style',
            // '@components': '/src/components',
            '@assets': '/src/assets',
        }
    },
    plugins: [dts()],
});