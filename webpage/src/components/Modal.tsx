import React from 'react';

interface IModalProps {
	title: string,
	body: string,
	stateVar: boolean,
	closeHandler?: React.MouseEventHandler<HTMLButtonElement>,
	actionButton?: JSX.Element
}

export default class Modal extends React.Component<IModalProps> {
	public render() {
		const p = this.props;

		let closer: JSX.Element;
		let footer: JSX.Element;

		if (p.closeHandler) {
			closer = (
				<button className="btn btn-clear float-right close-modal" onClick={p.closeHandler}></button>
			);
		}

		if (p.actionButton) {
			footer = (
				<div className="modal-footer">
					{p.actionButton}
				</div>
			);
		}

		return (
			<div className={`modal modal-sm ${p.stateVar ? 'active' : ''}`}>
				<div className="modal-overlay"></div>
				<div className="modal-container">
					<div className="modal-header">
						{closer}
						<div className="modal-title"><b>{p.title}</b></div>
					</div>
					<div className="modal-body">
						<div className="content">
							<p>{p.body}</p>
						</div>
					</div>
					{footer}
				</div>
			</div>
		);
	}
}
