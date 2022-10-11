//
// Declared as a module, e.g. `import tagproConfig from 'tagproConfig';`
//
declare module 'tagproConfig' {
	var tagproConfig: TagProConfig;
	export default tagproConfig;
}

//
// Declared as a variable on window, i.e. `window.tagproConfig`
//
declare interface Window {
	tagproConfig: TagProConfig;
}

declare class TagProConfig {
	serverPort: number;
	serverHost: string;
	cookieHost: string;
}
