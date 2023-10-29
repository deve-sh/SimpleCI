// @ts-check
const SpawnedProcess = require("./process/spawn-process");

/**
 * @type {(repositoryURI: string, token?: string) => string}
 */
const getRepoURLWithToken = (repositoryURI, token) => {
	let uriWithTokenForCloning = repositoryURI;

	if (!uriWithTokenForCloning.includes("@")) {
		// Already contains token
		const availableProviders = ["github.com"];
		for (const provider of availableProviders) {
			if (uriWithTokenForCloning.includes(provider))
				uriWithTokenForCloning = uriWithTokenForCloning.replace(
					provider,
					`${token}@${provider}`
				);
		}
	}

	return uriWithTokenForCloning;
};

/**
 * @type {(repositoryURI: string, token?: string) => Promise<void>}
 */
module.exports = (repositoryURI, token) =>
	new Promise((resolve) => {
		const cloningCommand = `git clone ${getRepoURLWithToken(
			repositoryURI,
			token
		)}`;
		const process = new SpawnedProcess(cloningCommand);
		process.on("complete", resolve);
	});
