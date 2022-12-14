/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 配置相关
 * @update: 2022-12-14
 */

/* MuCli */
import MucYaml from '../utils/yaml.js';
import { ROOT_PATH } from '../config.js';
/* SubCommand */
import dev from '../cli/dev.js';
import markdown from '../cli/markdown.js';
import pip from '../cli/pip.js';
/* Project command list */
export let COMMAND_LIST = [dev, markdown, pip];

class Config {
	constructor(path = undefined) {
		if (path === undefined) {
			path = '\\config_default\\config.yml';
		}
		this.configPath = ROOT_PATH + path;
		this.mucYaml = new MucYaml(path);
	}
	/**
	 * @description 读取配置文件
	 * @return {JSON}
	 */
	readConfig() {
		return this.mucYaml.readYaml();
	}
	/**
	 * @description 读取子配置
	 * @param args 可变参数，所获取位置
	 * @return {*|JSON}
	 */
	readConfigDetail(args) {
		let configRead = this.readConfig();
		configRead = this.mucYaml.readYamlDetail(configRead, [args]);
		return configRead;
	}
	/**
	 * @description 读取并加载模块
	 * @param command Commander
	 */
	loadConfig(command) {
		COMMAND_LIST.forEach(value => {
			if (this.commandUse(value)) {
				command.addCommand(value);
			}
		});
	}
	/**
	 * @description 加载检验
	 * @param command 命令
	 * @return boolean 是否开启
	 */
	commandUse(command) {
		let cmdConfig = this.readConfigDetail(command.name());
		return cmdConfig['enable'];
	}
	/**
	 * @description 修改命令可用性
	 * @param name
	 * @param target
	 */
	transConfig(name, target) {
		let commandList = COMMAND_LIST.map(value => {
			return value.name();
		});
		let targetList = ['on', 'off'];
		if (
			targetList.includes(target) &&
			(commandList.includes(name) || name === 'all')
		) {
			if (name === 'all') {
				commandList.forEach(value => {
					this.changeConfig([value], 'enable', target === 'on');
				});
			} else {
				this.changeConfig([name], 'enable', target === 'on');
			}
		} else {
			console.log('参数错误');
		}
	}
	/**
	 * @description 修改配置文件
	 * @param name 命令
	 * @param target 目标
	 * @param value 值
	 */
	changeConfig(name, target, value) {
		const commandPath = this.mucYaml.configPath;
		this.mucYaml.changeYaml(commandPath, name, target, value);
	}
}

export default Config;
