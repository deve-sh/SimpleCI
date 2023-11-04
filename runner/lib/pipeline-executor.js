// @ts-check

const readInitialData = require("./steps/read-initial-data");
const setupEnvAndContexts = require("./steps/setup-env-and-contexts");
const cloneRepo = require("./steps/clone-repo");
const executeStepCommands = require("./steps/execute-step-commands");
const reportOutcome = require("./steps/report-outcome");

const runInfo = require("./run-info");

// A minimum time limit of 100 seconds for each CI Runner
const MINIMUM_TIMEOUT_SECONDS = 100;

const executePipeline = async (
	/**
	 * @type { ReturnType<typeof readInitialData>}
	 */
	initialData,
	timeoutSeconds = MINIMUM_TIMEOUT_SECONDS
) => {
	runInfo.runId = initialData.runId;
	runInfo.initialData = initialData;

	// Teardown and timeout handling
	let alreadyReportedAndTornDown = false;
	let timeout = setTimeout(async () => {
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
			await runInfo.markStepEnd("errored");
		}

		await teardownAndReport({ fromTimeout: true });
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

			await runInfo.markNewStep(
				{ stepName: "Teardown and Reporting" },
				{ force: true }
			);

			removeClonedFiles();
			removeTemporaryEnvironmentVariables();

			await runInfo.markStepEnd("finished", { force: true });
			await reportOutcome();
		} catch (error) {
			console.error(error);
			//  Internal Failure
		}
	};

	if (!initialData) initialData = readInitialData();

	//#region Actual execution
	let setupIsErrored = false;
	try {
		await runInfo.markNewStep({ stepName: "Setup" });
		removeTemporaryEnvironmentVariables = await setupEnvAndContexts(
			initialData
		);
		removeClonedFiles = await cloneRepo(initialData);
		await runInfo.markStepEnd();
		await createCommitStatus("github", finalStatus);
	} catch (error) {
		await runInfo.markStepEnd("errored");
		setupIsErrored = true;
	}

	if (!setupIsErrored) {
		// Setup done, execute steps and commands
		// Function takes care of parsing, evaluation and execution of step commands as well adding them to the central run info class.
		await executeStepCommands(initialData);
	}

	await teardownAndReport();
	//#endregion
};

module.exports = executePipeline;
