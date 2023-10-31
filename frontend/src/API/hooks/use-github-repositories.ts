import githubProvider from "../../providers/git-provider/github";
import useFetch from "./use-fetch";

const useGitHubRepositories = () => {
	return useFetch<ReturnType<(typeof githubProvider)["getRepositories"]>>(
		"github-repositores",
		githubProvider.getRepositories
	);
};

export default useGitHubRepositories;
