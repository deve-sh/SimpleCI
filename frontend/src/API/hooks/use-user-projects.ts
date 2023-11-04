import { getUserProjectsQuery, type Project } from "../projects";
import useRealtimeFirestoreQuery from "./abstractions/use-realtime-firestore-query";

const useUserProjects = () => {
	const { data: projects, ...rest } = useRealtimeFirestoreQuery<Project>(
		getUserProjectsQuery().query
	);
	return { projects, ...rest };
};

export default useUserProjects;
