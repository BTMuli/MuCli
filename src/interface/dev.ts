/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description dev 涉及到的 interface
 * @version 0.2.1
 */

import { Config as ConfigBase } from "./index";

/**
 * @description 配置文件对应的 interface
 * @version 0.2.1
 * @interface Config
 * @property {string} name command 名称
 * @property {boolean} enable 是否启用
 * @return {Config} 配置文件对应的 interface
 */
export interface Config extends ConfigBase {
	name: string;
	enable: boolean;
}

/**
 * @description 获取文件路径对应的 interface
 * @version 0.2.1
 * @interface FilesPath
 * @property {string} cliPath cli 文件夹路径
 * @property {string} utilsPath utils 文件夹路径
 * @property {string} configPath config 文件夹路径
 * @return {FilesPath} 文件路径相关接口
 */
export interface FilesPath {
	cliPath: string;
	utilsPath: string;
	configPath: string;
}
