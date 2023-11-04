import { Navigate, useOutlet } from "react-router-dom";
import { Button, Flex, VStack } from "@chakra-ui/react";

import auth, { useAuth } from "../../providers/auth";

import ProjectList from "./ProjectList";
import RepoListAndCreateProject from "./RepoListAndCreateProject";

const UserDashboard = () => {
	const { user } = useAuth();
	const Outlet = useOutlet();

	const Header = (
		<Flex width="100%" justifyContent="flex-end">
			<Button colorScheme="red" onClick={() => auth.logout()}>
				Sign Out
			</Button>
		</Flex>
	);

	const Body = Outlet || (
		<>
			<ProjectList />
			<RepoListAndCreateProject />
		</>
	);

	if (!user) return <Navigate to="/" />;
	return (
		<VStack padding="4" gap="4" alignItems="flex-start">
			{Header}
			{Body}
		</VStack>
	);
};

export default UserDashboard;
