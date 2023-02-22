/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令 typora
 * @version 0.7.3
 */

/* Node */
import { Command } from "commander";
/* MuCli */
import Typora from "../utils/typora";
import { PROJECT_INFO } from "../index";

/* 版本管理 */
const TyporaVersion: string = PROJECT_INFO.subversion["typora"];

const typora: Command = new Command();

/* 基本信息 */
typora
	.name("typora")
	.description("A SubCommand within MuCli for Typora")
	.version(
		TyporaVersion,
		"-sv, --subversion",
		"output the subversion of MuCli-Typora"
	);

/* 初始化 Typora 的配置 */
typora
	.command("init")
	.description("init the config of Typora")
	.action(() => {
		const tp: Typora = new Typora();
		tp.initConfig();
	});

/* 打开文件 */
typora
	.command("open")
	.option("-n, --name [name]", "the name of the markdown file", "./")
	.description("open file with Typora")
	.action(options => {
		const tp: Typora = new Typora();
		tp.openFile(options.name);
	});

/* 获取 Typora 的配置信息 */
typora
	.command("info")
	.description("get local typora path")
	.action(() => {
		const tp: Typora = new Typora();
		tp.showConfig();
	});

/* 设置 Typora 的路径 */
typora
	.command("set")
	.option("-p, --path [path]", "set the path of Typora")
	.description("set the path of Typora")
	.action(options => {
		const tp: Typora = new Typora();
		tp.setPath(options.path);
		console.log("正在测试 Typora 的配置...");
		tp.testConfig();
	});

/* 测试 Typora 的配置 */
typora
	.command("test")
	.description("test the config of Typora")
	.action(() => {
		const tp: Typora = new Typora();
		tp.testConfig();
	});

export default typora;
