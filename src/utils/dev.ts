/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令 dev 的具体实现
 * @version 0.2.0
 */

/* Node */
import inquirer from "inquirer";
import { exec } from "child_process";
/* MuCli */
import MucFile from "./file";
import DevModel from "../config/dev";
import { PROJECT_INFO, ROOT_PATH } from "../config";
import { DevFilesPath, ProjPackageJson } from "./interface";

class Dev {
	/**
	 * @description 更新/新增 package.json 中的子命令
	 * @param name {string} 子命令名称
	 * @param version {string} 子命令版本
	 * @return {void}
	 */
	updatePackage(name: string, version: string): void {
		const projInfo: ProjPackageJson = PROJECT_INFO;
		if (name === "all") {
			projInfo.version = version;
		} else {
			projInfo.subversion[name] = version;
		}
		new MucFile().writeFile(
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
		const mucFile: MucFile = new MucFile();
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
			.then(async answers => {
				const dev: DevModel = new DevModel(
					answers.name,
					answers.command,
					answers.description
				);
				const paths: DevFilesPath = dev.getFilesPath();
				await mucFile.writeFile(paths.cliPath, dev.getCliModel());
				await mucFile.writeFile(paths.utilsPath, dev.getUtilsModel());
				await mucFile.writeFile(paths.configPath, dev.getConfigModel());
				this.updatePackage(answers.command, "0.0.1");
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
