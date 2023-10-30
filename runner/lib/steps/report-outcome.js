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

	// For now just storing the information in a Database
	// Do remember that logfiles are supposed to be the ideal place for storing this information.
	// Databases have limits on the size of their entries as well as cost more per bit stored and bandwidth consumed.

	const admin = require("../../firebase/admin");
	// Don't forget to disable indexing on the logsAndMetadata field as it can get a little heavy.
	await admin
		.firestore()
		.collection("runs")
		.doc(runId)
		.set(
			{ status: runInfo.status, logsAndMetadata: runInfo.stepsOutcome },
			{ merge: true }
		);
};

module.exports = reportOutcome;
