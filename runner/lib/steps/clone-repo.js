// @ts-check
const SpawnedProcess = require("../process/spawn-process");

const availableGitProviders = ["github.com"];

/**
 * @type {(repositoryURI: string, token?: string) => string}
 */
const getRepoURLWithToken = (repositoryURI, token) => {
	let uriWithTokenForCloning = repositoryURI;

	// Already contains token
	if (token && !uriWithTokenForCloning.includes("@")) {
		for (const provider of availableGitProviders) {
			if (uriWithTokenForCloning.includes(provider)) {
				uriWithTokenForCloning = uriWithTokenForCloning.replace(
					provider,
					`${token}@${provider}`
				);
				break;
			}
		}
	}

	return uriWithTokenForCloning;
};

/**
 * @type {(initialData: { repositoryURI: string, token?: string, context: { branchName?: string; } }) => Promise<void>}
 */
const cloneRepo = (initialData) =>
	new Promise((resolve) => {
		const cloningCommand = `git clone ${getRepoURLWithToken(
			initialData.repositoryURI,
			initialData.token
		)} --depth=1 ${
			initialData.context?.branchName
				? "--branch " + initialData.context?.branchName
				: ""
		} ../ci-cd-app`;
		const process = new SpawnedProcess(cloningCommand);
		process.on("complete", resolve);
	});

module.exports = cloneRepo;
