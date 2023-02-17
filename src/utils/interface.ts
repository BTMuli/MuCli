/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 涉及到的 interface
 * @version 0.7.1
 */

/**
 * @description Proj package.json 对应的 interface
 * @version 0.7.0
 * @interface ProjPackageJson
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
 * @return {ProjPackageJson} package.json 对应的 interface
 */
export interface ProjPackageJson {
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

/**
 * @description Dev 获取文件路径对应的 interface
 * @version 0.2.0
 * @interface DevFilesPath
 * @property {string} cliPath cli 文件夹路径
 * @property {string} utilsPath utils 文件夹路径
 * @property {string} configPath config 文件夹路径
 * @return {DevFilesPath} 文件路径相关接口
 */
export interface DevFilesPath {
	cliPath: string;
	utilsPath: string;
	configPath: string;
}

/**
 * @description Mmd 文件 FrontMatter 对应的 interface
 * @version 0.7.0
 * @interface MmdFrontMatter
 * @property {JSON} header 头部信息
 * 		@property {string} author 作者
 * 		@property {string} date 日期
 * 		@property {string} description 描述
 * 		@property {string} update 更新日期
 * @property {JSON} quote 引用信息
 * 		@property {string} date 引用日期
 * 		@property {string} update 更新日期
 * @return {MmdFrontMatter} Mmd 文件 FrontMatter 对应的 interface
 */
export interface MmdFrontMatter {
	header: {
		author: string;
		date: string;
		description: string;
		update: string;
	};
	quote: {
		date: string;
		update: string;
	};
}

/**
 * @description Mmd typora 配置文件对应的 interface
 * @version 0.7.0
 * @interface MmdTyporaConfig
 * @property {boolean} enable 是否启用
 * @property {string} path typora 配置文件路径
 * @return {MmdTyporaConfig} Mmd typora 配置文件对应的 interface
 */
export interface MmdTyporaConfig {
	enable: boolean;
	path: string;
}

/**
 * @description Mmd markdown 模板对应的 interface
 * @version 0.7.1
 * @interface MmdLabel
 * @property {string} author 作者
 * @property {string} filename 文件名
 * @property {string} description 描述
 * @return {MmdLabel} Mmd markdown 模板对应的 interface
 */
export interface MmdLabel {
	filename: string;
	author: string;
	description: string;
}

/**
 * @description Mmd 配置文件对应的 interface
 * @version 0.7.0
 * @interface MmdConfig
 * @property {boolean} enable 是否启用
 * @property {string} name command 名称
 * @property { default: MmdLabel; custom: Array<MmdLabel> } label markdown 模板
 * 		@property {MmdLabel} default 默认模板
 * 		@property {Array<MmdLabel>} custom 自定义模板
 * @property {MmdTyporaConfig} typora typora 配置
 * @return {MmdConfig} Mmd 配置文件对应的 interface
 */
export interface MmdConfig {
	enable: boolean;
	name: string;
	label: {
		default: MmdLabel;
		custom: Array<MmdLabel>;
	};
	typora: MmdTyporaConfig;
}

/**
 * @description Pip 镜像源对应的 interface
 * @version 0.4.0
 * @interface PipMirror
 * @property {string} name 镜像源名称
 * @property {string} url 镜像源地址
 * @property {boolean} usable 是否可用
 * @property {undefined | number} time 响应时间
 * @return {PipMirror} Pip 镜像源对应的 interface
 */
export interface PipMirror {
	name: string;
	url: string;
	usable: boolean;
	time: undefined | number;
}

/**
 * @description Pip 配置文件对应的 interface
 * @version 0.4.0
 * @interface PipConfig
 * @property {boolean} enable 是否启用
 * @property {string} name command 名称
 * @property {string} mirrorUse 镜像源使用
 * @property {Array<PipMirror>} mirrorList 镜像源列表
 * @return {PipConfig} Pip 配置文件对应的 interface
 */
export interface PipConfig {
	enable: boolean;
	name: string;
	mirrorUse: string;
	mirrorList: Array<PipMirror>;
}

/**
 * @description Muc 配置文件对应的 interface
 * @version 0.7.0
 * @interface MucConfig
 * @property dev dev 配置
 * 		@property {boolean} enable 是否启用
 * 		@property {string} name command 名称
 * @property {MmdConfig} mmd mmd 配置
 * @property {PipConfig} pip pip 配置
 * @return {MucConfig} Muc 配置文件对应的 interface
 */
export interface MucConfig {
	dev: {
		enable: boolean;
		name: string;
	};
	mmd: MmdConfig;
	pip: PipConfig;
}
