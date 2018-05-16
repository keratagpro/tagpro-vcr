export function equals(arr1, arr2) {
	return JSON.stringify(arr1) === JSON.stringify(arr2);
}

export function dateFromName(name: string) {
	return new Date(parseInt(name.replace('recording-', ''), 10));
}
