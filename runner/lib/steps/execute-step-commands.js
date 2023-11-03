// @ts-check

/**
 *
 * @param {string} command
 * @param {string} runId
 * @returns {Promise<void>}
 */
const executeIndividualCommand = (command, runId) =>
	new Promise((resolve, reject) => {
		const SpawnedProcess = require("../process/spawn-process");
		const clonedRepoWorkingDirectory = `/tmp/${runId}/ci-cd-app`;
		const process = new SpawnedProcess(command, clonedRepoWorkingDirectory);
		process.on("complete", (status) => {
			if (status === "errored") reject();
			else resolve();
		});
	});

/**
 * @type {(initialData: { runId: string, steps: any[] }) => Promise<void>}
 */
const executeStepCommands = async (initialData) => {
	const runInfo = require("../run-info");
	const steps = initialData.steps;
	let stepIndex = 1;
	for (const step of steps) {
		const evaluateExpression = require("../process/evaluate-expression");
		if (
			!step.condition ||
			(step.condition &&
				(await evaluateExpression(step.condition)).resolvedValue)
		) {
			await runInfo.markNewStep({
				stepName: step.name || `Step Number ${stepIndex + 1}`,
			});

			try {
				if (step.run && Array.isArray(step.run))
					for (const runCommand of step.run)
						await executeIndividualCommand(runCommand, initialData.runId);

				if (typeof step.run === "string")
					await executeIndividualCommand(step.run, initialData.runId);
			} catch {
				// Error thrown in step, terminate execution here and move to unsetting and reporting step
				return await runInfo.markStepEnd("errored");
			}

			await runInfo.markStepEnd();
		}
	}
};

module.exports = executeStepCommands;
