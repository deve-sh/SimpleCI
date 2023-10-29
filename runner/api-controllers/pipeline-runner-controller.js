// @ts-check

const runIdIdempotencyMap = new Set();

const pipelineRunnerController = async (
	/**
	 * @type {import("firebase-functions/v1/firestore").QueryDocumentSnapshot}
	 */
	snap
) => {
	const runId = snap.data().runId;

	if (runIdIdempotencyMap.has(runId)) return;
	runIdIdempotencyMap.add(runId);

	const executePipeline = require("../lib/pipeline-executor");
	return executePipeline({ runId });
};

module.exports = pipelineRunnerController;
