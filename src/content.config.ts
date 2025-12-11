import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const BLOG_PATH = "src/blog_posts";

const BlogPosts = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "src/blog_posts" }),
	schema: ({ image }) =>
		z
			.object({
				title: z.string(),
				excerpt: z.string().optional(),
				description: z.string().optional(),
				category: z.string().trim().optional(),
				author: z.string().trim().default("Robin"),
				featured: z.boolean().default(false),
				draft: z.boolean().optional(),
				tags: z
					.array(z.string())
					.nullable()
					.default([])
					.transform((val) => val || []),
				image: z.string().or(image()).optional(),
				publishDate: z
					.string()
					.or(z.date())
					.transform((val) => new Date(val))
					.optional(),
				pubDatetime: z.coerce.date().optional(),
				date: z.coerce.date().optional(),
				modDatetime: z.coerce.date().optional().nullable(),
				ogImage: z.string().optional(),
				images: z.array(z.string()).optional(),
				// New fields for process_blog.sh
				seo: z
					.object({
						title: z.string().optional(),
						description: z.string().optional(),
						keywords: z.array(z.string()).optional(),
					})
					.optional(),
				ai: z
					.object({
						generated_description: z.boolean().optional(),
						generated_tags: z.boolean().optional(),
						illustration_prompt: z.string().optional(),
						thumbnail_prompt: z.string().optional(),
					})
					.optional(),
			})
			.transform((data) => ({
				...data,
				publishDate:
					data.publishDate || data.pubDatetime || data.date || new Date(),
				excerpt: data.excerpt || data.description || "",
				image:
					data.image ||
					(data.images && data.images.length > 0 ? data.images[0] : undefined),
			})),
});

export const collections = {
	blog: BlogPosts,
};
