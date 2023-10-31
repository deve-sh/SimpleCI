import { useState } from "react";
import { Box, Flex, Heading, useDisclosure, useToast } from "@chakra-ui/react";

import { useAuth } from "../../providers/auth";
import useGitHubRepositories from "../../API/hooks/use-github-repositories";
import {
	Project,
	createProject,
	getUserProjectByRepoId,
} from "../../API/projects";

import debounce from "../../utils/debounce";

import RepoCard from "../../components/RepoCard";
import ProjectCreationPopup, {
	type ProjectCreationPopupProps,
} from "./ProjectCreationPopup";

import type Repository from "../../types/Repository";

const UserDashboard = () => {
	const toast = useToast();
	const { oauthCredentials } = useAuth();
	const { data: githubRepositories, isLoading } = useGitHubRepositories();

	const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
	const [creatingProject, setCreatingProject] = useState<boolean>(false);
	const {
		isOpen: showProjectCreationPopup,
		onOpen: openProjectCreationPopup,
		onClose: closeProjectCreationPopup,
	} = useDisclosure();

	const onRepoSelect = (repo: Repository) =>
		debounce(async () => {
			if (!repo) return;

			const { data: existingProject } = await getUserProjectByRepoId(repo.id);
			if (existingProject)
				return toast({
					status: "error",
					title: "You already have a project for this repository.",
				});

			openProjectCreationPopup();
			setSelectedRepo(repo);
		});

	const unslectRepoForProject = debounce(() => {
		closeProjectCreationPopup();
		setSelectedRepo(null);
	});

	const onSubmit = debounce(
		async (inputs: Parameters<ProjectCreationPopupProps["onSubmit"]>[0]) => {
			if (!selectedRepo) return;
			if (!inputs.name || !inputs.hookEvents.length || !inputs.runnerPreference)
				return;
			setCreatingProject(true);
			const projectPayload: Partial<Project> = {
				name: inputs.name,
				config: {
					hookEvents: inputs.hookEvents,
					runnerPreference: inputs.runnerPreference,
				},
				repoProvider: "github",
				token: oauthCredentials?.accessToken as string,
				cloneURL: selectedRepo.clone_url,
				url: selectedRepo.html_url,
				repositoryId: selectedRepo.id,
				repositoryName: selectedRepo.name,
				organization: null,
				providerSpecificContext: {
					owner: selectedRepo.owner.login,
				},
			};
			const { error } = await createProject(projectPayload);

			setCreatingProject(false);
			if (error)
				return toast({
					status: "error",
					title: "Failed to create project",
					description: (error as Error).message,
				});

			toast({ status: "success", title: "Created Project successfully" });
			closeProjectCreationPopup();
		}
	);

	if (isLoading) return "Loading Repositories...";
	return (
		<Box padding="4">
			<Heading size="lg" mb="6">
				Add A CI/CD Project from your Repositories
			</Heading>
			<Flex wrap="wrap" gap="4">
				{githubRepositories?.map((repository) => (
					<RepoCard
						key={repository.id}
						link={repository.html_url}
						title={repository.name}
						description={repository.description || ""}
						provider="github"
						onClick={onRepoSelect(repository)}
					/>
				))}
			</Flex>

			{showProjectCreationPopup && (
				<ProjectCreationPopup
					isOpen={showProjectCreationPopup}
					close={unslectRepoForProject}
					initialInputs={{
						name: selectedRepo?.name || "",
						hookEvents: ["push"],
					}}
					repoProvider="github"
					creating={creatingProject}
					onSubmit={onSubmit}
				/>
			)}
		</Box>
	);
};

export default UserDashboard;
