const getEnv = (variable: string) => {
	return import.meta.env[`VITE_${variable}`];
};

export default getEnv;
