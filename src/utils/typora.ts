/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description  typora 相关操作
 * @version 0.7.0
 */

/* Node */
import { platform } from "os";
import { prompt } from "inquirer";
import { exec, execFile } from "child_process";
import { resolve } from "path";
/* MuCli */
import Config from "../config/index";
import { MmdTyporaConfig } from "./interface";

class Typora {
	config: Config;
	enable: boolean;
	path: string;

	constructor(typora: MmdTyporaConfig) {
		this.config = new Config();
		this.enable = typora.enable;
		this.path = typora.path;
	}

	/**
	 * @description 获取配置文件
	 * @return {MmdTyporaConfig} 配置文件
	 */
	getConfig(): MmdTyporaConfig {
		return {
			enable: this.enable,
			path: this.path,
		};
	}

	/**
	 * @description 保存配置到配置文件
	 * @return {void}
	 */
	saveConfig(): void {
		const typoraInfo: MmdTyporaConfig = this.getConfig();
		this.config.changeConfig(["mmd"], "typora", typoraInfo);
	}

	/**
	 * @description 展示配置
	 * @return {void}
	 */
	showConfig(): void {
		console.table([
			{ system: platform() },
			{ enable: this.enable },
			{ path: this.path },
		]);
	}

	/**
	 * @description 修改配置
	 * @param enable {boolean} 是否启用
	 * @param path {string} typora 路径
	 * @return {void}
	 */
	changeConfig(enable: boolean, path: string = undefined): void {
		console.log("\n正在更新配置文件...");
		this.enable = enable;
		this.path = path === undefined ? this.path : path;
		this.saveConfig();
		console.log("\n更新配置文件成功！");
		this.showConfig();
	}

	/**
	 * @description 手动输入 typora 路径
	 * @return {void}
	 */
	manualTypora(): void {
		prompt([
			{
				type: "input",
				name: "path",
				message: "请输入 Typora 的路径",
			},
		]).then((answers: any) => {
			this.changeConfig(true, answers.path);
		});
	}

	/**
	 * @description 自动获取 typora 路径
	 * @return {void}
	 */
	findTypora(): void {
		const query =
			"REG QUERY 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Typora.exe'";
		exec(query, (error, stdout, stderr) => {
			if (error) {
				console.log("error:", error);
				return;
			}
			if (stderr) {
				console.log("stderr:", stderr);
				return;
			}
			// 如果没有找到 Typora
			if (stdout.indexOf("ERROR") !== -1) {
				prompt([
					{
						type: "confirm",
						name: "confirm",
						message: "未找到 Typora，是否手动输入 Typora 路径？",
						default: true,
					},
				]).then((answers: any) => {
					if (answers.confirm) {
						this.manualTypora();
					}
				});
			}
			// 如果找到 Typora
			const typoraPath: string = stdout.split("REG_SZ")[1].trim();
			prompt([
				{
					type: "confirm",
					name: "path",
					message:
						"检测到本地 Typora 路径与配置文件不一致，是否更新配置文件？\n" +
						`当前路径：${typoraPath}\n` +
						`配置文件路径：${this.path}`,
					default: true,
					when: () => typoraPath !== this.path,
				},
				{
					type: "confirm",
					name: "enable",
					message:
						"检测到本地 Typora 路径与配置文件一致，是否启用 Typora？\n" +
						`当前路径：${typoraPath}\n` +
						`配置文件路径：${this.path}`,
					default: true,
					when: () => typoraPath === this.path,
				},
			]).then((answers: any) => {
				if (answers.path) {
					this.changeConfig(true, typoraPath);
				}
				if (answers.enable) {
					this.changeConfig(true);
				}
			});
		});
	}

	/**
	 * @description 初始化配置
	 * @return {void}
	 */
	initConfig(): void {
		const system = platform();
		prompt([
			{
				type: "list",
				name: "typora",
				message: "请选择你的 Typora 配置情况",
				choices: [
					{
						name: "非 Windows 系统，未安装 Typora",
						value: "none",
					},
					{
						name: "非 Windows 系统，已安装 Typora",
						value: "notWindows",
					},
					{
						name: "Windows 系统，未安装 Typora",
						value: "notInstall",
					},
					{
						name: "Windows 系统，已安装 Typora",
						value: "windows",
					},
				],
				default: system === "win32" ? "notInstall" : "notWindows",
			},
		]).then(answersF => {
			switch (answersF.typora) {
				case "none":
					// 非 Windows 系统，未安装 Typora
					this.changeConfig(false, "");
					break;
				case "notWindows":
					// 非 Windows 系统，已安装 Typora
					prompt([
						{
							type: "confirm",
							name: "check",
							message:
								"本命令行工具不支持非 windows 系统下的 Typora,但是你可以手动配置 Typora 的路径,是否手动配置?",
							default: false,
						},
					]).then(answersS => {
						if (answersS.check) {
							this.manualTypora();
						}
					});
					break;
				case "notInstall":
					// Windows 系统，未安装 Typora
					prompt([
						{
							type: "confirm",
							name: "check",
							message:
								"本命令行建议使用 Typora 编辑器,是否安装 Typora?",
							default: false,
						},
					]).then(answersS => {
						if (answersS.check) {
							console.log(
								"请手动安装 Typora，官网地址：https://typora.io/"
							);
							console.log("安装完成后，重新运行本命令行工具");
						} else {
							this.changeConfig(false, "");
						}
					});
					break;
				case "windows":
					// Windows 系统，已安装 Typora
					prompt([
						{
							type: "confirm",
							name: "check",
							message:
								"本命令行建议使用 Typora 编辑器,是否使用 Typora?",
							default: true,
						},
					]).then(answersS => {
						if (answersS.check) {
							this.findTypora();
						}
					});
					break;
				default:
					break;
			}
		});
	}

	/**
	 * @description 检测配置是否正确
	 * @return {void}
	 */
	verifyConfig(): void {
		const system = platform();
		this.showConfig();
		if (system === "win32" && this.enable === false) {
			prompt([
				{
					type: "confirm",
					name: "enable",
					message: "检测到当前系统为 Windows，是否启用 Typora？",
					default: true,
				},
			]).then(answers => {
				if (answers.enable) {
					this.findTypora();
				}
			});
		} else if (system !== "win32" && this.enable === true) {
			prompt([
				{
					type: "confirm",
					name: "enable",
					message:
						"检测到当前系统非 Windows，建议关闭 Typora 配置,是否更新配置文件？",
					default: true,
				},
			]).then(answers => {
				if (answers.enable) {
					this.changeConfig(false);
				}
			});
		} else {
			console.log("\n当前配置正确\n");
		}
	}

	/**
	 * @description 通过 typora 打开文件
	 * @param fileName {string} 文件名
	 * @return {void}
	 */
	openFile(fileName: string): void {
		if (this.enable) {
			const filePath = resolve() + "\\" + fileName;
			execFile(this.path, [filePath], (error, stdout, stderr) => {
				if (error) {
					console.error(`执行的错误: ${error}`);
					return;
				}
				console.log(`stdout: ${stdout}`);
				console.log(`stderr: ${stderr}`);
			});
		} else {
			prompt([
				{
					type: "confirm",
					name: "enable",
					message: "未启用 Typora，是否启用？",
					default: true,
				},
			]).then(answers => {
				if (answers.enable) {
					this.verifyConfig();
				}
			});
		}
	}
}

export default Typora;
