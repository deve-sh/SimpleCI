// @ts-check

class RunInfo {
	/**
	 * @type { 'errored' | 'in-progress' | 'finished' }
	 */
	status = "in-progress";
	/**
	 * @type { {type: typeof this.status, log: string, ts: string; }[] }
	 */
	logPool = [];

	constructor() {}
}

module.exports = new RunInfo();
