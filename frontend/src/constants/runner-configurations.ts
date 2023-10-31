const runnerConfigurations = [
	{
		id: "standard",
		name: "Standard",
		description: "512MB Memory, Timeout: 2.5 minutes",
		price: "",
	},
	{
		id: "medium",
		name: "Medium",
		description: "2GB Memory, Timeout: 5 minutes",
		price: "",
	},
	{
		id: "large",
		name: "Large",
		description: "4GB Memory, Timeout: 9 minutes",
		price: "",
	},
] as const;

export default runnerConfigurations;
