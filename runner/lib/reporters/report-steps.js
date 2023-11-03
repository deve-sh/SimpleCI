// @ts-check

let writeTimeout = null;

const reportSteps = async () => {
	// Fire and forget function
    
	if (writeTimeout) writeTimeout = clearTimeout(writeTimeout);

	const admin = require("../../firebase/admin");
	const runInfo = require("../run-info");

	// Empty queue for next write burst
	return admin
		.firestore()
		.collection("simpleci-runs")
		.doc(runInfo.runId)
		.set(
			{ stepsExecuted: runInfo.stepsOutcome, updatedAt: new Date() },
			{ merge: true }
		)
		.catch(console.error);
};

module.exports = reportSteps;
