const generateCloudFunctionURL = (
	functionName = "",
	region = "asia-south1"
) => {
	return `https://${region}-${
		JSON.parse(process.env.FIREBASE_CONFIG).projectId
	}.cloudfunctions.net/${functionName}`;
};

module.exports = generateCloudFunctionURL;
