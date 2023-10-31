const functions = require("firebase-functions");

const runnerSettings = {
	standard: {
		region: "asia-south1",
		timeoutSeconds: 150,
		memory: "512MB",
	},
	medium: {
		timeoutSeconds: 300,
		memory: "2GB",
	},
	large: {
		timeoutSeconds: 540,
		memory: "4GB",
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
		try {
			const admin = require("./firebase/admin");
			const batch = admin.firestore().batch();
			// Generate a unique ID
			const runId = admin.firestore().collection("runs").doc().id;

			batch.set(admin.firestore().collection("runs").doc(runId), {
				runId,
				// TODO: Fill in the following bits of information from the correct sources
				contextData: {
					runId,
					repositoryURI: "https://github.com/deve-sh/greenlock-trial.git",
					steps: [
						{
							name: "Install dependencies",
							condition: "context.event == 'push'",
							run: ['echo "Starting installation"', "npm install"],
						},
					],
					projectId: "",
					env: { ENABLE_DEPLOYS: "true" },
					context: { event: "push", branchName: "main" },
				},
			});
			batch.set(
				admin.firestore().collection("ci-job-runs-queue").doc("standard"),
				{ runId }
			);
			await batch.commit();
			return res.send({ success: true });
		} catch (error) {
			console.error(error);
			return res.send({ success: false });
		}
	});
