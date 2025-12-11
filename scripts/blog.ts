#!/usr/bin/env bun
import yargs from "yargs";

import { hideBin } from "yargs/helpers";
import { createNewPost } from "./cmd/new.js";
import { prepareAll } from "./cmd/prepare.js";
import { prepareImages } from "./cmd/prepare-images.js";
import { prepareMetadata } from "./cmd/prepare-metadata.js";

yargs(hideBin(process.argv))
	.scriptName("blog")
	.usage("$0 <cmd> [args]")

	// Command: new
	.command(
		"new <title>",
		"Create a new blog post",
		(yargs) => {
			return yargs
				.positional("title", {
					describe: "Title of the blog post",
					type: "string",
				})
				.option("slug", {
					alias: "s",
					type: "string",
					description: "Custom slug for the filename",
				});
		},
		async (argv) => {
			await createNewPost(
				argv.title as string,
				argv.slug as string | undefined,
			);
		},
	)

	// Command: prepare-metadata
	.command(
		"prepare-metadata <file>",
		"Generate metadata (SEO, Tags, etc) for a blog post",
		(yargs) => {
			return yargs
				.positional("file", {
					describe: "Path to the blog post file",
					type: "string",
				})
				.option("force", {
					alias: "f",
					type: "boolean",
					default: false,
					describe: "Force overwrite existing metadata",
				});
		},
		async (argv) => {
			await prepareMetadata(argv.file as string, argv.force as boolean);
		},
	)

	// Command: prepare-images
	.command(
		"prepare-images <file>",
		"Generate image prompts for a blog post",
		(yargs) => {
			return yargs
				.positional("file", {
					describe: "Path to the blog post file",
					type: "string",
				})
				.option("force", {
					alias: "f",
					type: "boolean",
					default: false,
					describe: "Force overwrite existing images",
				});
		},
		async (argv) => {
			await prepareImages(argv.file as string, argv.force as boolean);
		},
	)

	// Command: prepare (all)
	.command(
		"prepare <file>",
		"Prepare all AI enhancements (metadata + images)",
		(yargs) => {
			return yargs
				.positional("file", {
					describe: "Path to the blog post file",
					type: "string",
				})
				.option("force", {
					alias: "f",
					type: "boolean",
					default: false,
					describe: "Force overwrite all",
				});
		},
		async (argv) => {
			await prepareAll(argv.file as string, argv.force as boolean);
		},
	)

	.help().argv;
