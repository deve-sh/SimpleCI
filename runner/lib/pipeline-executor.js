// @ts-check

const readInitialData = require("./steps/read-initial-data");
const setupEnvAndContexts = require("./steps/setup-env-and-contexts");
const cloneRepo = require("./steps/clone-repo");
const executeStepCommands = require("./steps/execute-step-commands");
const reportOutcome = require("./steps/report-outcome");

const runInfo = require("./run-info");

const executePipeline = async (initialData) => {
	if (!initialData) initialData = readInitialData();

	let setupIsErrored = false;
	runInfo.markNewStep({ stepName: "Setup" });
	/**
	 * @type {() => void}
	 */
	let removeTemporaryEnvironmentVariables = () => void 0;
	/**
	 * @type {() => void}
	 */
	let removeClonedFiles = () => void 0;
	try {
		removeTemporaryEnvironmentVariables = await setupEnvAndContexts(
			initialData
		);
		removeClonedFiles = await cloneRepo(initialData);
		runInfo.markStepEnd();
	} catch {
		setupIsErrored = true;
		runInfo.markStepEnd("errored");
	}

	if (!setupIsErrored) {
		// Setup done, execute steps and commands
		// Function takes care of parsing, evaluation and execution of step commands as well adding them to the central run info class.
		await executeStepCommands(initialData);
	}

	try {
		runInfo.markNewStep({ stepName: "Teardown and Reporting" });
		await reportOutcome();

		removeClonedFiles();
		removeTemporaryEnvironmentVariables();

		runInfo.markStepEnd();
	} catch (error) {
		console.error(error);
		//  Internal Failure
	}
};

module.exports = executePipeline;
