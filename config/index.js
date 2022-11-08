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
	 * 读取并加载模块 todo 后续修改文件
	 * @param data 命令列表
	 */
	setConfig(...data) {
		var cmd_list = {};
		data.forEach(value => {
			let cmd_name = value.name();
			cmd_list[cmd_name] = this.doConfig(value);
		});
		this.cmdList = cmd_list;
	}

	/**
	 * 加载检验
	 * @param cmd 命令
	 * @return {boolean} 是否开启
	 */
	doConfig(cmd) {
		var cmdConfig = this.readDetailConfig('Commands', cmd.name());
		return cmdConfig['enable'] === true;
	}

	/**
	 * 修改 yml todo 待检验
	 * @param val  修改后的值
	 * @param key  修改项
	 * @param args 可选参数，位置
	 */
	transConfig(val, key, ...args) {
		this.mucYaml.yamlChange(this.configPath, args, key, val);
	}
}

export default Config;
