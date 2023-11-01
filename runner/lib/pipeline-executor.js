// @ts-check

const readInitialData = require("./steps/read-initial-data");
const setupEnvAndContexts = require("./steps/setup-env-and-contexts");
const cloneRepo = require("./steps/clone-repo");
const executeStepCommands = require("./steps/execute-step-commands");
const reportOutcome = require("./steps/report-outcome");

const runInfo = require("./run-info");

// A minimum time limit of 100 seconds for each CI Runner
const MINIMUM_TIMEOUT_SECONDS = 100;

const executePipeline = async (initialData, timeoutSeconds) => {
	let alreadyReportedAndTornDown = false;

	let timeout = setTimeout(() => {
		if (alreadyReportedAndTornDown) return (timeout = clearTimeout(timeout));

		if (
			runInfo.stepsOutcome[runInfo.stepsOutcome.length - 1].status ===
			"in-progress"
		) {
			// Could not complete in time, mark the step as errored
			runInfo.addLogToCurrentStep({
				type: "error",
				log: "Could not complete CI pipeline in the required timeframe.",
				ts: new Date().toISOString(),
			});
			runInfo.markStepEnd("errored");
		}

		teardownAndReport({ fromTimeout: true });
	}, Math.max(MINIMUM_TIMEOUT_SECONDS, timeoutSeconds - 4.5) * 1000);

	/**
	 * @type {() => void}
	 */
	let removeTemporaryEnvironmentVariables = () => void 0;
	/**
	 * @type {() => void}
	 */
	let removeClonedFiles = () => void 0;

	const teardownAndReport = async ({ fromTimeout = false } = {}) => {
		try {
			if (alreadyReportedAndTornDown) return;
			alreadyReportedAndTornDown = true;

			if (timeout) timeout = clearInterval(timeout);

			runInfo.markNewStep(
				{ stepName: "Teardown and Reporting" },
				{ force: true }
			);

			removeClonedFiles();
			removeTemporaryEnvironmentVariables();

			runInfo.markStepEnd("finished", { force: true });
			await reportOutcome();
		} catch (error) {
			console.error(error);
			//  Internal Failure
		}
	};

	if (!initialData) initialData = readInitialData();

	let setupIsErrored = false;
	runInfo.markNewStep({ stepName: "Setup" });

	try {
		removeTemporaryEnvironmentVariables = await setupEnvAndContexts(
			initialData
		);
		removeClonedFiles = await cloneRepo(initialData);
		runInfo.markStepEnd();
	} catch (error) {
		runInfo.markStepEnd("errored");
		setupIsErrored = true;
	}

	if (!setupIsErrored) {
		// Setup done, execute steps and commands
		// Function takes care of parsing, evaluation and execution of step commands as well adding them to the central run info class.
		await executeStepCommands(initialData);
	}

	await teardownAndReport();
};

module.exports = executePipeline;
