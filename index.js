#!/usr/bin/env node

/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 启动文件
 * @update: 2022-12-06
 */

/* MuCli */
import MuCli from './cli/index.js';
import { COMMAND_LIST } from './config.js';
import Config from './config/index.js';

/* 加载配置文件 */
new Config().loadConfig(MuCli, COMMAND_LIST);

/* 解析命令行参数 */
MuCli.parse(process.argv);
