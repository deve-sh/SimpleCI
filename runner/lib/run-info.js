// @ts-check

const { uuidv4 } = require("@firebase/util");

class RunInfo {
	/**
	 * @type { 'errored' | 'in-progress' | 'finished' }
	 */
	status = "in-progress";
	/**
	 * @type {{stepName:string, id: string, from: string; to: string; logPool: { type: typeof this.status, log: string, ts: string; }[] }[]}
	 */
	stepsInfo = [];
	/**
	 * @type {Record<string, string>}
	 */
	context = {};
	/**
	 * @type {Record<string, string>}
	 */
	env = {};

	constructor() {}

	markNewStep = (
		/**
		 * @type { Partial<typeof this.stepsInfo[number]> }
		 */
		step
	) => {
		this.stepsInfo.push({
			stepName: step.stepName || "",
			id: uuidv4(),
			from: new Date().toISOString(),
			logPool: [],
			to: "",
		});
	};

	markStepEnd = () => {
		const currentStep = this.stepsInfo[this.stepsInfo.length - 1];
		if (!currentStep) return;

		this.stepsInfo[this.stepsInfo.length - 1].to = new Date().toISOString();
	};

	addLogToCurrentStep = (
		/**
		 * @type { Partial<typeof this.stepsInfo[number]['logPool'][number]> }
		 */
		log
	) => {
		const currentStep = this.stepsInfo[this.stepsInfo.length - 1];
		if (!currentStep) return;

		// @ts-expect-error
		this.stepsInfo[this.stepsInfo.length - 1].logPool.push(log);

		// TODO: Also send this log to a realtime database or listener for the user to see an append-only log of current job.
	};
}

module.exports = new RunInfo();
