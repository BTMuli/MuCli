/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description pip 镜像相关操作
 * @version 0.4.2
 */

/* Node */
import { exec } from "child_process";
import inquirer from "inquirer";
/* MuCli Base */
import { ModelPip } from "../model/pip";
import ConfigPip from "../config/pip";
/* MuCli Interface */
import { MirrorSingle } from "../interface/pip";

class Pip {
	config: ConfigPip;
	mirrorInfo: ModelPip;

	constructor() {
		this.config = new ConfigPip();
		this.mirrorInfo = new ModelPip(this.config.mirror);
	}

	/**
	 * @description 安装 pip 包
	 * @param {JSON} args 命令参数
	 * @param {string} args.package 包名
	 * @param {string} args.requirement requirements.txt 文件路径
	 * @return {void}
	 */
	install(args: {
		package: undefined | string;
		requirement: undefined | string;
	}): void {
		const mirrorUse = this.mirrorInfo.getMirrorUse();
		const url = mirrorUse.url;
		let command = "";
		let venv: string = process.env.VIRTUAL_ENV;
		if (venv !== undefined) {
			venv = venv + "\\Scripts\\pip.exe";
		} else {
			venv = "pip";
		}
		if (args.package !== undefined) {
			command = `${venv} install ${args.package} -i ${url}`;
		} else if (args.requirement !== undefined) {
			// 默认 -r 参数为 requirements.txt 文件路径
			if (typeof args.requirement !== "string") {
				command = `${venv} install -r requirements.txt -i ${url}`;
			} else {
				command = `${venv} install -r ${args.requirement} -i ${url}`;
			}
		}
		if (command !== "") {
			console.log(`执行命令：${command}`);
			exec(command, (error, stdout, stderr) => {
				if (error) {
					console.log(error);
					return;
				}
				console.log(stdout);
				if (stderr) {
					console.log(stderr);
				}
			});
		} else {
			console.log("请输入 -p 或 -r 参数！");
		}
	}

	/**
	 * @description 查看镜像
	 * @return {void}
	 */
	showMirror(): void {
		this.mirrorInfo.outputMirrorList();
	}

	/**
	 * @description 添加镜像
	 * @param {string} mirrorName 镜像源名称
	 * @return {Promise<void>}
	 */
	async addMirror(mirrorName: string): Promise<void> {
		const mirrorGet = this.mirrorInfo.mirrorExist(mirrorName);
		if (mirrorGet === false) {
			const mirror = await inquirer.prompt([
				{
					type: "input",
					name: "name",
					message: "请输入镜像源名称：",
					default: mirrorName,
				},
				{
					type: "input",
					name: "url",
					message: "请输入镜像源地址：",
				},
			]);
			await this.mirrorInfo.addMirror(mirror.name, mirror.url);
			console.log(`正在将 ${mirror.name} 写入配置文件...`);
			this.config.saveMirrorConfig(this.mirrorInfo.getConfig());
			console.log(`镜像源 ${mirror.name} 添加成功！`);
		} else {
			console.log(`镜像源 ${mirrorName} 已存在！`);
		}
	}

	/**
	 * @description 删除镜像
	 * @param {string} mirrorName 镜像源名称
	 * @return {Promise<void>}
	 */
	async deleteMirror(mirrorName: string): Promise<void> {
		if (this.mirrorInfo.mirrorExist(mirrorName)) {
			inquirer
				.prompt([
					{
						type: "confirm",
						name: "confirm",
						message: `是否删除镜像源 ${mirrorName}？`,
						default: false,
					},
				])
				.then(async answer => {
					if (answer.confirm) {
						this.mirrorInfo.deleteMirror(mirrorName);
						console.log(`正在更新配置文件...`);
						this.config.saveMirrorConfig(
							this.mirrorInfo.getConfig()
						);
						console.log(`配置文件更新成功！`);
					}
				});
		} else {
			console.log(`镜像源 ${mirrorName} 不存在！`);
		}
	}

	/**
	 * @description 测试镜像源
	 * @param {string} mirror 镜像源名称
	 * @returns
	 */
	async verifyMirror(mirror: string = undefined) {
		if (mirror !== undefined) {
			const mirrorGet = this.mirrorInfo.mirrorExist(mirror);
			if (mirrorGet === false) {
				await inquirer
					.prompt([
						{
							type: "confirm",
							name: "confirm",
							message: `镜像源 ${mirror} 不存在，是否添加？`,
							default: false,
						},
					])
					.then(async answer => {
						if (answer.confirm) {
							await this.addMirror(mirror);
						}
					});
			} else {
				this.mirrorInfo.testMirror(mirrorGet).then(time => {
					if (time !== -1) {
						console.log(
							`镜像源 ${mirror} 可用，响应时间为 ${time}ms`
						);
					} else {
						console.log(`镜像源 ${mirror} 不可用！`);
					}
				});
			}
		} else {
			const mirrorListTest: MirrorSingle[] = this.mirrorInfo.list;
			Promise.all(
				mirrorListTest.map(async (mirror: MirrorSingle) => {
					const result = this.mirrorInfo.testMirror(mirror);
					mirror.usable = (await result) !== -1;
					mirror.time = await result;
					return mirror;
				})
			).then(async () => {
				// 排除不可用的镜像源后获取最快的镜像源
				const mirrorListUsable: MirrorSingle[] = mirrorListTest.filter(
					(mirror: MirrorSingle) => {
						return mirror.usable;
					}
				);
				const mirrorFastest: MirrorSingle = mirrorListUsable.reduce(
					(prev: MirrorSingle, next: MirrorSingle) => {
						return prev.time < next.time ? prev : next;
					}
				);
				// 获取当前使用的镜像源
				const mirrorUse: MirrorSingle = await mirrorListTest.find(
					(mirror: MirrorSingle) => {
						return mirror.name === this.mirrorInfo.current;
					}
				);
				// 输出结果
				console.log(
					`\n测试镜像源数量：${mirrorListTest.length}，可用镜像源数量：${mirrorListUsable.length}，最快镜像源为 ${mirrorFastest.name}，响应时间为 ${mirrorFastest.time}ms，当前使用镜像源为 ${mirrorUse.name}。`
				);
				console.log(
					`\n当前使用镜像源：${mirrorUse.name}，${mirrorUse.url}，${
						mirrorUse.time === -1
							? "不可用"
							: "耗时：" + mirrorUse.time + "ms"
					}`
				);
				console.log(
					`\n最快镜像源：${mirrorFastest.name}，${mirrorFastest.url}，耗时：${mirrorFastest.time}ms\n`
				);
				if (mirrorFastest.name !== mirrorUse.name) {
					await inquirer
						.prompt([
							{
								type: "confirm",
								name: "confirm",
								message: `是否切换到 ${mirrorFastest.name} 镜像源？`,
								default: false,
							},
						])
						.then(async answer => {
							if (answer.confirm) {
								this.mirrorInfo.setMirrorUse(
									mirrorFastest.name
								);
							}
						});
					await inquirer
						.prompt([
							{
								type: "confirm",
								name: "confirm",
								message: "是否更新配置文件？",
								default: false,
							},
						])
						.then(async answer => {
							if (answer.confirm) {
								mirrorListTest.map(
									async (mirror: MirrorSingle) => {
										delete mirror.time;
									}
								);
								this.mirrorInfo.list = mirrorListTest;
								console.log("\n正在更新配置文件...");
								this.config.saveMirrorConfig(
									this.mirrorInfo.getConfig()
								);
								console.log("\n更新配置文件成功!\n");
							}
						});
				}
			});
		}
	}

	/**
	 * @description 设置使用的镜像源
	 * @param {string} mirror 镜像源名称
	 * @return {Promise<void>}
	 */
	async setMirrorUse(mirror: string): Promise<void> {
		const mirrorGet = this.mirrorInfo.mirrorExist(mirror);
		if (mirrorGet === false) {
			console.log(`\n镜像源 ${mirror} 不存在！\n`);
			return;
		}
		await this.mirrorInfo.setMirrorUse(mirror);
		console.log("正在更新配置文件...");
		this.config.saveMirrorConfig(this.mirrorInfo.getConfig());
		console.log("更新配置文件成功！");
	}

	/**
	 * @description 更新镜像源
	 * @param {string} mirror 镜像源名称
	 * @return {Promise<void>}
	 */
	async updateMirror(mirror: string) {
		if (!this.mirrorInfo.mirrorExist(mirror)) {
			console.log(`\n镜像源 ${mirror} 不存在！\n`);
			return;
		}
		inquirer
			.prompt([
				{
					type: "input",
					name: "url",
					message: "请输入镜像源地址：",
					default: this.mirrorInfo.list.find((item: MirrorSingle) => {
						return item.name === mirror;
					}).url,
				},
			])
			.then(async answer => {
				await this.mirrorInfo.updateMirror(mirror, answer.url);
				console.log("正在更新配置文件...");
				this.config.saveMirrorConfig(this.mirrorInfo.getConfig());
				console.log("更新配置文件成功！");
			});
	}
}

export default Pip;
