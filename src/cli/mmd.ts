/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令，负责处理 markdown 文件
 * @version 0.7.3
 */

/* Node */
import { Command } from "commander";
/* MuCli */
import Mmd from "../utils/mmd";
import { PROJECT_INFO } from "../index";

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
		const md: Mmd = new Mmd();
		md.promptCreateFile(options.name);
	});

/* 更新 markdown 文件头信息 */
markdown
	.command("update")
	.option("-n, --name <name>", "the name of the markdown file", "README.md")
	.description("update the header of the markdown file")
	.action(async options => {
		const md: Mmd = new Mmd();
		await md.promptUpdateFile(options.name);
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
		const md: Mmd = new Mmd();
		if (options.list) {
			md.getLabel("all");
		} else if (options.get) {
			md.getLabel(options.get);
		} else if (options.delete) {
			md.delLabel(options.delete);
		} else if (options.add) {
			md.addLabel(options.add);
		} else {
			md.operaLabel();
		}
	});

export default markdown;
