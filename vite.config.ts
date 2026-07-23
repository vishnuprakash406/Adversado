import vinext from "vinext";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

export default defineConfig(async ({ command }) => {
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";
  const cloudflarePlugin = command === "build"
    ? [(await import("@cloudflare/vite-plugin")).cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: {
          main: "./worker/index.ts",
          compatibility_flags: ["nodejs_compat"]
        }
      })]
    : [];
  return {
    publicDir: "public",
    plugins: [
      vinext(),
      sites(),
      ...cloudflarePlugin
    ]
  };
});
