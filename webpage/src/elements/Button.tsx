import styled, { css } from 'styled-components';

export const buttonStyles = css`
	color: var(--form-text);
	background-color: var(--background);

	font-family: inherit;
	font-size: inherit;

	margin-right: 6px;
	margin-bottom: 6px;
	padding: 10px;

	border: none;
	border-radius: 6px;
	outline: none;

	-webkit-appearance: none;

	transition: background-color var(--animation-duration) linear, border-color var(--animation-duration) linear,
		color var(--animation-duration) linear, box-shadow var(--animation-duration) linear,
		transform var(--animation-duration) ease;

	cursor: pointer;

	padding-right: 30px;
	padding-left: 30px;

	&:hover {
		background: var(--button-hover);
	}

	&:focus {
		box-shadow: 0 0 0 2px var(--focus);
	}

	&:active {
		transform: translateY(2px);
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
`;

export const Button = styled.div`
	${buttonStyles};
`;
