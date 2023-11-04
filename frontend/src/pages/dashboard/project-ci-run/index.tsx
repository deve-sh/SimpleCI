import { useParams } from "react-router-dom";
import { Box, VStack } from "@chakra-ui/react";

import useProjectRunLogs from "../../../API/hooks/use-project-run-logs";

const ProjectCIRun = () => {
	const params = useParams();

	const { logs } = useProjectRunLogs(params.runId as string);

	return (
		<VStack
			background="blackAlpha.900"
			color="white"
			height="85vh"
			width="100%"
			padding="4"
			borderRadius="lg"
			alignItems="flex-start"
			gap="3"
			fontFamily="monospace"
		>
			{logs.map((log, index) => (
				<Box
					id={log.stepId + index}
					color={log.type === "error" ? "red.500" : "white"}
				>
					{log.log}
				</Box>
			))}
		</VStack>
	);
};

export default ProjectCIRun;
