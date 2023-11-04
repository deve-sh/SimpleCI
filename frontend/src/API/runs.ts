import {
	doc,
	collection,
	where,
	query,
	orderBy,
	limit,
	type DocumentData,
	type QuerySnapshot,
	type Timestamp,
} from "firebase/firestore";

import db from "../providers/database";

const COLLECTION_NAME = "simpleci-runs";
const LOGS_COLLECTION_NAME = "simpleci-run-logs";

export interface Run {
	runId: string;
	updatedAt: Timestamp;
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
	log: string;
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

export const getRunLogsReference = (runId: string) => {
	const runLogsDoc = doc(db, LOGS_COLLECTION_NAME, runId);
	return { doc: runLogsDoc };
};
