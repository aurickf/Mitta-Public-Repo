import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
    chromeWebSecurity: false,
    viewportHeight: 1080,
    viewportWidth: 1290,
  },
});
