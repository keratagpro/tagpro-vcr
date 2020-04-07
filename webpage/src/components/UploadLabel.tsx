import * as React from 'react';

interface Props {
	label?: string;
}

export default function UploadLabel({ label }: Props) {
	return (
		<label htmlFor="file" className="button">
			📤 {label || 'Upload recording'}
		</label>
	);
}
