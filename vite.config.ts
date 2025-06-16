import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: "src/lib.ts",
            formats: ["es"],
        },
        minify: true,
        target: "modules",
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    // treat all tags with a dash as custom elements
                    isCustomElement: (tag) => tag.includes("-"),
                },
            },
        }),
        ,
        tailwindcss(),
    ],
});
