/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description pip 文件相关操作
 * @version 0.4.1
 */

/* MuCli Base */
import ConfigBase from "../base/config";
/* MuCli Interface */
import { Config, Mirror, MirrorSingle } from "../interface/pip";
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
	 * @param {Array<MirrorSingle>} mirror 镜像源列表
	 * @param {string} current 当前使用的镜像源
	 * @return {void}
	 */
	saveMirrorConfig(
		mirror: Array<MirrorSingle>,
		current: string = undefined
	): void {
		let configData: ConfigMuc = this.readConfig();
		if (current === undefined) {
			configData = this.changeConfig(
				configData,
				["pip", "mirror", "list"],
				mirror
			);
		} else {
			configData = this.changeConfig(
				configData,
				["pip", "mirror", "current"],
				current
			);
		}
		this.saveConfig(configData);
	}
}

export default ConfigPip;
