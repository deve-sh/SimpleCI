import { getProjectRunsQuery, type Run } from "../runs";
import useRealtimeFirestoreQuery from "./use-realtime-value";

const useProjectRuns = (projectId: string) => {
	const { data: runs, ...rest } = useRealtimeFirestoreQuery<Run>(
		getProjectRunsQuery(projectId).query
	);
	return { runs, ...rest };
};

export default useProjectRuns;
