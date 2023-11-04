import { useAuth } from "../../providers/auth";
import githubProvider from "../../providers/git-provider/github";
import useFetch from "./abstractions/use-fetch";

const useGitHubRepositories = () => {
	const { user } = useAuth();
	
	return useFetch<ReturnType<(typeof githubProvider)["getRepositories"]>>(
		user && user.providerId === "github.com" ? "github-repositores" : null,
		githubProvider.getRepositories
	);
};

export default useGitHubRepositories;
