import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";

import { getUserProjectsQuery, type Project } from "../projects";
import { useAuth } from "../../providers/auth";

const useUserProjects = () => {
	const { user } = useAuth();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [projects, setProjects] = useState<Project[]>([]);

	useEffect(() => {
		if (!user?.uid) return;

		setLoading(true);
		const { query, processData } = getUserProjectsQuery();
		const unsubFunction = onSnapshot(
			query,
			(snapshot) => {
				setLoading(false);
				const processedProjects = processData(snapshot);
				setProjects(processedProjects);
			},
			setError
		);

		return () => {
			if (unsubFunction) unsubFunction();
		};
	}, [user?.uid]);

	return { projects, error, loading };
};

export default useUserProjects;
