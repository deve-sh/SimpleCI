// @ts-check

class RunInfo {
	/**
	 * @type { string }
	 */
	runId;

	/**
	 * @type {{
	 * 	stepName:string;
	 * 	id: string;
	 * 	from: string;
	 * 	to: string;
	 * 	status: typeof this.status;
	 * }[]}
	 */
	stepsOutcome = [];
	/**
	 * @type {{
	 * 	type: 'error' | 'info';
	 * 	log: string;
	 * 	ts: string;
	 * 	stepId: string;
	 * }[]}
	 */
	logPool = [];
	/**
	 * @type {Record<string, string>}
	 */
	context = {};
	/**
	 * @type {Record<string, string>}
	 */
	env = {};

	constructor() {}

	inProgress = () => {
		const currentStep = this.stepsOutcome[this.stepsOutcome.length - 1];
		return !currentStep || currentStep.status !== "errored";
	};

	markNewStep = async (
		/**
		 * @type { Partial<typeof this.stepsOutcome[number]> }
		 */
		step,
		/**
		 * @type { { force?: boolean } }
		 */
		{ force = false } = {}
	) => {
		if (!this.inProgress() && !force) return;

		const { uuidv4 } = require("@firebase/util");
		this.stepsOutcome.push({
			stepName: step.stepName || "",
			id: uuidv4(),
			from: new Date().toISOString(),
			to: "",
			status: "in-progress",
		});

		const reportSteps = require("./reporters/report-steps");
		await reportSteps();
	};

	/**
	 * @type {(status?:'errored' | 'finished', options?: { force?: boolean }) => Promise<void>}
	 */
	markStepEnd = async (status = "finished", { force = false } = {}) => {
		if (!this.inProgress() && !force) return;

		const currentStep = this.stepsOutcome[this.stepsOutcome.length - 1];
		if (!currentStep) return;

		this.stepsOutcome[this.stepsOutcome.length - 1] = {
			...currentStep,
			status,
			to: new Date().toISOString(),
		};

		const reportSteps = require("./reporters/report-steps");
		await reportSteps();
	};

	addLogToCurrentStep = (
		/**
		 * @type { Omit<typeof this.logPool[number], 'stepId'> }
		 */
		log
	) => {
		if (!this.inProgress()) return;

		const currentStep = this.stepsOutcome[this.stepsOutcome.length - 1];
		if (!currentStep) return;

		const logEntry = { stepId: currentStep.id, ...log };
		this.logPool.push(logEntry);

		// Add to a database or append to a log file.
		const reportLogs = require("./reporters/report-logs");
		reportLogs();
	};
}

module.exports = new RunInfo();
