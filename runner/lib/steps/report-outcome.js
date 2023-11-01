// @ts-check

const runInfo = require("../run-info");

const reportOutcome = async (
	/**
	 * @type { string }
	 */
	runId
) => {
	// Use runInfo and store the output to a database
	// and logs to a file on storage
	// or everything to a database/storage

	console.log(runInfo.stepsOutcome);

	const admin = require("../../firebase/admin");
	await admin
		.firestore()
		.collection("runs")
		.doc(runId)
		.set(
			{ status: runInfo.status, stepsExecuted: runInfo.stepsOutcome },
			{ merge: true }
		);

	// Upload log pool to a file.
};

module.exports = reportOutcome;
