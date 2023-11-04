import { getProjectRunsQuery, type Run } from "../runs";
import useRealtimeFirestoreQuery from "./abstractions/use-realtime-firestore-query";

const useProjectRuns = (projectId: string) => {
	const { data: runs, ...rest } = useRealtimeFirestoreQuery<Run>(
		getProjectRunsQuery(projectId).query
	);
	return { runs, ...rest };
};

export default useProjectRuns;
