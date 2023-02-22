#!/usr/bin/env node

/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 项目入口文件
 * @version 0.7.2
 */

/* MuCli */
import MuCli from "./cli/index";
import ConfigMuc from "./config/index";

const muc: ConfigMuc = new ConfigMuc();

try {
	/* 加载配置文件 */
	muc.loadConfig(MuCli);
	/* 解析命令行参数 */
	MuCli.parse(process.argv);
} catch (error) {
	console.log("配置文件加载失败！");
	/* 加载备份配置文件 */
	muc.loadBackupConfig();
}
