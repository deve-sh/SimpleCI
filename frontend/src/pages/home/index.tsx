import { Navigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

import auth, { useAuth } from "../../providers/auth";

const Home = () => {
	const { user, signingIn } = useAuth();

	if (user) return <Navigate to="/dashboard" />;
	return (
		!user && (
			<Button
				padding="8"
				size="lg"
				colorScheme="white"
				background="blackAlpha.800"
				leftIcon={<FaGithub fontSize="2rem" />}
				isLoading={signingIn}
				disabled={signingIn}
				onClick={() => auth.loginWithPopup("github")}
			>
				&nbsp;Sign In With GitHub
			</Button>
		)
	);
};

export default Home;
