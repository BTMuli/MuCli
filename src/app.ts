#!/usr/bin/env node

/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 项目入口文件
 * @version 0.7.2
 */

/* MuCli */
import MuCli from "./cli/index";
import Config from "./config/index";

/* 加载配置文件 */
new Config().loadConfig(MuCli);

/* 解析命令行参数 */
MuCli.parse(process.argv);