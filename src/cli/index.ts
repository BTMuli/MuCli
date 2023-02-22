/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 主命令文件
 * @version 0.7.2
 */

/* Node */
import { Command } from "commander";
import { exec } from "child_process";
import axios from "axios";
import inquirer from "inquirer";
/* MuCli */
import { PROJECT_INFO, ROOT_PATH } from "../index";
import ConfigMuc, { COMMAND_LIST } from "../config/index";

/* 版本管理 */
const MuCliVersion: string = PROJECT_INFO.version;

const MuCli: Command = new Command();

/* 基本信息 */
MuCli.name("muc")
	.version(MuCliVersion, "-v, --version")
	.description("A Node Cli for Personal Use by BTMUli.");

/* 查看子命令信息 */
MuCli.option("-l, --list", "list all commands").action(options => {
	if (options.list) {
		const muc: ConfigMuc = new ConfigMuc();
		const commandList = [];
		commandList["muc"] = {
			version: MuCliVersion,
			enable: true,
			description: MuCli.description(),
		};
		COMMAND_LIST.forEach(command => {
			commandList[command.name()] = {
				version: PROJECT_INFO.subversion[command.name()],
				enable: muc.commandUse(command),
				description: command.description(),
			};
		});
		console.table(commandList);
	} else {
		MuCli.help();
	}
});

/* 选用/弃用子命令 */
MuCli.command("set")
	.option("-n, --name <name>", "see and set [name]", "all")
	.option("-t, --target <status>", "set [target] to [status]", "on")
	.description("change subcommand use status")
	.action(async options => {
		const muc: ConfigMuc = new ConfigMuc();
		/* 更新配置 */
		await muc.transConfig(options.name, options.target);
		/* 读取配置 */
		muc.loadConfig(MuCli);
	});

/* 读取上游更新 */
MuCli.command("update")
	.description("update muc from upstream")
	.action(() => {
		console.log(`\n当前版本：${MuCliVersion}`);
		console.log(`正在检查更新...`);
		axios.get("https://registry.npmjs.org/@btmuli/mucli").then(res => {
			const upStreamVersion: string = res.data["dist-tags"].latest;
			console.log(`上游版本：${upStreamVersion}`);
			// 比较版本号
			if (MuCliVersion < upStreamVersion) {
				inquirer
					.prompt([
						{
							type: "confirm",
							name: "update",
							message: "是否更新？",
							default: true,
						},
					])
					.then(async answer => {
						if (answer.update) {
							await exec(
								"npm i -g @btmuli/mucli",
								(err, stdout, stderr) => {
									if (err) {
										console.log(err);
										return;
									}
									if (stderr) {
										console.log(stderr);
										return;
									}
									console.log(stdout);
								}
							);
						} else {
							console.log(`已取消更新`);
						}
					});
			} else {
				console.log(`已是最新版本`);
			}
		});
	});

/* 编译 ts 文件 */
MuCli.command("build")
	.description("build ts file")
	.action(() => {
		// 获取当前目录
		exec(`cd ${ROOT_PATH} && rollup -c`, (err, stdout, stderr) => {
			if (err) {
				console.log(err);
				return;
			}
			if (stderr) {
				console.log(stderr);
				return;
			}
			console.log(stdout);
		});
	});

/* 配置备份 */
MuCli.command("backup")
	.description("backup config file")
	.action(() => {
		const muc: ConfigMuc = new ConfigMuc();
		inquirer
			.prompt([
				{
					type: "confirm",
					name: "backup",
					message: "是否备份配置文件？（文件将备份到 backup.yml )",
					default: true,
				},
			])
			.then(answer => {
				if (answer.backup) {
					muc.backupConfig();
					console.log(`已备份配置文件`);
				} else {
					console.log(`已取消备份`);
				}
			});
	});

export default MuCli;
