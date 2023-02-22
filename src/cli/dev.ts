/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令 dev
 * @description 创建子命令相关
 * @version 0.2.1
 */

/* Node */
import { Command } from "commander";
/* MuCli */
import Dev from "../utils/dev";
import { PROJECT_INFO } from "../index";

/* 版本管理 */
const DevVersion: string = PROJECT_INFO.subversion["dev"];

const dev: Command = new Command();

/* 基本信息 */
dev.name("dev")
	.description("A SubCommand within MuCli for SubCommand")
	.version(
		DevVersion,
		"-sv, --subversion",
		"output the subversion of MuCli-Dev"
	);

/* 创建子命令 */
dev.command("new")
	.option("-c, --command [command]", "create a new command", "test")
	.action(options => {
		const muc: Dev = new Dev();
		muc.createNew(options.command);
	});

/* 更新命令版本 */
dev.command("update")
	.description("update the version of a command")
	.action(() => {
		const muc: Dev = new Dev();
		muc.updateVersion();
	});

export default dev;
