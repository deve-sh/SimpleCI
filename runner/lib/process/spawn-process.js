// @ts-check

const { spawn } = require("child_process");
const runInfo = require("../run-info");

class SpawnedProcess {
	/**
	 * @type { import("child_process").ChildProcessWithoutNullStreams | null }
	 */
	process = null;
	/**
	 * @type {{type: 'error' | 'info', log: string }[]}
	 */
	outputLogs = [];
	/**
	 * @type {'errored' | 'finished' | 'in-progress'}
	 */
	finalStatus = "in-progress";

	/**
	 * @type { Set<((newLog: typeof this.outputLogs[number]) => void)> }
	 */
	onLog = new Set();

	/**
	 * @type { Set<((status: typeof this.finalStatus) => void)> }
	 */
	onComplete = new Set();

	/**
	 * @type { (severity: 'info' | 'error', log: string) => void}
	 */
	addToLogs = (severity, log) => {
		const logString = log.toString().trim();
		if (!logString.length) return;

		const newLog = {
			type: severity,
			log: logString,
			ts: new Date().toISOString(),
		};
		this.outputLogs.push(newLog);
        runInfo.logPool.push(newLog);
		this.onLog.forEach((subscriber) => subscriber(newLog));
	};

	constructor(
		/**
		 * @type {string}
		 */
		command
	) {
		this.process = spawn(command, { shell: true });

		this.process.stdout.on("data", (data) => {
			this.addToLogs("info", data);
			console.log(data.toString());
		});

		this.process.stderr.on("data", (data) => {
			this.addToLogs("error", data);
			console.error(data.toString());
		});

		this.process.on("close", (code, signal) => {
			if (code || signal) {
				// Errored Exit
				this.finalStatus = "errored";
			} else {
				// Clean Exit
				this.finalStatus = "finished";
			}
			this.onComplete.forEach((subscriber) => subscriber(this.finalStatus));
            runInfo.status = this.finalStatus;
		});
	}

	/**
	 * @type {(event: 'complete' | 'log', callback: (...args: any[]) => any) => void}
	 */
	on = (event, callback) => {
		if (event === "complete") this.onComplete.add(callback);
		if (event === "log") this.onLog.add(callback);
	};

	/**
	 * @type {(event: 'complete' | 'log', callback: (...args: any[]) => any) => boolean}
	 */
	off = (event, callback) => {
		if (event === "complete") return this.onComplete.delete(callback);
		if (event === "log") return this.onLog.delete(callback);
		return false;
	};
}

module.exports = SpawnedProcess;
