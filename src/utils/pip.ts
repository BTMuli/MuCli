/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description pip 镜像相关操作
 * @version 0.4.0
 */

/* Node */
import { exec } from "child_process";
import { prompt } from "inquirer";
/* MuCli */
import { MirrorModel, PipModel } from "config/pip";
import Config from "../config/index";
import { PipConfig, PipMirror } from "./interface";

class Pip {
	pipConfig: Config;
	mirrorInfo: PipModel;

	constructor() {
		const pipConfig: PipConfig = new Config().readConfigDetail("pip");
		this.pipConfig = new Config();
		const mirrorUse: string = pipConfig.mirrorUse;
		const mirrorList: MirrorModel[] = [];
		pipConfig.mirrorList.forEach((mirror: PipMirror) => {
			mirrorList.push(new MirrorModel(mirror));
		});
		this.mirrorInfo = new PipModel(mirrorUse, mirrorList);
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
		const url: string = this.mirrorInfo.getMirrorUse().url;
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
			command = `${venv} install -r ${args.requirement} -i ${url}`;
		}
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
		if (!this.mirrorInfo.mirrorExist(mirrorName)) {
			const mirror = await prompt([
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
			this.pipConfig.changeConfig(
				["pip"],
				"mirrorList",
				this.mirrorInfo.mirrorList
			);
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
			prompt([
				{
					type: "confirm",
					name: "confirm",
					message: `是否删除镜像源 ${mirrorName}？`,
					default: false,
				},
			]).then(async answer => {
				if (answer.confirm) {
					await this.mirrorInfo.deleteMirror(mirrorName);
					console.log(`正在更新配置文件...`);
					this.pipConfig.changeConfig(
						["pip"],
						"mirrorList",
						this.mirrorInfo.mirrorList
					);
					console.log(`镜像源 ${mirrorName} 删除成功！`);
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
			if (!this.mirrorInfo.mirrorExist(mirror)) {
				prompt([
					{
						type: "confirm",
						name: "confirm",
						message: `镜像源 ${mirror} 不存在，是否添加？`,
						default: false,
					},
				]).then(async answer => {
					if (answer.confirm) {
						await this.addMirror(mirror);
					}
				});
			} else {
				await this.mirrorInfo.testMirror(mirror);
			}
		} else {
			const mirrorListTest: PipMirror[] = this.mirrorInfo.mirrorList;
			mirrorListTest.map(async (mirror: PipMirror) => {
				const result = await this.mirrorInfo.testMirror(mirror.name);
				mirror.usable = result !== -1;
				mirror.time = result;
			});
			// 排除不可用的镜像源后获取最快的镜像源
			const mirrorListUsable: PipMirror[] = mirrorListTest.filter(
				(mirror: PipMirror) => {
					return mirror.usable;
				}
			);
			const mirrorFastest: PipMirror = mirrorListUsable.reduce(
				(prev: PipMirror, next: PipMirror) => {
					return prev.time < next.time ? prev : next;
				}
			);
			// 获取当前使用的镜像源
			const mirrorUse: PipMirror = mirrorListTest.find(
				(mirror: PipMirror) => {
					return mirror.name === this.mirrorInfo.mirrorUse;
				}
			);
			// 输出结果
			console.log(
				`\n测试镜像源数量：${mirrorListTest.length}，可用镜像源数量：${mirrorListUsable.length}`
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
				await prompt([
					{
						type: "confirm",
						name: "confirm",
						message: `是否切换到 ${mirrorFastest.name} 镜像源？`,
						default: false,
					},
				]).then(async answer => {
					if (answer.confirm) {
						await this.mirrorInfo.setMirrorUse(mirrorFastest.name);
					}
					this.pipConfig.changeConfig(
						["pip"],
						"mirrorList",
						this.mirrorInfo.mirrorList
					);
				});
			}
			await prompt([
				{
					type: "confirm",
					name: "confirm",
					message: "是否更新配置文件？",
					default: false,
				},
			]).then(async answer => {
				if (answer.confirm) {
					mirrorListTest.map((mirror: PipMirror) => {
						delete mirror.time;
					});
					console.log("\n正在更新配置文件...");
					this.pipConfig.changeConfig(
						["pip"],
						"mirrorList",
						mirrorListTest
					);
					console.log("\n更新配置文件成功!\n");
				}
			});
		}
	}

	/**
	 * @description 设置使用的镜像源
	 * @param {string} mirror 镜像源名称
	 * @return {Promise<void>}
	 */
	async setMirrorUse(mirror: string) {
		if (!this.mirrorInfo.mirrorExist(mirror)) {
			console.log(`\n镜像源 ${mirror} 不存在！\n`);
			return;
		}
		await this.mirrorInfo.setMirrorUse(mirror);
		console.log("正在更新配置文件...");
		this.pipConfig.changeConfig(
			["pip"],
			"useMirror",
			this.mirrorInfo.mirrorUse
		);
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
		prompt([
			{
				type: "input",
				name: "url",
				message: "请输入镜像源地址：",
				default: this.mirrorInfo.mirrorList.find((item: PipMirror) => {
					return item.name === mirror;
				}).url,
			},
		]).then(async answer => {
			await this.mirrorInfo.updateMirror(mirror, answer.url);
			console.log("正在更新配置文件...");
			this.pipConfig.changeConfig(
				["pip"],
				"mirrorList",
				this.mirrorInfo.mirrorList
			);
			console.log("更新配置文件成功！");
		});
	}
}

export default Pip;
