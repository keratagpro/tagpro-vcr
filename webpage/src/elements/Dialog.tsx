import * as React from 'react';
import styled from 'styled-components';

const StyledDialog = styled.dialog`
	--transition-duration: 300ms;

	width: 800px;
	display: block;
	visibility: hidden;
	transform: scale(0.01);
	border-radius: 5px;
	border: 2px solid black;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	top: 100px;

	transition: visibility var(--transition-duration) ease, transform var(--transition-duration) ease-in-out;
	transition-delay: var(--transition-duration), 0;

	&[open] {
		visibility: visible;
		transform: scale(1);
	}

	h2 {
		margin: 0;
	}
`;

interface Props {
	children?: React.ReactNode;
	open?: boolean;
	onClose?: (ev: Event | React.MouseEvent) => void;
}

const CloseIcon = styled.div`
	cursor: pointer;
	position: absolute;
	right: 0;
	top: 0;
	padding: 15px;
`;

export function Dialog({ children, open, onClose }: Props) {
	const dialogRef = React.useRef<HTMLDialogElement>();

	function handleClose(ev: Event | React.MouseEvent) {
		ev.preventDefault();
		onClose?.(ev);
	}

	React.useEffect(() => {
		dialogRef.current?.addEventListener('close', handleClose);

		return () => {
			dialogRef.current?.addEventListener('close', handleClose);
		};
	}, []);

	React.useEffect(() => {
		const dialog = dialogRef.current;

		if (open && !dialog.open) {
			dialog.showModal();
		} else if (!open && dialog.open) {
			dialog.close();
		}
	}, [open]);

	return (
		<StyledDialog ref={dialogRef} data-theme="light">
			<CloseIcon onClick={handleClose}>❌</CloseIcon>

			{children}
		</StyledDialog>
	);
}
