import { Octokit } from "octokit";

import type GitProviderMethods from "./interface";

class GitHub implements GitProviderMethods {
	private apiToken: string | null = null;
	private octokit: Octokit | null = null;

	constructor() {}

	throwIfNotInitialized = () => {
		if (!this.octokit || !this.apiToken)
			throw new Error("GitHub Provider not initialized.");
		return;
	};

	initialize = (apiToken: string) => {
		this.apiToken = apiToken;
		this.octokit = new Octokit({ auth: this.apiToken });
	};

	getRepositories = async () => {
		this.throwIfNotInitialized();
		const result = await this.octokit?.request("GET /user/repos", {
			headers: { "X-GitHub-Api-Version": "2022-11-28" },
			visibility: "all",
			sort: "created",
			per_page: 100,
		});
		return result?.data || [];
	};
}

export default new GitHub();
