/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令，负责处理 markdown 文件
 * @version 0.7.0
 */

/* Node */
import { Command } from "commander";
/* MuCli */
import Markdown from "../utils/markdown";
import { PROJECT_INFO } from "config";

/* 版本管理 */
const MmdVersion: string = PROJECT_INFO.subversion["mmd"];

const markdown: Command = new Command();

/* 基本信息 */
markdown
	.name("mmd")
	.description("A SubCommand within MuCli for Markdown")
	.version(
		MmdVersion,
		"-sv, --subversion",
		"output the subversion of MuCli-Markdown"
	);

/* 建立新的 markdown 文件 */
markdown
	.command("new")
	.option("-n, --name <name>", "the name of the new markdown file", "README")
	.description("create a markdown file")
	.action(options => {
		const md: Markdown = new Markdown();
		md.promptCreateFile(options.name);
	});

/* 更新 markdown 文件头信息 */
markdown
	.command("update")
	.option("-n, --name <name>", "the name of the markdown file", "README")
	.description("update the header of the markdown file")
	.action(async options => {
		const md: Markdown = new Markdown();
		await md.promptUpdateFile(options.name);
	});

/* Typora 相关 */
markdown
	.command("typora")
	/* 通过 Typora 打开 markdown 文件 */
	.option("-n, --name [name]", "the name of the markdown file")
	.description("open file with Typora")
	/* 获取 Typora 的路径 */
	.option("-i, --info", "get the path of Typora")
	.description("get local typora path")
	/* 设置 Typora 的路径 */
	.option("-s, --set [path]", "set the path of Typora")
	/* 测试 Typora 的配置 */
	.option("-t, --test", "test the config of Typora")
	.action(options => {
		const md: Markdown = new Markdown();
		if (options.info) {
			md.showTypora();
		} else if (options.set) {
			md.modifyTypora();
		} else if (options.name) {
			md.openTypora(options.name);
		} else if (options.test) {
			md.testTypora();
		} else {
			md.operaTypora();
		}
	});

/* markdown 模板相关 */
markdown
	.command("label")
	/* 获取模板列表 */
	.option("-l, --list", "get the list of markdown label")
	.description("get the list of markdown label")
	/* 获取模板 */
	.option("-g, --get <name>", "get the markdown label")
	.description("get the template")
	/* 删除模板 */
	.option("-d, --delete <name>", "delete the markdown label")
	.description("delete the template")
	/* 添加模板 */
	.option("-a, --add <name>", "add the markdown label")
	.description("add the template")
	.action(options => {
		const md: Markdown = new Markdown();
		if (options.list) {
			md.getLabel("all");
		} else if (options.get) {
			md.getLabel(options.get);
		} else if (options.delete) {
			md.delLabel(options.delete);
		} else if (options.add) {
			md.addLabel(options.add);
		}
	});

export default markdown;
