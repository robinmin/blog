export const LANGUAGES = {
	en: "English",
	zh: "简体中文",
	ja: "日本語",
} as const;

export const DEFAULT_LOCALE = "en";

export const UI_TRANSLATIONS = {
	en: {
		"nav.home": "Home",
		"nav.posts": "Posts",
		"nav.tags": "Tags",
		"nav.about": "About",
		"nav.archives": "Archives",
		"nav.search": "Search",
	},
	zh: {
		"nav.home": "首页",
		"nav.posts": "文章",
		"nav.tags": "标签",
		"nav.about": "关于",
		"nav.archives": "归档",
		"nav.search": "搜索",
	},
	ja: {
		"nav.home": "ホーム",
		"nav.posts": "投稿",
		"nav.tags": "タグ",
		"nav.about": "約",
		"nav.archives": "アーカイブ",
		"nav.search": "検索",
	},
} as const;

export const CATEGORY_TRANSLATIONS = {
	en: {
		tech: "Technology",
		humanities: "Humanities",
		daydreams: "Daydreams",
		life: "Life",
		unknown: "Unknown",
	},
	zh: {
		tech: "科技",
		humanities: "人文",
		daydreams: "随想",
		life: "生活",
		unknown: "未知",
	},
	ja: {
		tech: "技術",
		humanities: "人文",
		daydreams: "空想",
		life: "生活",
		unknown: "未知",
	},
} as const;

export function getLangFromUrl(url: URL) {
	const [, lang] = url.pathname.split("/");
	if (lang in LANGUAGES) return lang as keyof typeof LANGUAGES;
	return DEFAULT_LOCALE;
}

export function useTranslations(lang: keyof typeof LANGUAGES) {
	return function t(
		key: keyof (typeof UI_TRANSLATIONS)[typeof DEFAULT_LOCALE],
	) {
		return UI_TRANSLATIONS[lang][key] || UI_TRANSLATIONS[DEFAULT_LOCALE][key];
	};
}

export function getCategoryLabel(
	category: string,
	lang: keyof typeof LANGUAGES,
) {
	const normalizedCategory = category.toLowerCase().trim();
	const targetLangStart = CATEGORY_TRANSLATIONS[lang];
	const label = targetLangStart
		? targetLangStart[normalizedCategory as keyof typeof targetLangStart]
		: undefined;

	if (label) return label;

	return CATEGORY_TRANSLATIONS.en?.[normalizedCategory] || category;
}
