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

		const admin = require("../firebase/admin");

		if (!change.after.exists) {
			if (provider !== "github" || !token) return;

			// Delete registered webhooks
			const webhookIdsRegisteredForProject = (
				await admin
					.firestore()
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
			if (provider !== "github" || !token) return;

			// Register webhook
			const { default: axios } = require("axios");
			const generateCloudFunctionURL = require("../firebase/generate-cloud-function-url");
			const { config } = require("firebase-functions");

			const { data } = await axios.post(
				`https://api.github.com/repos/${owner}/${repoName}/hooks`,
				{
					name: "SimpleCI CI/CD Project Webhook",
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

			if (data.id)
				await admin
					.firestore()
					.collection("simpleci-registered-webhooks")
					.doc(data.id)
					.set({
						webhookData: {
							url: data.url,
							test_url: data.test_url,
							ping_url: data.ping_url,
							deliveries_url: data.deliveries_url,
						},
						id: data.id,
						project: projectId,
						createdAt: new Date(),
						updatedAt: new Date(),
					});
			return;
		}

		// Update webhooks
		const dataBefore = change.before.data() || {};
		const hookEventsHaveChanged =
			dataBefore.hookEvents?.length !== projectData.hookEvents.length;
		if (!hookEventsHaveChanged) return;

		const webhookIdsRegisteredForProject = (
			await admin
				.firestore()
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
