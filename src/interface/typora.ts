/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description typora 涉及到的 interface
 * @version 0.7.3
 */

import { Config as ConfigBase } from "./index";

/**
 * @description 配置文件对应的 interface
 * @version 0.7.3
 * @interface Config
 * @property {string} name command 名称
 * @property {boolean} enable 是否启用
 * @property {string} path typora 路径
 * @return {Config} 配置文件对应的 interface
 */
export interface Config extends ConfigBase {
	name: string;
	enable: boolean;
	path: string;
}
