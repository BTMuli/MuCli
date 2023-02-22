/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description pip 文件相关操作
 * @version 0.4.1
 */

/* MuCli Base */
import ConfigBase from "../base/config";
/* MuCli Interface */
import { Mirror, Config } from "../interface/pip";
import { Config as ConfigMuc } from "../interface/muc";

class ConfigPip extends ConfigBase {
	mirror: Mirror;

	constructor() {
		super();
		const config: Config = this.readConfig().pip;
		this.mirror = config.mirror;
	}

	/**
	 * @description 保存配置
	 * @param {Mirror} mirror 镜像源配置
	 * @return {void}
	 */
	saveMirrorConfig(mirror: Mirror): void {
		let configData: ConfigMuc = JSON.parse(
			JSON.stringify(this.readConfig())
		);
		configData = this.changeConfig(configData, ["pip", "mirror"], mirror);
		console.log(configData);
		this.saveConfig(configData);
	}
}

export default ConfigPip;
