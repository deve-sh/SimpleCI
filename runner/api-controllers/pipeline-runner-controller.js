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

	const admin = require("../firebase/admin");

	const runDocumentData = (
		await admin.firestore().collection("runs").doc(runId).get()
	).data();
	if (!runDocumentData) return;

	const initialData = runDocumentData.initialData;

	const executePipeline = require("../lib/pipeline-executor");
	return executePipeline(initialData);
};

module.exports = pipelineRunnerController;
