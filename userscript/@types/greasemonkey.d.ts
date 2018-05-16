declare namespace GM {
	function getValue<T = any>(name: string, defaultValue?: T): Promise<T>;
	function setValue(name: string, value: any): Promise<void>;
	function deleteValue(name: string): Promise<void>;
	function listValues(): Promise<string[]>;
}
