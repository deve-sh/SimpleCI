// @ts-check

let appendQueue = [];
let writeTimeout = null;

const appendLog = async (
	/**
	 * @type { { type: 'error' | 'info' | 'warn', log: string, ts: string, stepId: string } }
	 */
	log
) => {
	appendQueue.push(log);

	if (writeTimeout) writeTimeout = clearTimeout(writeTimeout);

	// Fire and forget function
	// Can write a log to either a database or a log file on storage services like S3 or Google Cloud Storage.

	const { FieldValue } = require("firebase-admin/firestore");
	const admin = require("../../firebase/admin");
	const runInfo = require("../run-info");

	// This writes to the document each time there is a log or at very small intervals of 200 ms, debouncing bursts of logs from a step
	writeTimeout = setTimeout(async () => {
		const logsToWriteToDB = JSON.parse(JSON.stringify(appendQueue));
		// Empty queue for next write burst
		appendQueue = [];
		return admin
			.firestore()
			.collection("simpleci-run-logs")
			.doc(runInfo.runId)
			.update({ logs: FieldValue.arrayUnion(log) })
			.catch((error) => {
				console.log("Error writing logs to run: ", runInfo.runId, error);
				// Add back logs to the start for retry with next write burst
				appendQueue = [...logsToWriteToDB, ...appendQueue];
			});
	}, 205);
};

module.exports = appendLog;
