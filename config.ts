/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 处理根目录相关功能
 * @version 0.7.0
 */

/* Node */
import { dirname, join } from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { ProjPackageJson } from "./utils/interface";

/* 项目根目录 */
export const ROOT_PATH: string = dirname(fileURLToPath(import.meta.url));
/* 项目包信息 */
export const PROJECT_INFO: ProjPackageJson = JSON.parse(
	readFileSync(join(ROOT_PATH, "package.json")).toString()
);
