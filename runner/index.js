// @ts-check

const readInitialData = require("./lib/read-initial-data");
const cloneRepo = require("./lib/steps/clone-repo");

const runInfo = require("./lib/run-info");

const steps = async () => {
	const initalData = readInitialData();

	runInfo.markNewStep({ stepName: "Setup" });
	await cloneRepo(initalData);
	runInfo.markStepEnd();
};

steps();
