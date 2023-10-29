// @ts-check
const {
	Worker,
	isMainThread,
	workerData,
	parentPort,
} = require("node:worker_threads");

if (isMainThread) {
	const runInfo = require("../run-info");

	const evaluateExpression = (expression = "") =>
		new Promise((resolve, reject) => {
			const expressionToEvaluate = `
                const env = ${JSON.stringify(runInfo.env)};
				const context = ${JSON.stringify(runInfo.context)};
                return (${expression});
            `;

			const evaluationWorker = new Worker(__filename, {
				workerData: { expression: expressionToEvaluate },
			});
			evaluationWorker.on("message", resolve);
			evaluationWorker.on("error", reject);
			evaluationWorker.on("exit", (code) => {
				if (code !== 0)
					reject(
						new Error(
							`Condition evaluation for step failed. Please check your expression.`
						)
					);
			});
		});

	module.exports = evaluateExpression;
} else {
	const evaluationFunction = new Function(workerData.expression);
	const resolvedValue = evaluationFunction();
	parentPort?.postMessage({ resolvedValue });
}
