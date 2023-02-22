/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 处理根目录相关功能
 * @version 0.7.2
 */

/* Node */
import { dirname, join } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { PackageJson } from "./interface";

/* 项目根目录 */
export const ROOT_PATH: string = dirname(
	dirname(fileURLToPath(import.meta.url))
);
/* 项目包信息 */
export const PROJECT_INFO: PackageJson = JSON.parse(
	readFileSync(join(ROOT_PATH, "package.json")).toString()
);
