// @ts-check

module.exports = () => {
	/**
	 * @type { {repositoryURI: string; token: string; runId: string; projectId: string } | null }
	 */
	let initialData;
	try {
		// @ts-expect-error This is not present locally, but will be guaranteed present when an instance is spun up
		initialData = require("./initial-data.json");
	} catch (error) {
        console.error(error);
        initialData = null;
	}

	try {
        // @ts-expect-error In case we go ahead without an instance approach and embed initial data in an environment variable in stringified form
		initialData = JSON.parse(process.env.INITIAL_DATA);
	} catch (error) {
        console.error(error);
		initialData = null;
	}

	if (!initialData) return process.exit(-1);

	const requiredFields = ["repositoryURI", "token", "runId", "projectId"];

	for (const field of requiredFields) {
		if (!initialData[field])
			throw new Error(`${field} is required for starting job.`);
	}

	return initialData;
};
