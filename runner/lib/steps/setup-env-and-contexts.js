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
				new SpawnedProcess(
					`export ${variableName}=${runInfo.env[variableName]}`
				);
			}
		}
	}

	const unsetAddedEnvironmentVariables = () => {
		for (const variableName in initialData.env) {
			if (initialData.env.hasOwnProperty(variableName)) {
				new SpawnedProcess(
					`unset ${variableName}=${initialData.env[variableName]}`
				);
			}
		}
	};

	return unsetAddedEnvironmentVariables;
};

module.exports = setupEnvAndContexts;
