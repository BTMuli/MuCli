/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 项目入口文件
 * @version 0.7.0
 */

/* MuCli */
import MuCli from "./cli";
import Config from "./config/index";

/* 加载配置文件 */
new Config().loadConfig(MuCli);

/* 解析命令行参数 */
MuCli.parse(process.argv);
