import styled from 'styled-components';
import * as React from 'react';

const HiddenInput = styled.input`
	display: none !important;
`;

export function FileInput({ onChange }) {
	return <HiddenInput type="file" accept=".ndjson,.jsonl" onChange={onChange} />;
}
