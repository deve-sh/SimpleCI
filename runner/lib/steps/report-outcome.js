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

	const admin = require("../../firebase/admin");
	await admin
		.firestore()
		.collection("runs")
		.doc(runId)
		.set(
			{
				status: anyStepErrored ? "errored" : "finished",
				stepsExecuted: runInfo.stepsOutcome,
			},
			{ merge: true }
		);
};

module.exports = reportOutcome;
