/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description pip 镜像相关操作
 * @version 0.4.3
 */

/* Node */
import { exec } from "child_process";
import inquirer from "inquirer";
/* MuCli Base */
import FileBase from "../base/file";
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
	 * @param {undefined | string | boolean} args.package 包名
	 * @param {undefined | string | boolean} args.requirement requirements.txt 文件路径
	 * @return {void}
	 */
	install(args: {
		package: undefined | string | boolean;
		requirement: undefined | string | boolean;
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
		inquirer
			.prompt([
				{
					type: "input",
					name: "package",
					message: "请输入包名：",
					when: args.package !== undefined,
					default: args.package,
				},
				{
					type: "input",
					name: "requirement",
					message: "请输入 requirements.txt 文件路径：",
					when: args.requirement !== undefined,
					default: "requirements.txt",
				},
				{
					type: "list",
					name: "operate",
					message: "请选择操作：",
					choices: [
						{
							name: "安装包",
							value: "package",
						},
						{
							name: "安装 requirements.txt 文件",
							value: "requirement",
						},
					],
					when:
						args.package === undefined &&
						args.requirement === undefined,
				},
			])
			.then(async answer => {
				if (answer.package) {
					command = `${venv} install ${answer.package} -i ${url}`;
				} else if (answer.requirement) {
					// 寻找是否有 requirements.txt 文件
					const check = await new FileBase().fileExist(
						"requirements.txt"
					);
					if (!check) {
						console.log("requirements.txt 文件不存在");
						return;
					}
					command = `${venv} install -r ${answer.requirement} -i ${url}`;
				} else if (answer.operate) {
					if (answer.operate === "package") {
						this.install({
							package: true,
							requirement: undefined,
						});
					} else if (answer.operate === "requirement") {
						this.install({
							package: undefined,
							requirement: true,
						});
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
				}
			});
	}

	/**
	 * @description 操作中转
	 * @return {void}
	 */
	operaMirror(): void {
		inquirer
			.prompt([
				{
					type: "list",
					name: "operate",
					message: "请选择操作：",
					choices: [
						{
							name: "查看镜像",
							value: "show",
						},
						{
							name: "设置当前使用镜像",
							value: "use",
						},
						{
							name: "添加镜像",
							value: "add",
						},
						{
							name: "删除镜像",
							value: "delete",
						},
						{
							name: "更新镜像",
							value: "update",
						},
						{
							name: "测试镜像",
							value: "test",
						},
						{
							name: "退出",
							value: "exit",
						},
					],
				},
			])
			.then(async answer => {
				if (answer.operate === "show") {
					this.showMirror();
				} else if (answer.operate === "use") {
					await this.setMirrorUse();
				} else if (answer.operate === "add") {
					await this.addMirror();
				} else if (answer.operate === "delete") {
					await this.deleteMirror();
				} else if (answer.operate === "update") {
					await this.updateMirror();
				} else if (answer.operate === "test") {
					await this.verifyMirror();
				} else if (answer.operate === "exit") {
					return;
				}
			});
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
	 * @param {string|undefined} mirrorName 镜像源名称
	 * @return {Promise<void>}
	 */
	async addMirror(mirrorName: string = undefined): Promise<void> {
		let mirrorGet: MirrorSingle | false = false;
		if (mirrorName !== undefined) {
			mirrorGet = this.mirrorInfo.mirrorExist(mirrorName);
		}
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
			this.config.saveMirrorConfig(this.mirrorInfo.getConfig());
			// 延时 1s 输出
			setTimeout(() => {
				console.log("更新配置文件成功！");
			}, 1000);
		} else {
			console.log(`镜像源 ${mirrorName} 已存在！`);
		}
	}

	/**
	 * @description 删除镜像
	 * @param {string} mirror 镜像源名称
	 * @return {Promise<void>}
	 */
	async deleteMirror(mirror: string = undefined): Promise<void> {
		// 获取当前镜像源列表
		const mirrorList = this.mirrorInfo.getMirrorList();
		inquirer
			.prompt([
				{
					type: "list",
					name: "mirror",
					message: "请选择要删除的镜像源：",
					choices: mirrorList,
					default: mirror,
				},
			])
			.then(async answer => {
				this.mirrorInfo.deleteMirror(answer.mirror);
				this.config.saveMirrorConfig(this.mirrorInfo.getConfig());
				// 延时 1s 输出
				setTimeout(() => {
					console.log("更新配置文件成功！");
				}, 1000);
			});
	}

	/**
	 * @description 获取测试的镜像源
	 * @return {Promise<string>}
	 */
	async getMirrorTest(): Promise<string> {
		// 获取镜像源列表
		const mirrorList = this.mirrorInfo.getMirrorList();
		return inquirer
			.prompt([
				{
					type: "list",
					name: "test",
					message: "请选择测试的对象：",
					choices: [
						{
							name: "全部镜像源",
							value: "all",
						},
						{
							name: "指定镜像源",
							value: "one",
						},
					],
				},
				{
					type: "list",
					name: "mirror",
					message: "请选择镜像源：",
					choices: mirrorList,
					when: answer => answer.test === "one",
				},
			])
			.then(async answer => {
				if (answer.test === "all") {
					return "all";
				} else if (answer.test === "one") {
					return answer.mirror;
				}
			});
	}

	/**
	 * @description 测试镜像源
	 * @returns
	 */
	async verifyMirror() {
		const mirrorTest = await this.getMirrorTest();
		if (mirrorTest !== "all") {
			const mirrorGet = this.mirrorInfo.mirrorExist(mirrorTest);
			if (mirrorGet === false) {
				console.log(`镜像源 ${mirrorTest} 不存在！`);
				return;
			}
			this.mirrorInfo.testMirror(mirrorGet).then(time => {
				if (time !== -1) {
					console.log(
						`镜像源 ${mirrorTest} 可用，响应时间为 ${time}ms`
					);
				} else {
					console.log(`镜像源 ${mirrorTest} 不可用！`);
				}
			});
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
								this.config.saveMirrorConfig(
									this.mirrorInfo.getConfig()
								);
								// 延时 1s 输出
								setTimeout(() => {
									console.log("更新配置文件成功！");
								}, 1000);
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
	async setMirrorUse(mirror: string = undefined): Promise<void> {
		// 获取当前镜像源列表
		const mirrorList = this.mirrorInfo.getMirrorList();
		if (mirror !== undefined) {
			const mirrorGet = this.mirrorInfo.mirrorExist(mirror);
			if (mirrorGet === false) {
				console.log(`\n镜像源 ${mirror} 不存在！\n`);
				return;
			}
		}
		inquirer
			.prompt([
				{
					type: "list",
					name: "mirror",
					message: "请选择要使用的镜像源：",
					choices: mirrorList,
					default: mirror || this.mirrorInfo.current,
				},
			])
			.then(async answer => {
				const mirrorGet = this.mirrorInfo.mirrorExist(answer.mirror);
				if (mirrorGet === false) {
					console.log(`\n镜像源 ${mirror} 不存在！\n`);
					return;
				}
				this.mirrorInfo.setMirrorUse(mirrorGet.name);
				this.config.saveMirrorConfig(this.mirrorInfo.getConfig());
				// 延时 1s 输出
				setTimeout(() => {
					console.log("更新配置文件成功！");
				}, 1000);
			});
	}

	/**
	 * @description 更新镜像源
	 * @param {string} mirror 镜像源名称
	 * @return {Promise<void>}
	 */
	async updateMirror(mirror: string = undefined) {
		// 获取当前镜像源列表
		const mirrorList = this.mirrorInfo.getMirrorList();
		if (mirror !== undefined) {
			const mirrorGet = this.mirrorInfo.mirrorExist(mirror);
			if (mirrorGet === false) {
				console.log(`\n镜像源 ${mirror} 不存在！\n`);
				return;
			}
		}
		inquirer
			.prompt([
				{
					type: "list",
					name: "mirror",
					message: "请选择要更新的镜像源：",
					choices: mirrorList,
					default: mirror || this.mirrorInfo.current,
				},
			])
			.then(async answerF => {
				inquirer
					.prompt([
						{
							type: "input",
							name: "url",
							message: "请输入镜像源地址：",
							default: this.mirrorInfo.list.find(
								(item: MirrorSingle) => {
									return item.name === answerF.mirror;
								}
							).url,
						},
					])
					.then(async answerS => {
						await this.mirrorInfo.updateMirror(
							answerF.mirror,
							answerS.url
						);
						this.config.saveMirrorConfig(
							this.mirrorInfo.getConfig()
						);
						// 延时 1s 输出
						setTimeout(() => {
							console.log("更新配置文件成功！");
						}, 1000);
					});
			});
	}
}

export default Pip;
