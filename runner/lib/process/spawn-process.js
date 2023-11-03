// @ts-check

class SpawnedProcess {
	/**
	 * @type { import("child_process").ChildProcessWithoutNullStreams | null }
	 */
	process = null;
	/**
	 * @type {'errored' | 'finished' | 'in-progress'}
	 */
	finalStatus = "in-progress";

	/**
	 * @type { Set<((newLog: {type: 'error' | 'info', log: string }) => void)> }
	 */
	onLog = new Set();

	/**
	 * @type { Set<((status: typeof this.finalStatus) => void)> }
	 */
	onComplete = new Set();

	/**
	 * @type { (severity: 'info' | 'error') => (log: string) => void}
	 */
	addToLogs = (severity) => (log) => {
		const logString = log.toString().trim();
		if (!logString.length) return;

		if (severity === "error") console.error(logString);
		if (severity === "info") console.log(logString);

		const runInfo = require("../run-info");

		// Hide sensitive information like environment variable values
		let processedLogString = logString;
		for (const envVar in runInfo.env) {
			if (runInfo.env.hasOwnProperty(envVar)) {
				const envVarValue = runInfo.env[envVar];
				processedLogString = processedLogString.replace(
					new RegExp(envVarValue, "g"),
					"*".repeat(Math.min(envVarValue.length, 6))
				);
			}
		}

		const newLog = {
			type: severity,
			log: processedLogString,
			ts: new Date().toISOString(),
		};

		this.onLog.forEach((subscriber) => subscriber(newLog));
		runInfo.addLogToCurrentStep(newLog);
	};

	constructor(
		/**
		 * @type {string}
		 */
		command,
		/**
		 * @type {string}
		 */
		workingDirectory = ""
	) {
		const { spawn } = require("child_process");

		this.process = spawn(command, {
			shell: true,
			cwd: workingDirectory || undefined,
		});

		this.process.stdout.on("data", this.addToLogs("info"));
		this.process.stderr.on("data", this.addToLogs("error"));

		this.process.on("close", (code, signal) => {
			if (code || signal) {
				// Errored Exit
				this.finalStatus = "errored";
			} else {
				// Clean Exit
				this.finalStatus = "finished";
			}
			this.onComplete.forEach((subscriber) => subscriber(this.finalStatus));
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
