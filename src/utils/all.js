import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

/** Format Date */
export const getFormattedDate = (date) =>
	date
		? new Date(date).toLocaleDateString("en-us", {
				year: "numeric",
				month: "short",
				day: "numeric",
			})
		: "";

/** Estimated Reading time */
export function remarkReadingTime() {
	return (tree, { data }) => {
		const text = mdastToString(tree);
		const readingTime = getReadingTime(text);

		data.astro.frontmatter.estReadingTime = readingTime.minutes;
	};
}

/** Check if an Image Path is Relative or Absolute */
export const checkImageUrl = (image, url) => {
	try {
		new URL(image);
		return image;
	} catch (_error) {
		return new URL(image, url).toString();
	}
};
