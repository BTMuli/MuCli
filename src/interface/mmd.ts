/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description mmd 涉及到的 interface
 * @version 0.7.3
 */

import { Config as ConfigBase } from "./index";

/**
 * @description 配置文件对应的 interface
 * @version 0.7.3
 * @interface Config
 * @property {boolean} enable 是否启用
 * @property {string} name command 名称
 * @property { default: Label; custom: Array<Label> } label markdown 模板
 * 		@property {Label} default 默认模板
 * 		@property {Array<Label>} custom 自定义模板
 * @property {TyporaConfig} typora typora 配置
 * @return {Config} 配置文件对应的 interface
 */
export interface Config extends ConfigBase {
	name: string;
	enable: boolean;
	label: {
		default: Label;
		custom: Array<Label>;
	};
	typora: TyporaConfig;
}

/**
 * @description 文件 FrontMatter 对应的 interface
 * @version 0.7.3
 * @interface FrontMatter
 * @property {JSON} header 头部信息
 * 		@property {string} author 作者
 * 		@property {string} date 日期
 * 		@property {string} description 描述
 * 		@property {string} update 更新日期
 * @property {JSON} quote 引用信息
 * 		@property {string} date 引用日期
 * 		@property {string} update 更新日期
 * @return {FrontMatter} 文件 FrontMatter 对应的 interface
 */
export interface FrontMatter {
	header: {
		author: string;
		date: string;
		description: string;
		update: string;
	};
	quote: {
		date: string;
		update: string;
	};
}

/**
 * @description typora 配置文件对应的 interface
 * @version 0.7.3
 * @interface TyporaConfig
 * @property {boolean} enable 是否启用
 * @property {string} path typora 配置文件路径
 * @return {TyporaConfig} typora 配置文件对应的 interface
 */
export interface TyporaConfig {
	enable: boolean;
	path: string;
}

/**
 * @description markdown 模板对应的 interface
 * @version 0.7.3
 * @interface Label
 * @property {string} author 作者
 * @property {string} filename 文件名
 * @property {string} description 描述
 * @return {Label} markdown 模板对应的 interface
 */
export interface Label {
	filename: string;
	author: string;
	description: string;
}
