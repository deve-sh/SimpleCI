import GitHub from "./github";

class GitProvider {
	gitProvider: typeof GitHub | null = null;

	constructor() {}

	initialize(mode: "github" | "github.com", token: string) {
		this.gitProvider =
			mode === "github" || mode === "github.com" ? GitHub : null;
		return this.gitProvider?.initialize(token);
	}

	getRepositories() {
		return this.gitProvider?.getRepositories();
	}
}

export default new GitProvider();
