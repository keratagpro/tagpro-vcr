import * as React from 'react';
import styled from 'styled-components';

const StyledDialog = styled.dialog`
	--transition-duration: 300ms;

	width: 800px;
	display: block;
	visibility: hidden;
	transform: scale(0.01);
	transition: visibility var(--transition-duration) ease, transform var(--transition-duration) ease-in-out;
	transition-delay: var(--transition-duration), 0;

	&[open] {
		visibility: visible;
		transform: scale(1);
	}
`;

interface Props {
	children?: React.ReactNode;
	open?: boolean;
	onClose?: (ev: Event) => void;
}

export function Dialog({ children, open, onClose }: Props) {
	const dialogRef = React.useRef<HTMLDialogElement>();

	React.useEffect(() => {
		function handleClose(ev: Event) {
			ev.preventDefault();
			onClose?.(ev);
		}

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

	return <StyledDialog ref={dialogRef}>{children}</StyledDialog>;
}
