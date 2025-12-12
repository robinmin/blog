import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
// Shiki Transformers
import {
	transformerNotationDiff,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from "@shikijs/transformers";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import pagefind from "astro-pagefind";
// Markdown & Content Plugins
import rehypePluginImageNativeLazyLoading from "rehype-plugin-image-native-lazy-loading";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
// Site Config
import { SITE } from "./src/config";
import { remarkReadingTime } from "./src/utils/all";
import { transformerFileName } from "./src/utils/transformers/fileName";

// https://astro.build/config
export default defineConfig({
	site: SITE.website,

	i18n: {
		defaultLocale: "zh",
		locales: ["en", "zh", "ja"],
		routing: {
			prefixDefaultLocale: false,
		},
	},

	integrations: [
		mdx(),
		sitemap({
			filter: (page) => SITE.showArchives || !page.endsWith("/archives"),
		}),
		icon(),
		pagefind(),
	],

	markdown: {
		remarkPlugins: [
			remarkReadingTime,
			remarkToc,
			[remarkCollapse, { test: "Table of contents" }],
		],
		// biome-ignore lint/suspicious/noExplicitAny: fix type mismatch
		rehypePlugins: [rehypePluginImageNativeLazyLoading as any],
		shikiConfig: {
			themes: { light: "min-light", dark: "night-owl" },
			defaultColor: false,
			wrap: false,
			transformers: [
				transformerFileName({ style: "v2", hideDot: false }),
				transformerNotationHighlight(),
				transformerNotationWordHighlight(),
				transformerNotationDiff({ matchAlgorithm: "v3" }),
			],
		},
	},

	vite: {
		plugins: [tailwindcss()],
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					if (
						warning.code === "UNUSED_EXTERNAL_IMPORT" &&
						// biome-ignore lint/suspicious/noExplicitAny: fix type mismatch
						(warning as any).source?.includes(
							"@astrojs/internal-helpers/remote",
						)
					) {
						return;
					}
					warn(warning);
				},
			},
		},
		optimizeDeps: {
			exclude: ["@resvg/resvg-js"],
		},
	},

	// Optional environment variable schema
	env: {
		schema: {
			// Add if needed based on original .ts
		},
	},
});
