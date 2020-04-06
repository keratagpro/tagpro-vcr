import * as classnames from 'classnames';
import * as React from 'react';

interface IProps {
	hidden?: boolean;
	title?: string;
	onClose: () => void;
}

export const Modal: React.SFC<IProps> = function (props) {
	return (
		<div className={classnames('modal', { active: !props.hidden })}>
			<a href="#close" className="modal-overlay" onClick={props.onClose} />
			<div className="modal-container">
				<div className="modal-header">
					<a href="#close" className="btn btn-clear float-right" onClick={props.onClose} />
					<div className="modal-title h5">{props.title}</div>
				</div>
				<div className="modal-body">
					<div className="content">{props.children}</div>
				</div>
				<div className="modal-footer">
					<button className="btn" onClick={props.onClose}>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};
