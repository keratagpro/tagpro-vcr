import * as React from 'react';
import styled from 'styled-components';

const HiddenInput = styled.input`
	display: none !important;
`;

interface Props {
	onChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileInput({ onChange }: Props) {
	return <HiddenInput type="file" accept=".ndjson,.jsonl" onChange={onChange} />;
}
