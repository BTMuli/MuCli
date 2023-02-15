/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 处理根目录相关的一些小功能
 * @update: 2022-12-06
 */

/* Node */
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

/* Project Root Path */
export const ROOT_PATH = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
/* Project Package Info */
export const PROJECT_INFO = JSON.parse(
	await fs.readFileSync(path.join(ROOT_PATH, 'package.json'))
);
