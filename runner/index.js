const functions = require("firebase-functions");

const runnerSettings = {
	standard: {
		timeoutSeconds: 150,
		memory: "512MB",
	},
	medium: {
		timeoutSeconds: 300,
		memory: "2GB",
	},
	large: {
		timeoutSeconds: 500,
		memory: "4GB",
	},
};
exports.pipelineRunnerStandard = functions
	.runWith(runnerSettings.standard)
	.firestore.document("ci-job-runs-queue/standard")
	.onCreate((snap) => {
		const pipelineRunnerController = require("./api-controllers/pipeline-runner-controller");
		return pipelineRunnerController(snap);
	});

exports.pipelineRunnerMedium = functions
	.runWith(runnerSettings.medium)
	.firestore.document("ci-job-runs-queue/medium")
	.onCreate((snap) => {
		const pipelineRunnerController = require("./api-controllers/pipeline-runner-controller");
		return pipelineRunnerController(snap);
	});

exports.pipelineRunnerLarge = functions
	.runWith(runnerSettings.large)
	.firestore.document("ci-job-runs-queue/large")
	.onCreate((snap) => {
		const pipelineRunnerController = require("./api-controllers/pipeline-runner-controller");
		return pipelineRunnerController(snap);
	});

// Write the required documents to trigger a pipeline runner from this webhook cloud function.
exports.gitHubWebhook = functions.https.onRequest((req, res) => {
	return res.send({});
});
