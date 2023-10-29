const readInitialData = require("./lib/read-initial-data");
const cloneRepo = require("./lib/clone-repo");

const steps = async () => {
	const initalData = readInitialData();
	await cloneRepo(initalData.repositoryURI, initalData.token);
};

steps();
