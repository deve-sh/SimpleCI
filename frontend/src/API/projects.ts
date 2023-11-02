import {
	writeBatch,
	doc,
	serverTimestamp,
	collection,
	getDocs,
	where,
	query,
	orderBy,
	limit,
	type Timestamp,
	type DocumentData,
	type QuerySnapshot,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";

import db from "../providers/database";
import auth from "../providers/auth";

const COLLECTION_NAME = "simpleci-projects";

export interface Project {
	name: string;
	repositoryId: string | number;
	repositoryName: string;
	cloneURL: string;
	url: string;
	repoProvider: "github";
	token: string;
	ownedBy: string;
	members: string[];
	createdBy: string;
	organization: string | null;
	updatedBy: string;
	createdAt: Timestamp;
	updatedAt: Timestamp;
	providerSpecificContext?: Record<string, string>;
	config: {
		hookEvents: string[];
		runnerPreference: "standard" | "medium" | "large";
	};
}

export const createProject = async (project: Partial<Project>) => {
	try {
		if (!auth.currentUser) throw new Error("User isn't logged in.");

		const batch = writeBatch(db);

		const projectId = uuid();

		const projectDoc = doc(db, COLLECTION_NAME, projectId);

		batch.set(
			projectDoc,
			{
				...project,
				id: projectId,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
				createdBy: auth.currentUser.uid,
				ownedBy: auth.currentUser.uid,
				members: [auth.currentUser.uid],
				updatedBy: auth.currentUser.uid,
			},
			{ merge: true }
		);

		await batch.commit();

		return { error: null, project };
	} catch (error) {
		return { error };
	}
};

export const getUserProjectsQuery = () => {
	const projectsQuery = query(
		collection(db, COLLECTION_NAME),
		where("members", "array-contains", auth.currentUser?.uid as string),
		orderBy("createdAt", "desc")
	);
	return {
		query: projectsQuery,
		processData: (snapshot: QuerySnapshot<DocumentData, DocumentData>) =>
			snapshot.docs.map((project) => ({
				...(project.data() as Project),
				createdAt: project.get("createdAt").toDate(),
				updatedAt: project.get("updatedAt").toDate(),
			})),
	};
};

export const getUserProjectByRepoId = async (repoId: string | number) => {
	try {
		const projectQuery = query(
			collection(db, COLLECTION_NAME),
			where("members", "array-contains", auth.currentUser?.uid as string),
			where("repositoryId", "==", repoId),
			limit(1)
		);
		const projects = (await getDocs(projectQuery)).docs.map((project) => ({
			...(project.data() as Project),
			createdAt: project.get("createdAt").toDate(),
			updatedAt: project.get("updatedAt").toDate(),
		}));
		return { error: null, data: projects[0] };
	} catch (error) {
		return { error, data: null };
	}
};
