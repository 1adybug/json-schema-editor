import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import { pluginSvgr } from "@rsbuild/plugin-svgr"

export default defineConfig({
    html: {
        template: "public/index.html",
    },
    plugins: [
        pluginReact(),
        pluginSvgr({
            svgrOptions: {
                exportType: "default",
            },
        }),
    ],
    server: {
        port: 5173,
    },
    output: {
        polyfill: "usage",
    },
})
