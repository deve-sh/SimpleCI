import {
	doc,
	collection,
	getDoc,
	where,
	query,
	orderBy,
	limit,
	type DocumentData,
	type QuerySnapshot,
} from "firebase/firestore";

import db from "../providers/database";

const COLLECTION_NAME = "simpleci-runs";
const LOGS_COLLECTION_NAME = "simpleci-run-logs";

export interface Run {
	runId: string;
	projectId: string;
	status: "in-progress" | "errored" | "finished";
	associatedWebhook: string | number;
	initialData: Record<string, string | Record<string, string>>;
	stepsExecuted: {
		status: "in-progress" | "errored" | "finished";
		id: string;
		from: string;
		stepName: string;
		to: string;
	}[];
}

export interface Log {
	stepId: string;
	type: "error" | "info" | "warning";
	logString: string;
	ts: string; // Timestamp
}

export const getProjectRunsQuery = (projectId: string) => {
	const runsQuery = query(
		collection(db, COLLECTION_NAME),
		where("project", "==", projectId),
		orderBy("updatedAt", "desc"),
		limit(20)
	);
	return {
		query: runsQuery,
		processData: (snapshot: QuerySnapshot<DocumentData, DocumentData>) =>
			snapshot.docs.map((run) => run.data() as Run),
	};
};

export const getRunLogs = async (runId: string) => {
	try {
		const runLogsDoc = doc(db, LOGS_COLLECTION_NAME, runId);
		const runLogs = await getDoc(runLogsDoc);
		return { error: null, data: runLogs.data() as { logs: Log[] } };
	} catch (error) {
		return { error, data: null };
	}
};
