import type githubProvider from "../providers/git-provider/github";

type Repository = Awaited<
	ReturnType<typeof githubProvider.getRepositories>
>[number];

export default Repository;
