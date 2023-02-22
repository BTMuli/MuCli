/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 项目涉及到的 interface
 * @version 0.7.2
 */

/**
 * @description 配置文件对应的 interface
 * @version 0.7.2
 * @interface Config
 * @property {string} name command 名称
 * @property {boolean} enable 是否启用
 * @return {Config} 配置文件对应的 interface
 */
export interface Config {
	name: string;
	enable: boolean;
}

/**
 * @description package.json 对应的 interface
 * @version 0.7.2
 * @interface PackageJson
 * @property {string} name 项目名称
 * @property {string} version 版本号
 * @property {JSON} subversion 子版本号
 * @property {string} description 项目描述
 * @property {string} type 项目类型
 * @property {string} main 入口文件
 * @property {JSON} scripts 脚本
 * @property {JSON} bin 可执行文件
 * @property {Array<string>} keywords 关键字
 * @property {string} author 作者
 * @property {string} license 许可证
 * @property {string} repository 仓库地址
 * @property {string} bugs bug 地址
 * @property {string} homepage 主页地址
 * @property {JSON} dependencies 依赖
 * @property {JSON} devDependencies 开发依赖
 * @return {PackageJson} package.json 对应的 interface
 */
export interface PackageJson {
	name: string;
	version: string;
	subversion: JSON;
	description: string;
	type: string;
	main: string;
	scripts: JSON;
	bin: JSON;
	keywords: Array<string>;
	author: string;
	license: string;
	repository: string;
	bugs: string;
	homepage: string;
	dependencies: JSON;
	devDependencies: JSON;
}
