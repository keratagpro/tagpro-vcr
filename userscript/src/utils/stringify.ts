// Copied from https://stackoverflow.com/a/48254637

export function stringify(obj: any, isP: boolean = false) {
	const cache = new Set();

	return JSON.stringify(obj, function(key, value) {
		// Avoid incompatibility with the TagPro Player Monitor script
		if (isP && (key === 'monitor')) {
			return;
		}

		if (typeof value === 'object' && value !== null) {
			if (cache.has(value)) {
				// Circular reference found
				try {
					// If this value does not reference a parent it can be deduped
					return JSON.parse(JSON.stringify(value));
				}
				catch (err) {
					// discard key if value cannot be deduped
					return;
				}
			}
			// Store value in our set
			cache.add(value);
		}
		return value;
	});
}
