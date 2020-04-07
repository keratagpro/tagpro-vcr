import * as React from 'react';

export default function FileInput({ onChange }) {
	return <input id="file" type="file" accept=".ndjson,.jsonl" onChange={onChange} />;
}
