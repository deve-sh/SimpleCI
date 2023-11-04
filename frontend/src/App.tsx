import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import auth from "./providers/auth";
import { useSetGitHubCredentials } from "./providers/git-provider/github";

// Routes and Components
const Home = lazy(() => import("./pages/home"));
const UserDashboard = lazy(() => import("./pages/dashboard"));
const ProjectDashboard = lazy(() => import("./pages/dashboard/project"));

function App() {
	// Unsubscribe from auth on unmount
	useEffect(() => auth.destroy, []);

	useSetGitHubCredentials();

	return (
		<BrowserRouter>
			<ChakraProvider>
				<Suspense fallback={null}>
					<Routes>
						<Route path="/" Component={Home} />
						<Route path="/dashboard" Component={UserDashboard}>
							<Route path="project/:projectId" Component={ProjectDashboard} />
						</Route>
					</Routes>
				</Suspense>
			</ChakraProvider>
		</BrowserRouter>
	);
}

export default App;
