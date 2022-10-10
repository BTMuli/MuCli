import path from 'path';
import {fileURLToPath} from 'node:url';

class MucConfig {
	static rootPath = path.dirname(fileURLToPath(import.meta.url));

	static getPath() {
		return this.rootPath;
	}
}

export default MucConfig;
