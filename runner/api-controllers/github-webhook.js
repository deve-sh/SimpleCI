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
	try {
		const invalidInvocationError = () =>
			res.status(400).send({ error: "Invalid webhook invocation" });

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

		const getFromRequestHeader = (
			/**
			 * @type { string }
			 */
			headerString
		) => req.headers[headerString] || req.headers[headerString.toLowerCase()];

		const admin = require("../firebase/admin");
		const db = admin.firestore();

		const { uuidv4 } = require("@firebase/util");
		const runId = uuidv4();

		const batch = db.batch();

		const webhookId = getFromRequestHeader("X-GitHub-Hook-ID");

		if (!webhookId) return invalidInvocationError();

		// Get the webhook
		const webhook = await db
			.collection("simpleci-registered-webhooks")
			.doc(webhookId.toString())
			.get();
		if (!webhook.exists || !webhook.data()) return invalidInvocationError();

		// Get the project
		const projectId = webhook.data()?.project;
		const project = await db
			.collection("simpleci-projects")
			.doc(projectId)
			.get();
		const projectData = project.data();
		if (!project.exists || !projectData) return invalidInvocationError();

		// Read CI Pipeline file from repo.
		const { default: axios } = require("axios");
		/**
		 * @type { Record<string, string> }
		 */
		let ciFileContents = {};
		try {
			const params = {};
			if (req.body.base_ref) params["ref"] = req.body.base_ref;
			const ciFileResponse = await axios.get(
				`https://api.github.com/repos/${projectData.providerSpecificContext.owner}/${projectData.repositoryName}/contents/.simpleci/pipeline.json`,
				{ headers: { Accept: "application/vnd.github.v3.raw" }, params }
			);
			ciFileContents = JSON.parse(ciFileResponse.data);
		} catch {
			// Failed to fetch or parse
			return invalidInvocationError();
		}

		batch.set(db.collection("runs").doc(runId), {
			runId,
			project: projectId,
			associatedWebhook: webhookId,
			status: "in-progress",
			// The initial data to use for the runner
			initialData: {
				runId,
				repositoryURI: projectData.cloneURL,
				token: projectData.token,
				// Could also be read on the runner post cloning the repo.
				// But the absence of this here acts as a check to not start the runner in the first place.
				steps: ciFileContents.steps || [],
				project: projectId,
				// TODO: Add-on support for environment variables defined by the user
				env: {},
				// TODO: Need to refine what we pick from req.body based on the events and payload GitHub sends us.
				// For now the user can use whatever they get from payload as defined in https://docs.github.com/en/webhooks/webhook-events-and-payload
				context: {
					event: getFromRequestHeader("X-GitHub-Event"),
					branchName: req.body.base_ref || "",
					...req.body,
				},
			},
		});

		const runnerPreference = projectData.config.runnerPreference || "standard";
		// This triggers a pub-sub based background start of the pipeline runner.
		batch.set(db.collection("ci-job-runs-queue").doc(runnerPreference), {
			runId,
		});

		await batch.commit();

		return;
	} catch (error) {
		console.error(error);
	}
};

module.exports = gitHubWebhook;
