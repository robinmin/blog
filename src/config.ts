export const SITE = {
	website: "https://robinmin.net/",
	author: "Robin Min",
	profile: "",
	desc: "Robin Min's Personal Blog",
	title: "Robin Min's Blog",
	ogImage: "astropaper-og.jpg",
	lightAndDarkMode: true,
	postPerIndex: 15,
	postPerPage: 15,
	scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
	showArchives: true,
	showBackButton: true,
	editPost: {
		enabled: false,
		text: "Edit page",
		url: "https://github.com/satnaing/astro-paper/edit/main/",
	},
	dynamicOgImage: true,
	dir: "ltr",
	lang: "zh-cn",
	timezone: "Asia/Shanghai",
	googleAnalyticsId: "G-JSLCS5CL5F",
} as const;

export interface Friend {
	name: string;
	url: string;
	avatar?: string;
	description?: string;
}

export const FRIENDS: Friend[] = [
	{
		name: "Astro",
		url: "https://astro.build/",
		description: "The web framework for content-driven websites",
	},
	{
		name: "Stablo",
		url: "https://github.com/satnaing/astro-paper",
		description: "A minimal, responsive and SEO-friendly Astro blog theme",
	},
];
