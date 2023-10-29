// @ts-check

const readInitialData = require("./lib/steps/read-initial-data");
const setupEnvAndContexts = require("./lib/steps/setup-env-and-contexts");
const cloneRepo = require("./lib/steps/clone-repo");
const executeStepCommands = require("./lib/steps/execute-step-commands");
const reportOutcome = require("./lib/steps/report-outcome");

const runInfo = require("./lib/run-info");

const executePipeline = async () => {
	const initalData = readInitialData();

	runInfo.markNewStep({ stepName: "Setup" });
	/**
	 * @type {() => void}
	 */
	let removeTemporaryEnvironmentVariables = () => void 0;
	try {
		removeTemporaryEnvironmentVariables = await setupEnvAndContexts(initalData);
		await cloneRepo(initalData);
		runInfo.markStepEnd();
	} catch {
		runInfo.markStepEnd("errored");
	}

	// Setup done, execute steps and commands
	// Function takes care of parsing, evaluation and execution of step commands as well adding them to the central run info class.
	await executeStepCommands(initalData);

	try {
		runInfo.markNewStep({ stepName: "Teardown and Reporting" });
		await reportOutcome();
		
		removeTemporaryEnvironmentVariables();
		runInfo.markStepEnd();
	} catch (error) {
		console.error(error);
		//  Internal Failure
	}
};

executePipeline();
