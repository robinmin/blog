import dotenv from "dotenv";

dotenv.config();

export const Config = {
	// AI Providers
	logging: {
		debug: process.env.DEBUG === "true",
	},
	anthropic: {
		apiKey: process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN,
		model:
			process.env.ANTHROPIC_DEFAULT_SONNET_MODEL ||
			"claude-sonnet-4-5-20250929",
	},
	openai: {
		apiKey: process.env.OPENAI_API_KEY,
		model: process.env.OPENAI_MODEL_NAME || "dall-e-3",
	},
	google: {
		apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY, // Support both
		baseUrl: process.env.GEMINI_BASE_URL,
		projectId: process.env.GOOGLE_PROJECT_ID, // For Vertex
		location: process.env.GOOGLE_LOCATION || "us-central1",
		model: process.env.GOOGLE_MODEL_NAME || "imagen-3.0-generate-001",
	},

	// Feature Flags / Settings
	imageProvider: (process.env.IMAGE_PROVIDER || "google") as
		| "openai"
		| "google",
	analytics: {
		googleAnalyticsId: process.env.PUBLIC_GOOGLE_ANALYTICS_ID || "G-JSLCS5CL5F",
	},
};
