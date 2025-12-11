export interface Props {
	title: string;
	slug: string;
	color: "green" | "blue" | "orange" | "purple" | "pink" | "gray";
	description: string;
}
export type Category = Props;

export const categories: Props[] = [
	{
		title: "科技",
		slug: "tech",
		color: "blue",
		description: "关于技术、代码和数字世界的探索。",
	},
	{
		title: "人文",
		slug: "humanities",
		color: "orange",
		description: "阅读、历史、社会观察与思考。",
	},
	{
		title: "白日梦",
		slug: "daydreams",
		color: "pink",
		description: "奇思妙想、脑洞大开的时刻。",
	},
	{
		title: "生活",
		slug: "life",
		color: "green",
		description: "记录日常点滴，分享生活感悟。",
	},
	{
		title: "未知",
		slug: "unknown",
		color: "gray",
		description: "未归类的文章。",
	},
];

export const getCategoryData = (
	category: string | undefined | null,
): Category => {
	const normalized = (category || "").trim().toLowerCase();
	const found = categories.find(
		(c) =>
			c.title === category ||
			c.slug === normalized ||
			c.title.toLowerCase() === normalized,
	);
	if (found) return found;

	// Return "未知" category as fallback, which is the last item
	return categories[categories.length - 1];
};
