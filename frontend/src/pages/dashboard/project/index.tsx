import { useParams } from "react-router-dom";

import useProject from "../../../API/hooks/use-project";
import { Skeleton } from "@chakra-ui/react";

const Project = () => {
	const params = useParams();
	const {
		data: project,
		isLoading,
		error,
	} = useProject(params.projectId as string);

	if (error) return <>Error fetching project information: {error.message}</>;
	if (isLoading) return <Skeleton height="80vh" width="100vw" />;
	return <pre>{JSON.stringify(project, null, 4)}</pre>;
};

export default Project;
