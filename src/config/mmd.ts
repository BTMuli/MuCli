/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description markdown 文件相关操作
 * @version 0.7.3
 */

/* MuCli Base */
import ConfigBase from "../base/config";
/* MuCli Interface */
import { Config, Label } from "../interface/mmd";
import { Config as ConfigMuc } from "../interface/muc";

class ConfigMmd extends ConfigBase {
	label: Label;

	constructor() {
		super();
		const configMmd: Config = this.readConfig().mmd;
		this.label = configMmd.label;
	}

	/**
	 * @description 保存配置文件
	 * @param {Label} label 模板
	 * @return {void}
	 */
	saveMmdConfig(label: Label): void {
		let configData: ConfigMuc = this.readConfig();
		configData = this.changeConfig(configData, ["mmd", "label"], label);
		this.saveConfig(configData);
	}
}

export default ConfigMmd;
