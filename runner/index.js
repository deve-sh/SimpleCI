const readInitialData = require("./lib/read-initial-data");
const cloneRepo = require("./lib/steps/clone-repo");

const steps = async () => {
	const initalData = readInitialData();
	await cloneRepo(initalData);
};

steps();
