import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],          // 🔥 IMPORTANT CHANGE
  clean: true,
  banner: {
    js: "#!/usr/bin/env node"
  }
});
