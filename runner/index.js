// @ts-check

const readInitialData = require("./lib/steps/read-initial-data");
const cloneRepo = require("./lib/steps/clone-repo");

const runInfo = require("./lib/run-info");
const setupEnvAndContexts = require("./lib/steps/setup-env-and-contexts");

const steps = async () => {
	const initalData = readInitialData();

	runInfo.markNewStep({ stepName: "Setup" });
	await setupEnvAndContexts();
	await cloneRepo(initalData);
	runInfo.markStepEnd();
};

steps();
