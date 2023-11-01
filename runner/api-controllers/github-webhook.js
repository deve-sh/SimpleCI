// @ts-check

const gitHubWebhook = async (
	/**
	 * @type { import('firebase-functions').https.Request }
	 */
	req,
	/**
	 * @type { import('firebase-functions').Response<any> }
	 */
	res
) => {
	const { webhookId } = req.query;

	if (!webhookId)
		return res.status(400).send({ error: "Invalid webhook invocation" });

	const { config } = require("firebase-functions/v1");

	const { Webhooks } = require("@octokit/webhooks");
	const webhooks = new Webhooks({ secret: config().github.webhook_secret });
	const signature = await webhooks.sign(req.rawBody.toString());
	const isValidWebhook = await webhooks.verify(
		req.rawBody.toString(),
		signature
	);

	if (!isValidWebhook)
		return res.status(401).send({ error: "Invalid webhook invocation" });

	const admin = require("../firebase/admin");
	const db = admin.firestore();

	// Generate a unique ID for this run
	const runId = db.collection("runs").doc().id;

	const batch = db.batch();
    
	batch.set(db.collection("runs").doc(runId), {
		runId,
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
	batch.set(db.collection("ci-job-runs-queue").doc("standard"), {
		runId,
	});
	await batch.commit();
};

module.exports = gitHubWebhook;
