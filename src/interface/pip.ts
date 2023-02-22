/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description dev 涉及到的 interface
 * @version 0.2.1
 */

import { Config as ConfigBase } from "./index";

/**
 * @description 配置文件对应的 interface
 * @version 0.4.1
 * @interface Config
 * @property {boolean} enable 是否启用
 * @property {string} name command 名称
 * @property {string} mirrorUse 镜像源使用
 * @property {Array<Mirror>} mirrorList 镜像源列表
 * @return {Config} 配置文件对应的 interface
 */
export interface Config extends ConfigBase {
	enable: boolean;
	name: string;
	mirrorUse: string;
	mirrorList: Array<Mirror>;
}

/**
 * @description 镜像源对应的 interface
 * @version 0.4.1
 * @interface Mirror
 * @property {string} name 镜像源名称
 * @property {string} url 镜像源地址
 * @property {boolean} usable 是否可用
 * @property {undefined | number} time 响应时间
 * @return {Mirror} 镜像源对应的 interface
 */
export interface Mirror {
	name: string;
	url: string;
	usable: boolean;
	time: undefined | number;
}
