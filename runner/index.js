// @ts-check

const readInitialData = require("./lib/steps/read-initial-data");
const setupEnvAndContexts = require("./lib/steps/setup-env-and-contexts");
const cloneRepo = require("./lib/steps/clone-repo");
const executeStepCommands = require("./lib/steps/execute-step-commands");
const reportOutcome = require("./lib/steps/report-outcome");

const runInfo = require("./lib/run-info");

const steps = async () => {
	const initalData = readInitialData();

	runInfo.markNewStep({ stepName: "Setup" });
	const removeSetupEnv = await setupEnvAndContexts(initalData);
	await cloneRepo(initalData);
	runInfo.markStepEnd();

	// Setup done, execute steps and commands
	await executeStepCommands(initalData);

	removeSetupEnv();

	await reportOutcome();
};

steps();
