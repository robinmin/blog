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
