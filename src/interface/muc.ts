/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description muc 涉及到的 interface
 * @version 0.7.2
 */

import { Config as ConfigDev } from "./dev";
import { Config as ConfigMmd } from "./mmd";
import { Config as ConfigPip } from "./pip";
import { Config as ConfigTypora } from "./typora";

/**
 * @description 配置文件对应的 interface
 * @version 0.7.2
 * @interface Config
 * @property {ConfigDev} dev dev 配置
 * @property {ConfigMmd} mmd mmd 配置
 * @property {ConfigPip} pip pip 配置
 * @property {ConfigTypora} typora typora 配置
 * @return {Config} Muc 配置文件对应的 interface
 */
export interface Config {
	dev: ConfigDev;
	mmd: ConfigMmd;
	pip: ConfigPip;
	typora: ConfigTypora;
}
