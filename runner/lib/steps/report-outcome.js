const runInfo = require("../run-info");

const reportOutcome = async () => {
	// Use runInfo and store the output to a database
	// Logs to a log file

	console.log(runInfo.stepsOutcome);
};

module.exports = reportOutcome;
