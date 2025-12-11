// https://astro.build/config

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

import rehypePluginImageNativeLazyLoading from "rehype-plugin-image-native-lazy-loading";
import { remarkReadingTime } from "./src/utils/all";

export default defineConfig({
	site: "https://gobing.pages.dev/",
	markdown: {
		remarkPlugins: [remarkReadingTime],
		rehypePlugins: [rehypePluginImageNativeLazyLoading],
		extendDefaultPlugins: true,
	},
	integrations: [tailwind(), mdx(), sitemap(), icon()],
});
