// @ts-check

let writeTimeout = null;

const reportLogs = async () => {
	if (writeTimeout) writeTimeout = clearTimeout(writeTimeout);

	// Fire and forget function
	// Can write a log to either a database or a log file on storage services like S3 or Google Cloud Storage.

	const admin = require("../../firebase/admin");
	const runInfo = require("../run-info");

	// This writes to the document each time there is a log or at very small intervals of 150 ms, debouncing bursts of logs from a step
	writeTimeout = setTimeout(async () => {
		// Empty queue for next write burst
		return admin
			.firestore()
			.collection("simpleci-run-logs")
			.doc(runInfo.runId)
			.update({ logs: runInfo.logPool })
			.catch((error) => {
				console.log("Error writing logs to run: ", runInfo.runId, error);
			});
	}, 150);
};

module.exports = reportLogs;
