import { useParams, Link } from "react-router-dom";
import {
	Table,
	Tbody,
	Tr,
	Tag,
	Td,
	TableCaption,
	TableContainer,
	Skeleton,
} from "@chakra-ui/react";

import useProject from "../../../API/hooks/use-project";
import useProjectRuns from "../../../API/hooks/use-project-runs";

const Project = () => {
	const params = useParams();
	const { isLoading, error: error } = useProject(params.projectId as string);

	const { runs = [] } = useProjectRuns(params.projectId as string);

	if (error) return <>Error fetching project information: {error.message}</>;
	if (isLoading) return <Skeleton height="80vh" width="100vw" />;
	return (
		<TableContainer width="100%">
			{/* Add project details here */}
			<Table variant="simple">
				<TableCaption>Project Latest CI Runs</TableCaption>
				<Tbody>
					{runs.map((run) => (
						<Tr key={run.runId}>
							{/* Add the trigger information for pipeline */}
							<Td>
								<Link to={`/dashboard/run/${run.runId}`}>
									{new Date(run.updatedAt.toDate()).toDateString()}{" "}
									{new Date(run.updatedAt.toDate()).toTimeString()}
								</Link>
							</Td>
							<Td>
								<Tag
									colorScheme={
										run.status === "finished"
											? "green"
											: run.status === "errored"
											? "red"
											: "orange"
									}
								>
									{run.status}
								</Tag>
							</Td>
						</Tr>
					))}
				</Tbody>
			</Table>
		</TableContainer>
	);
};

export default Project;
