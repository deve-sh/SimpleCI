// @ts-check

const reportOutcome = async () => {
	// Use runInfo and store the output to a database
	// and logs to a file on storage
	// or everything to a database/storage

	const runInfo = require("../run-info");

	const anyStepErrored = runInfo.stepsOutcome.some(
		(step) => step.status === "errored"
	);
	const runId = runInfo.runId;

	const createCommitStatus = require("../reporters/create-commit-status");
	const finalStatus = anyStepErrored ? "errored" : "finished";
	const admin = require("../../firebase/admin");
	await admin
		.firestore()
		.collection("simpleci-runs")
		.doc(runId)
		.update({
			status: finalStatus,
			stepsExecuted: runInfo.stepsOutcome,
			updatedAt: new Date(),
		})
		.catch(console.error);

	await createCommitStatus("github", finalStatus);
};

module.exports = reportOutcome;
