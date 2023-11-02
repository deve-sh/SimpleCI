import { VStack } from "@chakra-ui/react";

import ProjectList from "./ProjectList";
import RepoListAndCreateProject from "./RepoListAndCreateProject";

const UserDashboard = () => {
	return (
		<VStack padding="4" gap="4" alignItems="flex-start">
			<ProjectList />
			<RepoListAndCreateProject />
		</VStack>
	);
};

export default UserDashboard;
