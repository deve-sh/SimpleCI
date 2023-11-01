// @ts-check

const onProjectWrite = async (
	/**
	 * @type {import("firebase-functions").Change<import("firebase-functions/v1/firestore").DocumentSnapshot>}
	 */
	change,
	/**
	 * @type {import("firebase-functions").EventContext}
	 */
	context
) => {
	try {
		const projectData = change.after.data() || change.before.data();

		if (!projectData) return;

		const projectId = context.params.projectId || projectData.id;

		const hookEvents = projectData.config.hookEvents || [];
		const provider = projectData.repoProvider;
		const repoName = projectData.repositoryName;
		const token = projectData.token;
		const owner = projectData.providerSpecificContext.owner;

		if (provider !== "github" || !token) return;

		const admin = require("../firebase/admin");
		const db = admin.firestore();

		if (!change.after.exists) {
			// Delete registered webhooks
			const webhookIdsRegisteredForProject = (
				await db
					.collection("simpleci-registered-webhooks")
					.where("project", "==", projectId)
					.get()
			).docs.map((doc) => doc.data().id);
			await Promise.allSettled(
				webhookIdsRegisteredForProject.map((webhookId) =>
					axios.delete(
						`https://api.github.com/repos/${owner}/${repoName}/hooks/${webhookId}`,
						{ headers: { Authorization: `Bearer ${token}` } }
					)
				)
			);
			return;
		}
		if (!change.before.exists) {
			// Register webhook
			const { default: axios } = require("axios");
			const generateCloudFunctionURL = require("../firebase/generate-cloud-function-url");
			const { config } = require("firebase-functions");

			const { data } = await axios.post(
				`https://api.github.com/repos/${owner}/${repoName}/hooks`,
				{
					name: "web",
					active: true,
					events: hookEvents,
					config: {
						url: generateCloudFunctionURL("gitHubWebhook"),
						content_type: "json",
						insecure_ssl: 0,
						secret: config().github.webhook_secret,
					},
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			console.log("Webhook created: ", data);
			const webhookId = data.id;
			return await db
				.collection("simpleci-registered-webhooks")
				.doc(webhookId)
				.set({
					webhookData: {
						url: data.url,
						testUrl: data.test_url,
						pingUrl: data.ping_url,
						deliveriesUrl: data.deliveries_url,
					},
					id: data.id,
					project: projectId,
					createdAt: new Date(),
				});
		}

		// Update webhooks
		const dataBefore = change.before.data() || {};
		const hookEventsHaveChanged =
			dataBefore.hookEvents?.length !== projectData.hookEvents.length;
		if (!hookEventsHaveChanged) return;

		const webhookIdsRegisteredForProject = (
			await db
				.collection("simpleci-registered-webhooks")
				.where("project", "==", projectId)
				.get()
		).docs.map((doc) => doc.data().id);

		await Promise.allSettled(
			webhookIdsRegisteredForProject.map((hookId) =>
				axios.patch(
					`https://api.github.com/repos/${owner}/${repoName}/hooks/${hookId}`,
					{ active: true, events: hookEvents },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			)
		);

		return;
	} catch (error) {
		console.error(error);
	}
};

module.exports = onProjectWrite;
