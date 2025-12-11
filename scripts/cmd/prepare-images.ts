import fs from "node:fs";
import path from "node:path";
import {
	generateImage,
	getNewFilePath,
	logger,
	readPost,
	resizeImage,
	savePost,
} from "../common.js";

export async function prepareImages(filePath: string, force = false) {
	logger.info(`Generating image prompts for: ${filePath} (Force: ${force})`);

	const post = readPost(filePath);

	// Check for existing images in content or frontmatter
	let existingImage = post.data.image;
	let imageSource = "frontmatter";

	// Scan content for images if not in frontmatter or just to have candidates
	// Regex to find ![alt](url) or <img src="url" />
	const mdImageRegex = /!\[.*?\]\((.*?)\)/;
	const htmlImageRegex = /<img[^>]+src=["'](.*?)["']/;

	const mdMatch = post.content.match(mdImageRegex);
	const htmlMatch = post.content.match(htmlImageRegex);

	// Logic: "if we can find any image resource, we will treat the first one as its illustration image"
	const contentImage = mdMatch ? mdMatch[1] : htmlMatch ? htmlMatch[1] : null;

	if (contentImage) {
		// If found in content, we prefer this over generating a new one?
		// User says: "If that's not the proper one, user can change it manuly or run ... with '--force'"
		// So yes, default to content image if available.
		if (!existingImage || force) {
			// We populate frontmatter with this image
			// But wait, if we are FORCING, maybe we want to GENEREATE?
			// "run subcommand prepare-images with '--force' option to re-generate a new one"
			// So Force means "Generate New AI Image".
			// NO Force means: "Use existing if available".

			if (!force) {
				existingImage = contentImage;
				imageSource = "content";
				logger.info(`Found existing image in content: ${contentImage}`);
			}
		}
	}

	// Check validity
	let validImageExists = false;
	let absoluteImagePath = "";

	if (existingImage) {
		// Resolve path
		// If it starts with http, it's external (valid).
		// If relative/absolute local, check fs.
		if (existingImage.startsWith("http")) {
			validImageExists = true;
			// We can't easy check existence of remote without fetch, assume valid.
		} else {
			// Assume public path or relative content path
			const publicPath = path.join(process.cwd(), "public", existingImage);
			if (fs.existsSync(publicPath)) {
				validImageExists = true;
				absoluteImagePath = publicPath;
			} else {
				// Try relative to file?
				// Not trivial with Astro assets but let's assume public.
				// If not found, treat as missing.
				logger.warn(`Image path ${existingImage} not found on disk.`);
			}
		}
	}

	if (validImageExists && !force) {
		logger.info(
			`Using existing image: ${existingImage} (${imageSource}). Skipping generation.`,
		);

		// THUMBNAIL LOGIC
		// "If we changed the illustration image, we must re-generate the thubnail image."
		// Since we just decided to USE 'existingImage', we must ensure its thumbnail exists.

		const slug = path.basename(filePath, ".md");
		// We need a place to put the thumbnail.
		// If the image is remote, we can't easy resize it with sharp locally without downloading.
		// If local, we can.

		if (absoluteImagePath) {
			// It's local.
			// Thumbnail path: same dir as illustration usually, but here 'existingImage' might be anywhere.
			// Let's generate a thumbnail in our standard location: public/images/blog/{slug}/thumbnail.png'
			const imageDir = path.resolve(process.cwd(), "public/images/blog", slug);
			const thumbnailPath = path.join(imageDir, "thumbnail.png");

			if (!fs.existsSync(thumbnailPath) || force) {
				logger.info(`Generating thumbnail from ${absoluteImagePath}...`);
				await resizeImage(absoluteImagePath, thumbnailPath, 400); // 400px width

				// Perform update to data
				const newData = { ...post.data };
				newData.image = existingImage; // Ensure it's set if matches content
				newData.thumbnail = `/images/blog/${slug}/thumbnail.png`;

				const newPath = getNewFilePath(filePath);
				savePost(newPath, post.content, newData);
				return;
			}
		} else {
			// Remote image. Can't resize comfortably without downloading.
			// Skip thumbnail generation for remote for now, or assume user handles it.
			// Update manifest only.
			const newData = { ...post.data };
			newData.image = existingImage;
			const newPath = getNewFilePath(filePath);
			savePost(newPath, post.content, newData);
			return;
		}

		// If everything exists, we just save to _new
		const newData = { ...post.data };
		newData.image = existingImage;
		const newPath = getNewFilePath(filePath);
		savePost(newPath, post.content, newData);
		return;
	}

	// ... Generation Logic ...

	// Check if prompt exists in frontmatter
	const illustrationPrompt = post.data.ai?.illustration_prompt;

	if (!illustrationPrompt) {
		logger.warn(
			"No illustration_prompt found in frontmatter. Please run 'prepare-metadata' first to generate one.",
		);
		return;
	}

	try {
		const newData = { ...post.data };

		// Generate actual images
		const slug = path.basename(filePath, ".md");
		// Save to public/images/blog/{slug} for direct serving
		const imageDir = path.resolve(process.cwd(), "public/images/blog", slug);

		// Illustration
		const illustrationFilename = "illustration.png";
		const thumbnailFilename = "thumbnail.png";

		const illustrationPath = path.join(imageDir, illustrationFilename);
		const thumbnailPath = path.join(imageDir, thumbnailFilename);

		// 1. Generate Main Image
		// Only generate if not exists or forced
		if (!fs.existsSync(illustrationPath) || force) {
			logger.info(
				`Generating image from prompt: "${illustrationPrompt.slice(0, 50)}..."`,
			);
			await generateImage(illustrationPrompt, illustrationPath);
		} else {
			logger.info("Illustration file exists. Skipping AI generation.");
		}

		// 2. Generate Thumbnail (Resize)
		if (!fs.existsSync(thumbnailPath) || force) {
			await resizeImage(illustrationPath, thumbnailPath, 400);
		}

		// 3. Update Frontmatter
		// Absolute path from public root
		newData.image = `/images/blog/${slug}/${illustrationFilename}`;
		newData.thumbnail = `/images/blog/${slug}/${thumbnailFilename}`;

		const newPath = getNewFilePath(filePath);
		savePost(newPath, post.content, newData);
		logger.info(`Image generation complete. Saved to ${newPath}`);
	} catch (error) {
		logger.error("Error generating images:", error);
	}
}
