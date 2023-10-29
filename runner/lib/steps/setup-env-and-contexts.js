// @ts-check

const runInfo = require("../run-info");
const SpawnedProcess = require("../process/spawn-process");

/**
 * @type {(initialData: { context: any, env: any }) => Promise<() => void>}
 */
const setupEnvAndContexts = async (initialData) => {
	if (Object.keys(initialData.context).length)
		runInfo.context = initialData.context;

	if (Object.keys(initialData.env).length) {
		runInfo.env = initialData.env;

		for (const variableName in runInfo.env) {
			if (runInfo.env.hasOwnProperty(variableName)) {
				const process = new SpawnedProcess(
					`export ${variableName}=${runInfo.env[variableName]}`
				);
				process.on("complete", (status) => {
					if (status === "errored")
						throw new Error("Error setting environment variables");
				});
			}
		}
	}

	const unsetAddedEnvironmentVariables = () => {
		for (const variableName in initialData.env) {
			if (initialData.env.hasOwnProperty(variableName)) {
				const process = new SpawnedProcess(
					`unset ${variableName}=${initialData.env[variableName]}`
				);
				process.on("complete", (status) => {
					if (status === "errored")
						throw new Error("Error un-setting environment variables");
				});
			}
		}
	};

	return unsetAddedEnvironmentVariables;
};

module.exports = setupEnvAndContexts;
