// Node JS
import YAML from 'yamljs';
// MuCli JS
import MucFile from './file.js';
import MucConfig from '../config.js';

class MucYaml {
	constructor(path = undefined) {
		if (path === undefined) {
			this.configPath =
				MucConfig.getPath() + '\\config_default\\config.yml';
		} else {
			this.configPath = MucConfig.getPath() + path;
		}
		this.mucFile = new MucFile();
	}

	/**
	 * 读取 yaml 文件
	 * @param path 文件路径
	 * @return {*}
	 */
	yamlRead(path) {
		return YAML.load(path);
	}

	/**
	 * 读取具体配置
	 * @param data yaml 文件内容
	 * @param args 配置位置
	 * @return {*} 配置内容
	 */
	yamlDetailRead(data, args) {
		var yamlRead = data;
		args.forEach(value => {
			yamlRead = yamlRead[value];
		});
		return yamlRead;
	}

	/**
	 * 修改 yaml 文件某属性值 todo 待检验
	 * @param path yaml 文件路径
	 * @param args 要修改属性位置
	 * @param key  要修改属性名称
	 * @param val  要修改属性值
	 */
	yamlChange(path, args, key, val) {
		var yamlOri = this.yamlRead(path);
		yamlOri[args][key] = val;
		this.mucFile.change(path, yamlOri);
	}
}

export default MucYaml;
