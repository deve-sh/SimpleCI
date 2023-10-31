import { Checkbox, HStack, Text, Box } from "@chakra-ui/react";

import supportedGithubWebhooks from "../../constants/github-webhooks";

interface Props {
	repoProvider: "github";
	hookEvents: string[];
	onSelect: (eventId: string) => void;
}

const webhooks = {
	github: supportedGithubWebhooks,
};

const WebHooksSelector = (props: Props) => {
	return (
		<HStack wrap="wrap">
			{webhooks[props.repoProvider].map((event) => (
				<Box width="47.5%" key={event.id} mb="2.5">
					<Checkbox
						colorScheme="green"
						value={event.id}
						isChecked={props.hookEvents?.includes?.(event.id)}
						onChange={() => props.onSelect(event.id)}
						display="flex"
						alignItems="flex-start"
					>
						<Box mt="-1">
							<Text fontWeight="500">{event.title}</Text>
							<Text fontWeight="400" fontSize="sm">
								{event.description}
							</Text>
						</Box>
					</Checkbox>
				</Box>
			))}
		</HStack>
	);
};

export default WebHooksSelector;
