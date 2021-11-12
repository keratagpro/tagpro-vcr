import classnames from 'classnames';
import React from 'react';

interface IModalProps {
	title: string,
	body: string | JSX.Element,
	large? : boolean,
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

		const body = typeof (p.body) === 'string' ? <p>{p.body}</p> : p.body;

		const classes = classnames('modal', {
			'modal-lg': p.large,
			'modal-sm': !p.large,
			'active': p.stateVar
		});

		return (
			<div className={classes}>
				<div className="modal-overlay"></div>
				<div className="modal-container">
					<div className="modal-header">
						{closer}
						<div className="modal-title"><b>{p.title}</b></div>
					</div>
					<div className="modal-body">
						<div className="content">
							{body}
						</div>
					</div>
					{footer}
				</div>
			</div>
		);
	}
}
