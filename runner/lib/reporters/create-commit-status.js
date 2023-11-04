// @ts-check

const runInfo = require("../run-info");

// Integrates with Git providers like GitHub to create statuses on commits.

const gitHubStatusMap = {
	"in-progress": "pending",
	errored: "error",
	finished: "success",
};

/**
 *
 * @param {'github'} provider
 * @returns {Promise<boolean>}
 */
const createCommitStatus = async (
	provider = "github",
	status = "in-progress"
) => {
	try {
		if (provider !== "github") return false;

		const { default: axios } = require("axios");
		const { repositoryName, owner, sha, runId, token } =
			runInfo.initialData || {};

		if (!repositoryName || !owner || !sha || !runId || !status) return false;

		const { data: response } = await axios.post(
			`https://api.github.com/repos/${owner}/${repositoryName}/statuses/${sha}`,
			{
				state: gitHubStatusMap[status] || "pending",
				// Fill in with your frontend url
				target_url: null,
				description: "SimpleCI Run",
				context: "continuous-integration/simpleci",
			},
			{ headers: { Authorization: token ? `Bearer ${token}` : "" } }
		);

		return !!response.id;
	} catch (error) {
		console.error("Error while creating commit status: ", error);
		return false;
	}
};

module.exports = createCommitStatus;
