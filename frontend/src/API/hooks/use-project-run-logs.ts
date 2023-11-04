import { getRunLogsReference, type Log } from "../runs";
import useRealtimeFirestoreDoc from "./abstractions/use-realtime-firestore-doc";

const useProjectRunLogs = (runId: string) => {
	const { data: logsDoc, ...rest } = useRealtimeFirestoreDoc<{ logs: Log[] }>(
		getRunLogsReference(runId).doc
	);
	return { logs: logsDoc?.logs || [], ...rest };
};

export default useProjectRunLogs;
