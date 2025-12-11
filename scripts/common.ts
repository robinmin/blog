import fs from "node:fs";
import path from "node:path";
import { Anthropic } from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import matter from "gray-matter";
import OpenAI from "openai";
import sharp from "sharp";

// Load environment variables
dotenv.config();

// Logger setup (simple console wrapper for now, can be expanded)
export const logger = {
	info: (msg: string, ...args: unknown[]) =>
		console.log(`[INFO] ${msg}`, ...args),
	warn: (msg: string, ...args: unknown[]) =>
		console.warn(`[WARN] ${msg}`, ...args),
	error: (msg: string, ...args: unknown[]) =>
		console.error(`[ERROR] ${msg}`, ...args),
	debug: (msg: string, ...args: unknown[]) => {
		if (process.env.DEBUG) console.debug(`[DEBUG] ${msg}`, ...args);
	},
};

// Types
export interface BlogPost {
	content: string;
	// biome-ignore lint/suspicious/noExplicitAny: Generic data blob
	data: { [key: string]: any };
	path: string;
}

// File Operations
export function readPost(filePath: string): BlogPost {
	const absolutePath = path.resolve(filePath);
	if (!fs.existsSync(absolutePath)) {
		throw new Error(`File not found: ${absolutePath}`);
	}

	const fileContent = fs.readFileSync(absolutePath, "utf-8");
	const { content, data } = matter(fileContent);

	return {
		content,
		data,
		path: absolutePath,
	};
}

export function getNewFilePath(filePath: string): string {
	const parsed = path.parse(filePath);
	return path.join(parsed.dir, `${parsed.name}_new${parsed.ext}`);
}

export function savePost(filePath: string, content: string, data: object) {
	const absolutePath = path.resolve(filePath);
	const fileContent = matter.stringify(content, data);
	fs.writeFileSync(absolutePath, fileContent, "utf-8");
	logger.info(`Saved post to: ${absolutePath}`);
}

// Claude Client Setup
// We use the official SDK. Note: The user prompt mentioned @anthropic-ai/claude-agent-sdk
// We need to check if we need the standard @anthropic-ai/sdk as well or if the agent sdk wraps it or how it works.
// Based on typical usage, we usually need correct API keys.

// Use Config
import { Config } from "./config.js";

export const CLAUDE_MODEL_NAME = Config.anthropic.model; // Deprecated alias, keep for now

export function getClaudeClient() {
	const apiKey = Config.anthropic.apiKey;

	if (!apiKey) {
		throw new Error("ANTHROPIC_API_KEY or ANTHROPIC_AUTH_TOKEN is not set.");
	}
	return new Anthropic({
		apiKey: apiKey,
	});
}

// ... askClaude / askClaudeJSON remain same ...

export async function askClaude(
	systemPrompt: string,
	userPrompt: string,
): Promise<string> {
	const client = getClaudeClient();
	try {
		const msg = await client.messages.create({
			model: Config.anthropic.model,
			max_tokens: 1024,
			system: systemPrompt,
			messages: [{ role: "user", content: userPrompt }],
		});

		const responseText =
			msg.content[0].type === "text" ? msg.content[0].text : "";
		return responseText;
	} catch (error) {
		logger.error("Claude API Error:", error);
		throw error;
	}
}

// ...

export async function askClaudeJSON<T>(
	systemPrompt: string,
	userPrompt: string,
): Promise<T> {
	const responseText = await askClaude(systemPrompt, userPrompt);
	const jsonMatch = responseText.match(/\{[\s\S]*\}/);

	if (!jsonMatch) {
		throw new Error("Could not find JSON in Claude response");
	}

	try {
		return JSON.parse(jsonMatch[0]) as T;
	} catch (e) {
		throw new Error(`Failed to parse JSON: ${e}`);
	}
}

// ...

export async function generateImageByOpenAI(
	prompt: string,
	outputPath: string,
): Promise<void> {
	const apiKey = Config.openai.apiKey;
	if (!apiKey) {
		logger.warn("OPENAI_API_KEY not found. Skipping OpenAI image generation.");
		return;
	}

	const openai = new OpenAI({ apiKey });

	try {
		logger.info(
			`Generating image (OpenAI) for prompt: "${prompt.slice(0, 50)}..."`,
		);
		const response = await openai.images.generate({
			// biome-ignore lint/suspicious/noExplicitAny: Model type casting needed
			model: Config.openai.model as any,
			prompt: prompt,
			n: 1,
			size: "1024x1024",
			response_format: "b64_json",
			quality: "standard",
			style: "vivid",
		});

		const b64Json = response.data?.[0]?.b64_json;
		if (b64Json) {
			saveBase64Image(b64Json, outputPath);
		}
	} catch (error) {
		logger.error("Error generating image (OpenAI):", error);
		if (error instanceof Error) {
			logger.error(`Root Cause: ${error.message}`);
		}
		// Don't rethrow blindly, just let the next steps handle missing file or exit?
		// User wants to identify root cause. Logging it is key.
	}
}

export async function generateImageByGoogle(
	prompt: string,
	outputPath: string,
): Promise<void> {
	logger.info(
		`Generating image (Google) for prompt: "${prompt.slice(0, 50)}..."`,
	);

	// Check Config
	const apiKey = Config.google.apiKey;
	const baseUrl =
		Config.google.baseUrl ||
		"https://generativelanguage.googleapis.com/v1beta/";
	const model = Config.google.model; // e.g., imagen-3.0-generate-001

	if (!apiKey) {
		logger.error(
			"GEMINI_API_KEY or GOOGLE_API_KEY not found. Cannot generate image.",
		);
		return;
	}

	// Construct URL for Imagen on AI Studio
	// Endpoint: https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=API_KEY
	// Note: The user provided a base URL.
	const url = `${baseUrl.replace(/\/$/, "")}/models/${model}:predict?key=${apiKey}`;

	try {
		const payload = {
			instances: [{ prompt: prompt }],
			parameters: {
				sampleCount: 1,
				// aspectRatio: "1:1" // Optional
			},
		};

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errText = await response.text();
			throw new Error(
				`Google API request failed: ${response.status} ${response.statusText} - ${errText}`,
			);
		}

		const data = await response.json();

		// Parse response. Imagen response format:
		// { predictions: [ { bytesBase64Encoded: "..." } ] }
		// OR similar. Check docs/assumption.
		// Assuming AI Studio / Vertex format for Imagen.

		// biome-ignore lint/suspicious/noExplicitAny: Dynamic API response
		const predictions = (data as any).predictions;
		if (predictions && predictions.length > 0) {
			const b64 = predictions[0].bytesBase64Encoded || predictions[0]; // Sometimes it's direct string
			if (typeof b64 === "string") {
				saveBase64Image(b64, outputPath);
			} else {
				logger.error(
					"Unexpected prediction format from Google API",
					predictions[0],
				);
			}
		} else {
			logger.error("No predictions in Google API response", data);
		}
	} catch (error) {
		logger.error(`Error generating image (Google):`, error);
		// Do not throw if optional, but here we want to surface potential logical errors.
		// User asked for: "process each kind of errors properly... identify root cause rapidly"
		if (error instanceof Error) {
			logger.error(`Root Cause: ${error.message}`);
			if (error.stack) logger.debug(error.stack);
		}
	}
}

export async function generateImage(
	prompt: string,
	outputPath: string,
): Promise<void> {
	const provider = Config.imageProvider;
	if (provider === "google") {
		return generateImageByGoogle(prompt, outputPath);
	} else {
		return generateImageByOpenAI(prompt, outputPath);
	}
}

function saveBase64Image(b64: string, outputPath: string) {
	const buffer = Buffer.from(b64, "base64");
	const dir = path.dirname(outputPath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
	fs.writeFileSync(outputPath, buffer);
	logger.info(`Saved image to: ${outputPath}`);
}

export async function resizeImage(
	inputPath: string,
	outputPath: string,
	width: number,
): Promise<void> {
	try {
		if (!fs.existsSync(inputPath)) {
			logger.warn(`Input image not found for resizing: ${inputPath}`);
			return;
		}

		// Ensure output dir exists
		const dir = path.dirname(outputPath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}

		await sharp(inputPath).resize({ width }).toFile(outputPath);

		logger.info(`Resized image saved to: ${outputPath}`);
	} catch (error) {
		logger.error(`Error resizing image: ${error}`);
	}
}
