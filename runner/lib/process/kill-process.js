// @ts-check
const { spawnSync } = require("child_process");

/**
 * @type {(processId: string) => ReturnType<typeof spawnSync>}
 */
const killProcess = (processId) => spawnSync("kill", [processId.toString()]);

module.exports = killProcess;
