const supportedGithubWebhooks = [
	{
		id: "create",
		description: "Branch or tag created.",
		title: "Branch or tag creation",
	},
	{
		id: "delete",
		description: "Branch or tag deleted.",
		title: "Branch or tag deletion",
	},
	{
		id: "branch_protection_configuration",
		description: "All branch protections disabled or enabled for a repository.",
		title: "Branch protection configurations",
	},
	{
		id: "branch_protection_rule",
		description: "Branch protection rule created, deleted or edited.",
		title: "Branch protection rules",
	},
	{
		id: "check_run",
		description: "Check run is created, requested, rerequested, or completed.",
		title: "Check runs",
	},
	{
		id: "check_suite",
		description: "Check suite is requested, rerequested, or completed.",
		title: "Check suites",
	},
	{
		id: "code_scanning_alert",
		description: "Code Scanning alert created, fixed in branch, or closed",
		title: "Code scanning alerts",
	},
	{
		id: "member",
		description:
			"Collaborator added to, removed from, or has changed permissions for a repository.",
		title: "Collaborator add, remove, or changed",
	},
	{
		id: "commit_comment",
		description: "Commit or diff commented on.",
		title: "Commit comments",
	},
	{
		id: "custom_property_values",
		description: "Custom property values are changed for a repository",
		title: "Custom property values",
	},
	{
		id: "dependabot_alert",
		description:
			"Dependabot alert auto_dismissed, auto_reopened, created, dismissed, reopened, fixed, or reintroduced.",
		title: "Dependabot alerts",
	},
	{
		id: "deploy_key",
		description: "A deploy key is created or deleted from a repository.",
		title: "Deploy keys",
	},
	{
		id: "deployment_status",
		description: "Deployment status updated from the API.",
		title: "Deployment statuses",
	},
	{
		id: "deployment",
		description: "Repository was deployed or a deployment was deleted.",
		title: "Deployments",
	},
	{
		id: "discussion_comment",
		description: "Discussion comment created, edited, or deleted.",
		title: "Discussion comments",
	},
	{
		id: "discussion",
		description:
			"Discussion created, edited, closed, reopened, pinned, unpinned, locked, unlocked, transferred, answered, unanswered, labeled, unlabeled, had its category changed, or was deleted.",
		title: "Discussions",
	},
	{
		id: "fork",
		description: "Repository forked.",
		title: "Forks",
	},
	{
		id: "issue_comment",
		description: "Issue comment created, edited, or deleted.",
		title: "Issue comments",
	},
	{
		id: "issues",
		description:
			"Issue opened, edited, deleted, transferred, pinned, unpinned, closed, reopened, assigned, unassigned, labeled, unlabeled, milestoned, demilestoned, locked, or unlocked.",
		title: "Issues",
	},
	{
		id: "label",
		description: "Label created, edited or deleted.",
		title: "Labels",
	},
	{
		id: "merge_group",
		description: "Merge Group requested checks, or was destroyed.",
		title: "Merge groups",
	},
	{
		id: "meta",
		description: "This particular hook is deleted.",
		title: "Meta",
	},
	{
		id: "milestone",
		description: "Milestone created, closed, opened, edited, or deleted.",
		title: "Milestones",
	},
	{
		id: "package",
		description: "GitHub Packages published or updated in a repository.",
		title: "Packages",
	},
	{
		id: "page_build",
		description: "Pages site built.",
		title: "Page builds",
	},
	{
		id: "project_card",
		description: "Project card created, updated, or deleted.",
		title: "Project cards",
	},
	{
		id: "project_column",
		description: "Project column created, updated, moved or deleted.",
		title: "Project columns",
	},
	{
		id: "project",
		description: "Project created, updated, or deleted.",
		title: "Projects",
	},
	{
		id: "pull_request_review_comment",
		description: "Pull request diff comment created, edited, or deleted.",
		title: "Pull request review comments",
	},
	{
		id: "pull_request_review_thread",
		description: "A pull request review thread was resolved or unresolved.",
		title: "Pull request review threads",
	},
	{
		id: "pull_request_review",
		description: "Pull request review submitted, edited, or dismissed.",
		title: "Pull request reviews",
	},
	{
		id: "pull_request",
		description:
			"Pull request assigned, auto merge disabled, auto merge enabled, closed, converted to draft, demilestoned, dequeued, edited, enqueued, labeled, locked, milestoned, opened, ready for review, reopened, review request removed, review requested, synchronized, unassigned, unlabeled, or unlocked.",
		title: "Pull requests",
	},
	{
		id: "push",
		description: "Git push to a repository.",
		title: "Pushes",
	},
	{
		id: "registry_package",
		description: "Registry package published or updated in a repository.",
		title: "Registry packages",
	},
	{
		id: "release",
		description: "Release created, edited, published, unpublished, or deleted.",
		title: "Releases",
	},
	{
		id: "repository",
		description:
			"Repository created, deleted, archived, unarchived, publicized, privatized, edited, renamed, or transferred.",
		title: "Repositories",
	},
	{
		id: "repository_advisory",
		description: "Repository advisory published or reported.",
		title: "Repository advisories",
	},
	{
		id: "repository_import",
		description: "Repository import succeeded, failed, or cancelled.",
		title: "Repository imports",
	},
	{
		id: "repository_ruleset",
		description: "Repository ruleset created, deleted or edited.",
		title: "Repository rulesets",
	},
	{
		id: "repository_vulnerability_alert",
		description:
			"Dependabot alert (aka dependency vulnerability alert) created, resolved, or dismissed on a repository.",
		title: "Repository vulnerability alerts",
	},
	{
		id: "secret_scanning_alert_location",
		description: "Secrets scanning alert location created",
		title: "Secret scanning alert locations",
	},
	{
		id: "secret_scanning_alert",
		description: "Secrets scanning alert created, resolved, or reopened",
		title: "Secret scanning alerts",
	},
	{
		id: "security_and_analysis",
		description:
			"Code security and analysis features enabled or disabled for a repository.",
		title: "Security and analyses",
	},
	{
		id: "star",
		description: "A star is created or deleted from a repository.",
		title: "Stars",
	},
	{
		id: "status",
		description: "Commit status updated from the API.",
		title: "Statuses",
	},
	{
		id: "team_add",
		description: "Team added or modified on a repository.",
		title: "Team adds",
	},
	{
		id: "public",
		description: "Repository changes from private to public.",
		title: "Visibility changes",
	},
	{
		id: "watch",
		description: "User stars a repository.",
		title: "Watches",
	},
	{
		id: "gollum",
		description: "Wiki page updated.",
		title: "Wiki",
	},
	{
		id: "workflow_job",
		description:
			"Workflow job queued, waiting, in progress, or completed on a repository.",
		title: "Workflow jobs",
	},
	{
		id: "workflow_run",
		description: "Workflow run requested or completed on a repository.",
		title: "Workflow runs",
	},
];

export default supportedGithubWebhooks;
