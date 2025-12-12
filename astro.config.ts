import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
// Shiki Transformers
import {
	transformerNotationDiff,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
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
		defaultLocale: "en",
		locales: ["en", "zh", "ja"],
		routing: {
			prefixDefaultLocale: false,
		},
	},

	integrations: [
		tailwind({
			applyBaseStyles: false, // Let our own CSS handle generic base styles if needed, or set to true if default is preferred.
			// Note: .mjs didn't specify options, so it used default (true).
			// However, typical custom themes might want control. Let's stick to default (omit arg) to match .mjs behavior strictly.
		}),
		mdx(),
		sitemap({
			filter: (page) => SITE.showArchives || !page.endsWith("/archives"),
		}),
		icon(),
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
