/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令 dev 的具体实现
 * @version 0.2.2
 */

/* Node */
import inquirer from "inquirer";
import { exec } from "child_process";
/* MuCli */
import FileBase from "../base/file";
import ModelDev from "../model/dev";
import { PROJECT_INFO, ROOT_PATH } from "../index";
import { FilesPath } from "../interface/dev";
import { PackageJson } from "../interface";

class Dev {
	/**
	 * @description 更新/新增 package.json 中的子命令
	 * @param name {string} 子命令名称
	 * @param version {string} 子命令版本
	 * @return {void}
	 */
	updatePackage(name: string, version: string): void {
		const projInfo: PackageJson = PROJECT_INFO;
		if (name === "all") {
			projInfo.version = version;
		} else {
			projInfo.subversion[name] = version;
		}
		new FileBase().updateFile(
			`${ROOT_PATH}\\package.json`,
			JSON.stringify(projInfo, null, 4)
		);
	}

	/**
	 * @description 创建新的子命令
	 * @param name {string} 子命令名称
	 * @return {void}
	 */
	createNew(name): void {
		const mucFile: FileBase = new FileBase();
		inquirer
			.prompt([
				{
					type: "input",
					message: "请输入子命令名称",
					name: "name",
					default: name || "test",
				},
				{
					type: "input",
					message: "请输入子命令",
					name: "command",
					default: name || "test",
				},
				{
					type: "input",
					message: "请输入子命令描述",
					name: "description",
					default: `A SubCommand within MuCli for ${name || "test"}`,
				},
			])
			.then(async lv1 => {
				const dev: ModelDev = new ModelDev(
					lv1.name,
					lv1.command,
					lv1.description
				);
				const paths: FilesPath = dev.getFilesPath();
				inquirer
					.prompt([
						{
							type: "checkbox",
							name: "files",
							message: "请选择要创建的文件",
							choices: [
								{
									name: `cli`,
									value: "cli",
									checked: true,
								},
								{
									name: `config`,
									value: "config",
									checked: true,
								},
								{
									name: `interface`,
									value: "interface",
									checked: true,
								},
								{
									name: `model`,
									value: "model",
									checked: true,
								},
								{
									name: `utils`,
									value: "utils",
									checked: true,
								},
							],
						},
					])
					.then(async lv2 => {
						console.log("\n正在创建文件...\n");
						lv2.files.map(lv3 => {
							switch (lv3) {
								case "cli":
									mucFile.updateFile(
										paths.cliPath,
										dev.getCliContent()
									);
									break;
								case "config":
									mucFile.updateFile(
										paths.configPath,
										dev.getConfigContent()
									);
									break;
								case "interface":
									mucFile.updateFile(
										paths.interPath,
										dev.getInterContent()
									);
									break;
								case "model":
									mucFile.updateFile(
										paths.modelPath,
										dev.getModelContent()
									);
									break;
								case "utils":
									mucFile.updateFile(
										paths.utilsPath,
										dev.getUtilsContent()
									);
									break;
								default:
									break;
							}
						});
						this.updatePackage(lv1.command, "0.0.1");
						await new Promise(() => {
							setTimeout(() => {
								console.log("\n文件创建成功！\n");
							}, 1000);
						});
					});
			});
	}

	/**
	 * @description 获取新版本号
	 * @param oldVersion {string} 当前版本号
	 * @return {Array<{name:string,value:string}>} 新版本号
	 */
	getUpVersion(oldVersion: string): Array<{ name: string; value: string }> {
		return [
			oldVersion
				.split(".")
				.map((v: string, i: number) => (i === 2 ? Number(v) + 1 : v))
				.join("."),
			oldVersion
				.split(".")
				.map((v: string, i: number) =>
					i > 1 ? 0 : i === 1 ? Number(v) + 1 : v
				)
				.join("."),
			oldVersion
				.split(".")
				.map((v: string, i: number) => (i === 0 ? Number(v) + 1 : 0))
				.join("."),
		].map(v => ({ name: v, value: v }));
	}

	/**
	 * @description 检查版本号是否合法
	 * @param upVersion {string} 新版本号
	 * @param oldVersion {string} 当前版本号
	 * @return {boolean} 是否合法
	 */
	checkVersion(upVersion: string, oldVersion: string): boolean {
		const reg = /^(\d+\.){2}\d+$/;
		if (!reg.test(upVersion)) {
			console.log("版本号格式不正确");
			return false;
		}
		if (upVersion < oldVersion) {
			console.log("新版本号不能小于当前版本号");
			return false;
		}
		return true;
	}

	/**
	 * @description 更新主命令版本号
	 * @param upVersion {string} 新版本号
	 * @return {void}
	 */
	updateMucVersion(upVersion: string): void {
		const oldVersion: string = PROJECT_INFO.version;
		if (!this.checkVersion(upVersion, oldVersion)) {
			return;
		}
		this.updatePackage("all", upVersion);
		if (upVersion !== oldVersion) {
			console.log(`\n版本号已更新 ${oldVersion} -> ${upVersion}`);
			inquirer
				.prompt([
					{
						type: "confirm",
						name: "install",
						message: "是否立即更新依赖？",
						default: true,
						when: () =>
							new Promise(resolve => {
								setTimeout(() => {
									resolve(true);
								}, 1000);
							}),
					},
				])
				.then(answers => {
					if (answers.install) {
						exec("npm install", (err, stdout, stderr) => {
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
					} else {
						console.log("\n请手动执行 npm install 更新依赖\n");
					}
				});
		} else {
			console.log(`\n版本号未更新，当前 MuCli 版本为 ${oldVersion}\n`);
		}
	}

	/**
	 * @description 更新子命令版本号
	 * @param name {string} 子命令名称
	 * @param upVersion {string} 新版本号
	 * @return {void}
	 */
	updateSubVersion(name: string, upVersion: string): void {
		const subInfo: JSON = PROJECT_INFO.subversion;
		const oldVersion: string = subInfo[name];
		if (!this.checkVersion(upVersion, oldVersion)) {
			return;
		}
		this.updatePackage(name, upVersion);
		if (upVersion !== oldVersion) {
			console.log(`\n版本号已更新 ${oldVersion} -> ${upVersion}\n`);
		} else {
			console.log(`\n版本号未更新，当前 ${name} 版本为 ${oldVersion}\n`);
		}
	}

	/**
	 * @description 更新命令版本号
	 * @return {void}
	 */
	updateVersion(): void {
		const subCommandArr: Array<{ name: string; value: Array<string> }> =
			Object.keys(PROJECT_INFO.subversion).map((key: string) => {
				return {
					name: `${key}(${PROJECT_INFO.subversion[key]})`,
					value: [key, PROJECT_INFO.subversion[key]],
				};
			});
		inquirer
			.prompt([
				{
					type: "list",
					message: "请选择要更新的命令",
					name: "command",
					choices: [
						{
							name: `muc(${PROJECT_INFO.version})`,
							value: ["muc", PROJECT_INFO.version],
						},
						...subCommandArr,
						{
							name: "不更新任何命令",
							value: ["null"],
						},
					],
				},
			])
			.then(lv1 => {
				if (lv1.command[0] === "null") {
					console.log("\n未更新任何命令\n");
					return;
				}
				const oldVersion: string = lv1.command[1];
				inquirer
					.prompt([
						{
							type: "list",
							message: `请选择新的 ${lv1.command[0]} 版本号`,
							name: "version",
							choices: [
								...this.getUpVersion(oldVersion),
								{
									name: "手动输入",
									value: "input",
								},
								{
									name: "不更新",
									value: oldVersion,
								},
							],
						},
						{
							type: "input",
							name: "input",
							message: `请输入新的 ${lv1.command[0]} 版本号:`,
							when: lv2 => lv2.version === "input",
						},
					])
					.then(lv2 => {
						const upVersion: string =
							lv2.version === "input" ? lv2.input : lv2.version;
						if (lv1.command[0] === "muc") {
							this.updateMucVersion(upVersion);
						} else {
							this.updateSubVersion(lv1.command[0], upVersion);
						}
					});
			});
	}
}

export default Dev;
