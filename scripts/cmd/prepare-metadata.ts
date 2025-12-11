import {
	askClaudeJSON,
	getNewFilePath,
	logger,
	readPost,
	savePost,
} from "../common.js";
import { getMetadataSystemPrompt, getMetadataUserPrompt } from "../prompts.js";

export async function prepareMetadata(filePath: string, force = false) {
	logger.info(`Analyzing metadata for: ${filePath} (Force: ${force})`);

	const post = readPost(filePath);

	// Check if we need to skip
	// Logic: if description and seo tags are already populated, skip unless force is true
	const hasDescription = !!post.data.description;
	const hasSeo = post.data.seo && Object.keys(post.data.seo).length > 0;

	if (hasDescription && hasSeo && !force) {
		logger.info(
			"Metadata already exists. Skipping (use --force to overwrite).",
		);
		// Even if skipping, we should probably write the _new file to be consistent with the flow?
		// User said "output to a new file instead of overite".
		// If we skip processing, we should probably just save the original content to the new file
		// so the user has a consistent _new file to look at.
		const newPath = getNewFilePath(filePath);
		savePost(newPath, post.content, post.data);
		return;
	}

	// Use extracted prompts
	const systemPrompt = getMetadataSystemPrompt();
	const userMessage = getMetadataUserPrompt(
		post.data,
		post.content.slice(0, 15000),
	);

	try {
		interface MetadataResult {
			description?: string;
			category?: string;
			tags?: string[];
			seo?: {
				title?: string;
				description?: string;
				keywords?: string[];
				og?: {
					title?: string;
					description?: string;
				};
			};
			ai?: {
				illustration_prompt?: string;
				thumbnail_prompt?: string;
			};
		}

		const result = await askClaudeJSON<MetadataResult>(
			systemPrompt,
			userMessage,
		);

		// Merge Data
		const newData = { ...post.data };

		// Update description if missing or forced
		if (!newData.description || force) {
			if (result.description) newData.description = result.description;
		}

		// Update category
		if (!newData.category || newData.category === "General" || force) {
			if (result.category) newData.category = result.category;
		}

		// Merge tags
		const existingTags = new Set(newData.tags || []);
		(result.tags || []).forEach((t: string) => {
			existingTags.add(t);
		});
		newData.tags = Array.from(existingTags);

		// Merge SEO
		// If forcing, we overwrite. If not, we merge?
		// User said "overwrite/ignore current relevant information".
		// Let's assume merge is safer but prioritize new if forced.
		newData.seo = {
			...(newData.seo || {}),
			...(result.seo || {}),
		};

		// Merge AI Prompts
		// Ensure ai object exists
		if (!newData.ai) newData.ai = {};
		if (result.ai) {
			// We only overwrite prompts if they are returned or forced
			if (result.ai.illustration_prompt)
				newData.ai.illustration_prompt = result.ai.illustration_prompt;
			if (result.ai.thumbnail_prompt)
				newData.ai.thumbnail_prompt = result.ai.thumbnail_prompt;
		}

		const newPath = getNewFilePath(filePath);
		savePost(newPath, post.content, newData);
		logger.info(`Metadata updated successfully. Saved to ${newPath}`);
	} catch (error) {
		logger.error("Error generating metadata:", error);
	}
}
