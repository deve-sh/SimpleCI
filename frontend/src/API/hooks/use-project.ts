import { useCallback } from "react";

import { useAuth } from "../../providers/auth";
import { getUserProjectById } from "../projects";

import useFetch from "./use-fetch";

const useProject = (projectId: string | null) => {
	const { user } = useAuth();

	const fetcher = useCallback(
		() =>
			getUserProjectById(projectId as string).then(({ data, error }) => {
				if (error) throw error;
				return data;
			}),
		[projectId]
	);

	return useFetch<Awaited<ReturnType<typeof getUserProjectById>>["data"]>(
		user && projectId ? `project${projectId}` : null,
		fetcher
	);
};

export default useProject;
