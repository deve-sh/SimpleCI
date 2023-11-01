const functions = require("firebase-functions");

const runnerSettings = {
	standard: {
		region: "asia-south1",
		timeoutSeconds: 150,
		memory: "1GB",
	},
	medium: {
		timeoutSeconds: 300,
		memory: "4GB",
	},
	large: {
		timeoutSeconds: 540,
		memory: "8GB",
	},
};
exports.pipelineRunnerStandard = functions
	.runWith(runnerSettings.standard)
	.region("asia-south1")
	.firestore.document("ci-job-runs-queue/standard")
	.onWrite((change) => {
		if (!change.after.exists) return;
		const pipelineRunnerController = require("./api-controllers/pipeline-runner-controller");
		return pipelineRunnerController(runnerSettings.standard)(change.after);
	});

exports.pipelineRunnerMedium = functions
	.runWith(runnerSettings.medium)
	.region("asia-south1")
	.firestore.document("ci-job-runs-queue/medium")
	.onWrite((change) => {
		if (!change.after.exists) return;
		const pipelineRunnerController = require("./api-controllers/pipeline-runner-controller");
		return pipelineRunnerController(runnerSettings.medium)(change.after);
	});

exports.pipelineRunnerLarge = functions
	.runWith(runnerSettings.large)
	.region("asia-south1")
	.firestore.document("ci-job-runs-queue/large")
	.onWrite((change) => {
		if (!change.after.exists) return;
		const pipelineRunnerController = require("./api-controllers/pipeline-runner-controller");
		return pipelineRunnerController(runnerSettings.large)(change.after);
	});

exports.onSimpleCIProjectWrite = functions
	.region("asia-south1")
	.firestore.document("simpleci-projects/{projectId}")
	.onWrite((change, context) => {
		const onProjectWrite = require("./api-controllers/on-project-write");
		return onProjectWrite(change, context);
	});

// Write the required documents to trigger a pipeline runner from this webhook cloud function.
exports.gitHubWebhook = functions
	.region("asia-south1")
	.https.onRequest(async (req, res) => {
		const gitHubWebhook = require('./api-controllers/github-webhook');
		return gitHubWebhook(req, res);
	});
