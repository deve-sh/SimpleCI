// @ts-check

const runInfo = require("../run-info");
const evaluateExpression = require("../process/evaluate-expression");
const SpawnedProcess = require("../process/spawn-process");

/**
 *
 * @param {string} command
 * @returns {Promise<void>}
 */
const executeIndividualCommand = (command) =>
	new Promise((resolve, reject) => {
		const process = new SpawnedProcess(command);
		process.on("complete", (status) => {
			if (status === "errored") reject();
			else resolve();
		});
	});

/**
 * @type {(initialData: { steps: any[] }) => Promise<void>}
 */
const executeStepCommands = async (initialData) => {
	const steps = initialData.steps;
	let stepIndex = 1;
	for (const step of steps) {
		if (
			!step.condition ||
			(step.condition &&
				(await evaluateExpression(step.condition)).resolvedValue)
		) {
			runInfo.markNewStep({
				stepName: step.name || `Step Number ${stepIndex + 1}`,
			});

			try {
				if (step.run && Array.isArray(step.run))
					for (const runCommand of step.run)
						await executeIndividualCommand(runCommand);

				if (typeof step.run === "string")
					await executeIndividualCommand(step.run);
			} catch {
				// Error thrown in step, terminate execution here and move to unsetting and reporting step
				runInfo.markStepEnd("errored");
				runInfo.status = "errored";
				return;
			}

			runInfo.markStepEnd();
		}
	}
};

module.exports = executeStepCommands;
