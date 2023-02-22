/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description  typora 相关操作
 * @version 0.7.3
 */

/* Node */
import { platform } from "os";
import inquirer from "inquirer";
import { exec, execFile } from "child_process";
import { resolve } from "path";
/* MuCli Base */
import ConfigTypora from "../config/typora";

class Typora {
	system: string;
	config: ConfigTypora;

	constructor() {
		this.config = new ConfigTypora();
		this.system = platform();
	}

	/**
	 * @description 展示配置
	 * @return {void}
	 */
	showConfig(): void {
		console.log("当前配置：");
		console.table([
			{
				system: this.system,
				enable: this.config.typora.enable,
				path: this.config.typora.path,
			},
		]);
	}

	/**
	 * @description 设置 typora 路径
	 * @param {string} path typora 路径
	 * @todo 需要经过测试
	 * @return {void}
	 */
	setPath(path: string = undefined): void {
		this.showConfig();
		inquirer
			.prompt([
				{
					type: "input",
					name: "path",
					message: "请输入 Typora 的路径",
					default: path || this.config.typora.path,
				},
			])
			.then(answers => {
				console.log("所输入的路径为：", answers.path);
				console.log("尝试打开 Typora...");
				execFile(answers.path, (error, stdout, stderr) => {
					if (error) {
						console.log("error:", error);
						console.log("打开 Typora 失败！");
						return;
					}
					if (stderr) {
						console.log("stderr:", stderr);
						console.log("打开 Typora 失败！");
						return;
					}
					console.log("stdout:", stdout);
					console.log("打开 Typora 成功！");
					console.log("保存配置文件...");
					this.config.saveTyporaConfig(true, answers.path);
					console.log("保存配置文件成功！");
				});
				this.showConfig();
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
				inquirer
					.prompt([
						{
							type: "confirm",
							name: "confirm",
							message:
								"未找到 Typora，是否手动输入 Typora 路径？",
							default: true,
						},
					])
					.then(answers => {
						if (answers.confirm) {
							this.setPath();
						}
					});
			}
			// 如果找到 Typora
			const typoraPath: string = stdout.split("REG_SZ")[1].trim();
			inquirer
				.prompt([
					{
						type: "confirm",
						name: "path",
						message:
							"检测到本地 Typora 路径与配置文件不一致，是否更新配置文件？\n" +
							`当前路径：${typoraPath}\n` +
							`配置文件路径：${this.config.typora.path}`,
						default: true,
						when: () => typoraPath !== this.config.typora.path,
					},
					{
						type: "confirm",
						name: "enable",
						message:
							"检测到本地 Typora 路径与配置文件一致，是否启用 Typora？\n" +
							`当前路径：${typoraPath}\n` +
							`配置文件路径：${this.config.typora.path}`,
						default: true,
						when: () => typoraPath === this.config.typora.path,
					},
				])
				.then(answers => {
					if (answers.path) {
						console.log("保存配置文件...");
						this.config.saveTyporaConfig(true, typoraPath);
						console.log("保存配置文件成功！");
						console.log(
							"请使用 muc typora test 检查配置是否正确。"
						);
					}
					if (answers.enable) {
						console.log("保存配置文件...");
						this.config.saveTyporaConfig(true, "");
						console.log("保存配置文件成功！");
						console.log(
							"请使用 muc typora test 检查配置是否正确。"
						);
					}
				});
		});
	}

	/**
	 * @description 初始化配置
	 * @return {void}
	 */
	initConfig(): void {
		inquirer
			.prompt([
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
					default:
						this.system === "win32" ? "notInstall" : "notWindows",
				},
			])
			.then(answersF => {
				switch (answersF.typora) {
					case "none":
						// 非 Windows 系统，未安装 Typora
						this.config.saveTyporaConfig(false, "");
						break;
					case "notWindows":
						// 非 Windows 系统，已安装 Typora
						inquirer
							.prompt([
								{
									type: "confirm",
									name: "check",
									message:
										"本命令行工具不支持非 windows 系统下的 Typora,但是你可以手动配置 Typora 的路径,是否手动配置?",
									default: false,
								},
							])
							.then(answersS => {
								if (answersS.check) {
									this.setPath();
								}
							});
						break;
					case "notInstall":
						// Windows 系统，未安装 Typora
						inquirer
							.prompt([
								{
									type: "confirm",
									name: "check",
									message:
										"本命令行建议使用 Typora 编辑器,是否安装 Typora?",
									default: false,
								},
							])
							.then(answersS => {
								if (answersS.check) {
									console.log(
										"请手动安装 Typora，官网地址：https://typora.io/"
									);
									console.log(
										"安装完成后，重新运行本命令行工具"
									);
								} else {
									this.config.saveTyporaConfig(false, "");
								}
							});
						break;
					case "windows":
						// Windows 系统，已安装 Typora
						inquirer
							.prompt([
								{
									type: "confirm",
									name: "check",
									message:
										"本命令行建议使用 Typora 编辑器,是否使用 Typora?",
									default: true,
								},
							])
							.then(answersS => {
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
	testConfig(): void {
		this.showConfig();
		if (this.system === "win32" && this.config.typora.enable === false) {
			inquirer
				.prompt([
					{
						type: "confirm",
						name: "enable",
						message: "检测到当前系统为 Windows，是否启用 Typora？",
						default: true,
					},
				])
				.then(answers => {
					if (answers.enable) {
						this.findTypora();
					}
				});
		} else if (
			this.system !== "win32" &&
			this.config.typora.enable === true
		) {
			inquirer
				.prompt([
					{
						type: "confirm",
						name: "enable",
						message:
							"检测到当前系统非 Windows，建议关闭 Typora 配置,是否更新配置文件？",
						default: true,
					},
				])
				.then(answers => {
					if (answers.enable) {
						this.config.saveTyporaConfig(false, "");
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
		if (this.config.typora.enable) {
			const filePath = resolve() + "\\" + fileName;
			execFile(
				this.config.typora.path,
				[filePath],
				(error, stdout, stderr) => {
					if (error) {
						console.error(`执行的错误: ${error}`);
						return;
					}
					console.log(`stdout: ${stdout}`);
					console.log(`stderr: ${stderr}`);
				}
			);
		} else {
			inquirer
				.prompt([
					{
						type: "confirm",
						name: "enable",
						message: "未启用 Typora，是否启用？",
						default: true,
					},
				])
				.then(answers => {
					if (answers.enable) {
						this.testConfig();
					}
				});
		}
	}
}

export default Typora;
