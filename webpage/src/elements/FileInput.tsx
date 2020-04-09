import * as React from 'react';
import styled from 'styled-components';

const HiddenInput = styled.input`
	display: none !important;
`;

export default function FileInput({ onChange }) {
	return <HiddenInput type="file" accept=".ndjson,.jsonl" onChange={onChange} />;
}
