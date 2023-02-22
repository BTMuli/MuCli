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
 * @property {Label} label 模板
 * @return {Config} 配置文件对应的 interface
 */
export interface Config extends ConfigBase {
	name: string;
	enable: boolean;
	label: Label;
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
 * @description 单个模板对应的 interface
 * @version 0.7.3
 * @interface LabelSingle
 * @property {string} author 作者
 * @property {string} filename 文件名
 * @property {string} description 描述
 * @return {LabelSingle} 单个模板对应的 interface
 */
export interface LabelSingle {
	filename: string;
	author: string;
	description: string;
}

/**
 * @description 模板对应的 interface
 * @version 0.7.3
 * @interface Label
 * @property {LabelSingle} default 默认模板
 * @property {Array<LabelSingle>} custom 自定义模板
 * @return {Label} 模板对应的 interface
 */
export interface Label {
	default: LabelSingle;
	custom: Array<LabelSingle>;
}
