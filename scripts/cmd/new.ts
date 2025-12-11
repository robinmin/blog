import fs from "node:fs";
import path from "node:path";
import { logger } from "../common.js"; // Note .js extension for native ESM imports if not using a bundler, but tsx handles .ts too. usually import from .ts in tsx works.

// Default template content
const DEFAULT_TEMPLATE = `---
title: "{{TITLE}}"
description: ""
pubDatetime: {{DATE}}
tags: []
draft: true
---

## Introduction

Write your content here...
`;

export async function createNewPost(title: string, slug?: string) {
	const date = new Date();
	const dateStr = date.toISOString();

	// Create slug from title if not provided
	const finalSlug =
		slug ||
		title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
	const filename = `${finalSlug}.md`;

	const targetDir = path.resolve(process.cwd(), "src/blog_posts");
	const targetPath = path.join(targetDir, filename);

	if (fs.existsSync(targetPath)) {
		logger.error(`File already exists: ${targetPath}`);
		process.exit(1);
	}

	// Ensure directory exists
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}

	const content = DEFAULT_TEMPLATE.replace("{{TITLE}}", title).replace(
		"{{DATE}}",
		dateStr,
	);

	fs.writeFileSync(targetPath, content, "utf-8");
	logger.info(`Created new post: ${targetPath}`);
}
