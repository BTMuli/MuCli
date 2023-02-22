/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description  typora 相关操作
 * @version 0.7.3
 */

/* MuCli Base */
import ConfigBase from "../base/config";
/* MuCli Interface */
import { Config } from "../interface/typora";
import { Config as ConfigMuc } from "../interface/muc";

class ConfigTypora extends ConfigBase {
	typora: Config;

	constructor() {
		super();
		this.typora = this.readConfig().typora;
	}

	/**
	 * @description 保存配置文件
	 * @param {boolean} enable 是否启用
	 * @param {string} path typora 路径
	 * @return {void}
	 */
	saveTyporaConfig(enable: boolean, path: string): void {
		let configData: ConfigMuc = this.readConfig();
		configData = this.changeConfig(
			configData,
			["typora", "enable"],
			enable
		);
		configData = this.changeConfig(configData, ["typora", "path"], path);
		this.saveConfig(configData);
	}
}

export default ConfigTypora;
