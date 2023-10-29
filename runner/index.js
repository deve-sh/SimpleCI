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
exports.gitHubWebhook = functions.https.onRequest(async (req, res) => {
	try {
		const admin = require("./firebase/admin");
		const batch = admin.firestore().batch();
		const runId = admin.firestore().doc().id;
		batch.set(admin.firestore().collection("runs").doc(runId), {
			runId,
			// TODO: Fill in the following bits of information from the correct sources
			initialData: {
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
	} catch {
		return res.send({ success: false });
	}
});
