import { useEffect } from "react";
import { ChakraProvider, Button } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

import auth, { useAuth } from "./providers/auth";
import { useSetGitHubCredentials } from "./providers/git-provider/github";

// Routes and Components
import UserDashboard from "./pages/dashboard";

function App() {
	const { user, signingIn } = useAuth();

	// Unsubscribe from auth on unmount
	useEffect(() => auth.destroy, []);

	useSetGitHubCredentials();

	return (
		<ChakraProvider>
			{!user && (
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
			)}
			&nbsp;
			{user && (
				<>
					<button onClick={() => auth.logout()}>Sign Out</button>
					<UserDashboard />
				</>
			)}
		</ChakraProvider>
	);
}

export default App;
