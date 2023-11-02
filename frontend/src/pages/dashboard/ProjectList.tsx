import { FiClock } from "react-icons/fi";
import {
	Card,
	CardBody,
	CardHeader,
	Flex,
	Grid,
	Heading,
	Skeleton,
	Text,
} from "@chakra-ui/react";

import useUserProjects from "../../API/hooks/use-user-projects";

const ProjectList = () => {
	const { projects, loading, error } = useUserProjects();

	if (error) return <>Failed to fetch projects. Reason: {error.message}</>;
	if (loading)
		return (
			<Grid
				gap="4"
				rowGap="8"
				templateColumns={{
					sm: "repeat(2, 1fr)",
					md: "repeat(3, 1fr)",
					lg: "repeat(4, 1fr)",
				}}
			>
				{[...new Array(9)].map((_, index) => (
					<Skeleton height="17.5rem" borderRadius="lg" key={index} />
				))}
			</Grid>
		);

	return (
		<Grid
			gap="4"
			rowGap="8"
			templateColumns={{
				sm: "repeat(2, 1fr)",
				md: "repeat(3, 1fr)",
			}}
		>
			{projects.map((project) => (
				// <Link to={`/project/${project.id}`}>
				<Card
					height="100%"
					minWidth="25%"
					key={project.id}
					_hover={{ boxShadow: "lg" }}
				>
					<CardHeader>
						<Heading size="md" noOfLines={1}>
							{project.name}
						</Heading>
					</CardHeader>
					<CardBody width="100%" pr="0">
						<Flex mt="4">
							<Text
								fontSize="0.75rem"
								display="flex"
								alignItems="center"
								gap="2"
								color="gray.500"
								flex="0.75"
							>
								<FiClock /> {project.createdAt?.toDate?.().toDateString()}
							</Text>
						</Flex>
					</CardBody>
				</Card>
				// </Link>
			))}
		</Grid>
	);
};

export default ProjectList;
