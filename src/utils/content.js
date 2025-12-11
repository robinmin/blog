import { getCollection } from "astro:content";

// Only return posts without `draft: true` in the frontmatter

export const latestPosts = (
	await getCollection("blog", ({ data }) => {
		return data.draft !== true;
	})
).sort((a, b) => {
	if (a.data.featured && !b.data.featured) return -1;
	if (!a.data.featured && b.data.featured) return 1;
	return (
		new Date(b.data.publishDate).valueOf() -
		new Date(a.data.publishDate).valueOf()
	);
});
