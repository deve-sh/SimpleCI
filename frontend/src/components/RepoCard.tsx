import type { MouseEvent } from "react";
import { Tooltip } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import styled from "@emotion/styled";

const RepoCardWrapper = styled.a`
	display: flex;
	flex-direction: column;
	padding: 1rem;
	border-radius: 0.25rem;
	min-height: 2.5rem;
	width: 18%;
	border: 0.0125rem solid #efefef;

	@media (max-width: 960px) {
		width: 31.5%;
	}

	@media (max-width: 768px) {
		width: 48%;
	}

	@media (max-width: 480px) {
		width: 100%;
	}
`;

const RepoCardTopWrapper = styled.div`
	display: flex;
	gap: 0.75rem;
	align-items: center;
`;

const RepoCardIcon = styled.div``;

const RepoCardTitle = styled.div`
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
`;

interface Props {
	provider: "github";
	title: string;
	description: string;
	link: string;
	onClick?: () => void;
}

const RepoCard = (props: Props) => {
	const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
		if (event.ctrlKey) return event.stopPropagation();
		else {
			event.preventDefault();
			props.onClick?.();
		}
	};
	return (
		<Tooltip label={props.title}>
			<RepoCardWrapper href={props.link} target="_blank" onClick={onClick}>
				<RepoCardTopWrapper>
					<RepoCardIcon>
						{props.provider === "github" ? (
							<FaGithub style={{ fontSize: "1.5rem" }} />
						) : (
							""
						)}
					</RepoCardIcon>
					<RepoCardTitle>{props.title}</RepoCardTitle>
				</RepoCardTopWrapper>
			</RepoCardWrapper>
		</Tooltip>
	);
};

export default RepoCard;
