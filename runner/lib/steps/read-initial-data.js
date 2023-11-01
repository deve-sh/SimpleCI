// @ts-check

const readInitialData = () => {
	/**
	 * @type { {
	 * 	repositoryURI: string;
	 * 	token: string;
	 * 	runId: string;
	 * 	project: string,
	 *  steps: any[];
	 *  env: Record<string, string>;
	 * 	context: {
	 * 		branchName: string;
	 * 		event: string;
	 * 	}
	 * } | null }
	 */
	let initialData;
	try {
		const fs = require("node:fs");
		const fileContents = fs.readFileSync("./initial-data.json", "utf-8");
		initialData = JSON.parse(fileContents);
	} catch (error) {
		console.error(error);
		initialData = null;
	}

	try {
		// @ts-expect-error In case we go ahead without an instance approach and embed initial data in an environment variable in stringified form
		if (!initialData) initialData = JSON.parse(process.env.INITIAL_DATA);
	} catch (error) {
		console.error(error);
		initialData = null;
	}

	if (!initialData) return process.exit(-1);

	const requiredFields = [
		"repositoryURI",
		"runId",
		"project",
		"steps",
		"env",
		"context",
	];

	for (const field of requiredFields) {
		if (!initialData[field])
			throw new Error(`${field} is required for starting job.`);
	}

	return initialData;
};

module.exports = readInitialData;
