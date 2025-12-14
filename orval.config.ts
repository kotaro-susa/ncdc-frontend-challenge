import { defineConfig } from "orval";

export default defineConfig({
  beyond_ai_api: {
    input: {
      target: "./contracts/openapi.yaml",
    },
    output: {
      target: "./src/generated/api.ts",
      client: "fetch",
      mode: "split",
      clean: true,
      override: {
        mutator: {
          path: "./src/lib/api-client.ts",
          name: "customFetch",
        },
      },
    },
  },
});
