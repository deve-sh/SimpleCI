import { useState, type ChangeEvent } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	FormControl,
	FormLabel,
	Input,
	useToast,
	type UseToastOptions,
	Select,
} from "@chakra-ui/react";

import type Repository from "../../types/Repository";
import WebHooksSelector from "./WebhooksSelector";
import runnerConfigurations from "../../constants/runner-configurations";

const defaultInitialInputs = {
	name: "",
	hookEvents: ["push"],
	runnerPreference: "standard" as (typeof runnerConfigurations)[number]["id"],
};

export interface ProjectCreationPopupProps {
	isOpen: boolean;
	close: () => void;
	creating?: boolean;
	initialInputs?: Partial<Repository> & { hookEvents?: string[] };
	repoProvider: "github";
	onSubmit: (inputs: typeof defaultInitialInputs) => unknown | Promise<unknown>;
}

const ProjectCreationPopup = (props: ProjectCreationPopupProps) => {
	const toast = useToast();

	const [inputs, setInputs] = useState({
		...defaultInitialInputs,
		...props.initialInputs,
	});

	const onWebhookEventSelected = (eventId: string) => {
		const currentHooks = inputs.hookEvents || [];
		if (currentHooks.includes(eventId))
			setInputs((inputs) => ({
				...inputs,
				hookEvents: currentHooks.filter((event) => event !== eventId),
			}));
		else
			setInputs((inputs) => ({
				...inputs,
				hookEvents: [...currentHooks, eventId],
			}));
	};

	const onSubmit = () => {
		const toastMessage = {
			title: "Incomplete inputs",
			status: "warning" as UseToastOptions["status"],
		};
		if (!inputs.name)
			return toast({
				...toastMessage,
				description: "Name not provided for project",
			});
		if (!inputs.hookEvents.length)
			return toast({
				...toastMessage,
				description: "No events for triggering CI/CD selected",
			});

		props.onSubmit?.({
			name: inputs.name,
			hookEvents: inputs.hookEvents,
			runnerPreference: inputs.runnerPreference,
		});
	};

	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
		setInputs({ ...inputs, [event.target.name]: event.target.value });

	return (
		<Modal size="3xl" isOpen={props.isOpen} onClose={props.close}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create Project</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl isRequired>
						<FormLabel>Project Name</FormLabel>
						<Input
							type="text"
							name="name"
							value={inputs.name}
							onChange={onChange}
						/>
					</FormControl>
					<br />
					<FormControl>
						<FormLabel>CI/CD Runner Size</FormLabel>
						<Select
							name="runnerPreference"
							value={inputs.runnerPreference}
							onChange={onChange}
						>
							{runnerConfigurations.map((config) => (
								<option value={config.id} key={config.id}>
									{config.name} - {config.description}. {config.price}
								</option>
							))}
						</Select>
					</FormControl>
					<br />
					<FormControl isRequired>
						<FormLabel mb="4">Run CI/CD On The Following Repo Events</FormLabel>
						<WebHooksSelector
							hookEvents={inputs.hookEvents}
							onSelect={onWebhookEventSelected}
							repoProvider={props.repoProvider}
						/>
					</FormControl>
				</ModalBody>

				<ModalFooter>
					<Button
						colorScheme="red"
						variant="ghost"
						mr={3}
						onClick={props.close}
						isLoading={props.creating}
					>
						Cancel
					</Button>
					<Button
						colorScheme="teal"
						isLoading={props.creating}
						onClick={onSubmit}
					>
						Create Project
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ProjectCreationPopup;
