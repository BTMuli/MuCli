// MuCli JS
import MucYaml from '../utils/yaml.js';
import MucConfig from '../config.js';

class Config {
	constructor(path = undefined) {
		if (path === undefined) {
			this.configPath =
				MucConfig.getPath() + '\\config_default\\config.yml';
			this.mucYaml = new MucYaml();
		} else {
			this.configPath = MucConfig.getPath() + path;
			this.mucYaml = new MucYaml(path);
		}
	}

	/**
	 * 读取配置文件
	 * @return {JSON}
	 */
	readConfig() {
		return this.mucYaml.yamlRead(this.configPath);
	}

	/**
	 * 读取子配置
	 * @param args 可变参数，所获取位置
	 * @return {*|JSON}
	 */
	readDetailConfig(...args) {
		var configRead = this.readConfig();
		configRead = this.mucYaml.yamlDetailRead(configRead, args);
		return configRead;
	}

	/**
	 * 读取并加载模块
	 * @param command Commander
	 * @param data 命令列表
	 */
	setConfig(command, ...data) {
		data.forEach(value => {
			if (this.checkConfig(value)) {
				command.addCommand(value);
			}
		});
	}

	/**
	 * 加载检验
	 * @param cmd 命令
	 * @return {boolean} 是否开启
	 */
	checkConfig(cmd) {
		var cmdConfig = this.readDetailConfig('Commands', cmd.name());
		return cmdConfig['enable'] === true;
	}

	/**
	 * 修改配置文件
	 * @param name
	 * @param target
	 */
	transConfig(name, target) {
		let commandPath = this.mucYaml.configPath;
		let commandList = ['all', 'mmd', 'tpl', 'ncm'];
		let targetList = ['on', 'off'];
		if (targetList.includes(target) && commandList.includes(name)) {
			if (name === 'all') {
				this.mucYaml.yamlChangeAsync(commandPath, 'mmd', 'enable', target === 'on');
				this.mucYaml.yamlChangeAsync(commandPath, 'tpl', 'enable', target === 'on');
				this.mucYaml.yamlChangeAsync(commandPath, 'ncm', 'enable', target === 'on');
			} else {
				this.mucYaml.yamlChangeAsync(commandPath, name, 'enable', target==='on');
			}
		} else {
			console.log('参数错误');
		}
	}
}

export default Config;
