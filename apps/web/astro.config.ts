import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import db from "@astrojs/db";
import node from "@astrojs/node";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [db(), icon(), tailwind()],
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});