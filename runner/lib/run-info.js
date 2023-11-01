// @ts-check

const { uuidv4 } = require("@firebase/util");

class RunInfo {
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

	markNewStep = (
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

		this.stepsOutcome.push({
			stepName: step.stepName || "",
			id: uuidv4(),
			from: new Date().toISOString(),
			to: "",
			status: "in-progress",
		});
	};

	/**
	 * @type {(status?:'errored' | 'finished', options?: { force?: boolean }) => void}
	 */
	markStepEnd = (status = "finished", { force = false } = {}) => {
		if (!this.inProgress() && !force) return;

		const currentStep = this.stepsOutcome[this.stepsOutcome.length - 1];
		if (!currentStep) return;

		this.stepsOutcome[this.stepsOutcome.length - 1] = {
			...currentStep,
			status,
			to: new Date().toISOString(),
		};
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

		this.logPool.push({ stepId: currentStep.id, ...log });

		// TODO: Also send this log to a realtime database or listener for the user to see an append-only log of current job.
	};
}

module.exports = new RunInfo();
