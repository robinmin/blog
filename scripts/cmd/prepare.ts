import fs from "node:fs";
import { getNewFilePath, logger } from "../common.js";
import { prepareImages } from "./prepare-images.js";
import { prepareMetadata } from "./prepare-metadata.js";

export async function prepareAll(filePath: string, force = false) {
	logger.info(`Preparing all enhancements for: ${filePath} (Force: ${force})`);

	// Step 1: Run Metadata on input -> writes filePath_new.md
	await prepareMetadata(filePath, force);

	const step1Output = getNewFilePath(filePath);
	if (!fs.existsSync(step1Output)) {
		logger.error(`Failed to generate metadata output at ${step1Output}`);
		return;
	}

	// Step 2: Run Images on filePath_new.md -> writes filePath_new_new.md
	await prepareImages(step1Output, force);

	const step2Output = getNewFilePath(step1Output);

	// Step 3: Cleanup
	// If step 2 generated a new file (it might skip if no images needed/found and not forced),
	// we want the final result to be at step1Output (filePath_new.md).
	// prepareImages logic: if it skips, it still saves to new path (copys input to output).
	// So step2Output SHOULD exist if prepareImages ran successfully.

	if (fs.existsSync(step2Output)) {
		// Move _new_new to _new
		fs.renameSync(step2Output, step1Output);
		logger.info(`Consolidated output to: ${step1Output}`);
	}

	logger.info("Full preparation complete.");
}
