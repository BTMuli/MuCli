/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description markdown 文件相关操作
 * @version 0.7.0
 */

/* Node */
import inquirer from "inquirer";
import { exec } from "child_process";
/* MuCli */
import MarkdownModel from "../config/markdown";
import MucFile from "./file";
import Config from "../config/index";
import Typora from "./typora";
import { MmdConfig, MmdLabel } from "./interface";

class Markdown {
	config: Config;
	label: { default: MmdLabel; custom: Array<MmdLabel> };
	label_default: MmdLabel;
	typora: Typora;
	mucFile: MucFile;

	constructor() {
		const markdownConfig: MmdConfig = new Config().readConfigDetail("mmd");
		const typora: Typora = new Typora(markdownConfig.typora);
		this.config = new Config();
		this.label = markdownConfig.label;
		this.label_default = markdownConfig.label.default;
		this.typora = typora;
		this.mucFile = new MucFile();
	}

	/* Typora 相关 */

	/**
	 * @description 检测 Typora 配置
	 * @return {void}
	 */
	testTypora(): void {
		this.typora.verifyConfig();
	}

	/**
	 * @description 获取 Typora 配置
	 * @return {void}
	 */
	showTypora(): void {
		this.typora.showConfig();
	}

	/**
	 * @description 调用 Typora 打开文件
	 * @param {string} fileName 文件名
	 * @return {void}
	 */
	openTypora(fileName: string): void {
		this.typora.openFile(fileName);
	}

	/**
	 * @description 修改 Typora 配置
	 * @return {void}
	 */
	modifyTypora(): void {
		this.showTypora();
		inquirer
			.prompt([
				{
					type: "checkbox",
					name: "typora",
					message: "请选择要修改的配置项",
					choices: [
						{
							name: "Typora 可用性",
							value: "enable",
						},
						{
							name: "Typora 配置文件路径",
							value: "path",
						},
					],
				},
				{
					type: "confirm",
					name: "enable",
					message: `确认修改可用性？（当前${
						this.typora.enable ? "可用" : "不可用"
					}）`,
					when: answers => answers.typora.includes("enable"),
					default: true,
				},
				{
					type: "input",
					name: "path",
					message: "请输入 Typora 配置文件路径",
					when: answers => answers.typora.includes("path"),
					default: this.typora.path,
				},
			])
			.then(answers => {
				if (answers.typora.length === 0) {
					console.log("\n未对Typora配置进行修改。");
				} else {
					if (answers.typora.includes("enable")) {
						this.typora.enable = !this.typora.enable;
					}
					if (answers.typora.includes("path")) {
						this.typora.path = answers.path;
					}
					this.typora.saveConfig();
					console.log("\nTypora 配置修改成功");
				}
				this.showTypora();
			});
	}

	/**
	 * @description 根据配置选择相应操作
	 * @return {void}
	 */
	operaTypora(): void {
		inquirer
			.prompt([
				{
					type: "list",
					name: "typora",
					message: "请选择要进行的操作",
					choices: [
						{
							name: "初始化 Typora 配置",
							value: "init",
						},
						{
							name: "检测 Typora 配置",
							value: "test",
						},
						{
							name: "查看 Typora 配置",
							value: "show",
						},
						{
							name: "修改 Typora 配置",
							value: "modify",
						},
						{
							name: "查看 muc mmd typora 命令说明",
							value: "help",
						},
						{
							name: "退出",
							value: "exit",
						},
					],
				},
			])
			.then(answers => {
				switch (answers.typora) {
					case "init":
						this.typora.initConfig();
						break;
					case "test":
						this.testTypora();
						break;
					case "show":
						this.showTypora();
						break;
					case "modify":
						this.modifyTypora();
						break;
					case "help":
						exec("muc mmd typora -h", (error, stdout, stderr) => {
							if (error) {
								console.log(error);
								return;
							}
							if (stderr) {
								console.log(stderr);
								return;
							}
							if (stdout) {
								console.log(stdout);
							}
						});
						break;
					case "exit":
						break;
				}
			});
	}

	/* Label 相关 */

	/**
	 * @description 检测 Label 是否存在
	 * @param {string} fileName Label 名称
	 * @return {MmdLabel} Label 信息
	 */
	checkLabel(fileName: string): MmdLabel {
		const customLabel: Array<MmdLabel> = this.label.custom;
		const defaultLabel: MmdLabel = {
			author: this.label.default.author,
			description: fileName,
			filename: fileName,
		};
		// 判断是否为空
		if (customLabel === null) {
			return defaultLabel;
		}
		// 判断是否存在
		customLabel.map((label: MmdLabel) => {
			if (label.filename === fileName) {
				return label;
			}
		});
		return defaultLabel;
	}

	/**
	 * @description 修改 Label
	 * @param {Array<MmdLabel>} customLabel Label 信息
	 * @return {void}
	 */
	changeLabel(customLabel: Array<MmdLabel>): void {
		new Config().changeConfig(["mmd", "label"], "custom", customLabel);
	}

	/**
	 * @description 创建 Label
	 * @param {string} fileName Label 名称
	 * @return {void}
	 */
	addLabel(fileName: string): void {
		const labelCheck: MmdLabel = this.checkLabel(fileName);
		if (labelCheck.author !== undefined) {
			console.log(`Label ${fileName} 已存在`);
			return;
		} else {
			inquirer
				.prompt([
					{
						type: "input",
						name: "author",
						message: "请输入作者",
						default: this.label.default.author,
					},
					{
						type: "input",
						name: "description",
						message: "请输入描述",
						default: this.label_default.description,
					},
				])
				.then(label => {
					const labelGet: MmdLabel = {
						author: label.author,
						description: label.description,
						filename: fileName,
					};
					console.log(labelGet);
					inquirer
						.prompt([
							{
								type: "confirm",
								name: "create",
								message: `是否创建 Label ${fileName}`,
								default: false,
							},
						])
						.then(answers => {
							if (answers.create) {
								let labelCustom: Array<MmdLabel> =
									this.label.custom;
								if (
									labelCustom === undefined ||
									labelCustom === null
								) {
									labelCustom = [];
								}
								labelCustom.push(labelGet);
								this.changeLabel(labelCustom);
							}
						});
				});
		}
	}

	/**
	 * @description 获取 Label 信息
	 * @param {string} fileName Label 名称
	 * @return {void}
	 */
	getLabel(fileName = "all"): void {
		const label = this.label;
		if (fileName === "all") {
			console.log(label);
		} else {
			const labelCheck: MmdLabel = this.checkLabel(fileName);
			if (labelCheck.author !== undefined) {
				console.log(labelCheck);
			} else {
				inquirer
					.prompt([
						{
							type: "confirm",
							name: "create",
							message: `Label ${fileName} 不存在，是否创建？`,
							default: false,
						},
					])
					.then(answers => {
						if (answers.create) {
							this.addLabel(fileName);
						}
					});
			}
		}
	}

	/**
	 * @description 删除 Label
	 * @param {string} fileName Label 名称
	 * @return {void}
	 */
	delLabel(fileName: string): void {
		const labelCheck: MmdLabel = this.checkLabel(fileName);
		if (labelCheck.author === undefined) {
			console.log(`Label ${fileName} 不存在`);
			return;
		}
		inquirer
			.prompt([
				{
					type: "confirm",
					name: "delete",
					message: `是否删除 Label ${fileName}`,
					default: false,
				},
			])
			.then(answers => {
				if (answers.delete) {
					let labelCustom: Array<MmdLabel> = this.label.custom;
					labelCustom = labelCustom.filter((label: MmdLabel) => {
						return label.filename !== fileName;
					});
					this.changeLabel(labelCustom);
				}
			});
	}

	/* File 相关 */

	/**
	 * @description 检测 FrontMatter 信息
	 * @param {string} fileName 文件名
	 * @return {Promise<boolean>} 是否存在 FrontMatter 信息
	 */
	async checkHeader(fileName: string): Promise<boolean> {
		const contentRead: Array<string> = await this.mucFile.readLine(
			fileName,
			10
		);
		return !(contentRead.length !== 10 || contentRead[0] !== "---");
	}

	/**
	 * @description 创建新文件
	 * @param {string} fileName 文件名
	 * @param {string} author 作者
	 * @param {string} description 描述
	 * @return {Promise<void>}
	 */
	async createFile(
		fileName: string,
		author: string,
		description: string
	): Promise<void> {
		const mdModel: MarkdownModel = new MarkdownModel(author, description);
		const mdPath: string = fileName + ".md";
		if (await this.mucFile.fileExist(mdPath)) {
			const hasHeader: boolean = await this.checkHeader(mdPath);
			inquirer
				.prompt([
					{
						type: "list",
						name: "action",
						message: `文件 ${mdPath} 已存在，未检测到文件头，执行以下操作：`,
						choices: [
							{
								name: "覆盖",
								value: "cover",
							},
							{
								name: "插入文件头",
								value: "insert",
							},
						],
						when: !hasHeader,
						default: "insert",
					},
					{
						type: "list",
						name: "action",
						message: `文件 ${mdPath} 已存在，检测到文件头，执行以下操作：`,
						choices: [
							{
								name: "覆盖",
								value: "cover",
							},
							{
								name: "更新文件头",
								value: "update",
							},
							{
								name: "不执行任何操作",
								value: "none",
							},
						],
						when: hasHeader,
						default: "none",
					},
				])
				.then(async answer => {
					switch (answer.action) {
						case "cover":
							await this.mucFile.writeFile(
								mdPath,
								mdModel.getHeader()
							);
							break;
						case "insert":
							await this.mucFile.insertLine(
								mdPath,
								0,
								mdModel.getHeader()
							);
							break;
						case "update":
							await this.mucFile.updateLine(
								mdPath,
								0,
								await mdModel.writeHeader(mdPath)
							);
							break;
						case "none":
							break;
					}
				});
		} else {
			await this.mucFile.writeFile(mdPath, mdModel.getHeader());
		}
	}

	/**
	 * @description 创建新文件前的提示
	 * @param {string} fileName 文件名
	 * @return {void}
	 */
	promptCreateFile(fileName: string): void {
		inquirer
			.prompt([
				{
					type: "input",
					name: "title",
					message: "请输入文件名称",
					default: fileName || this.label_default.filename,
				},
			])
			.then(async lv1 => {
				if (lv1.title === this.label_default.filename) {
					await inquirer
						.prompt([
							{
								type: "input",
								name: "author",
								message: "请输入作者",
								default: this.label_default.author,
							},
							{
								type: "input",
								name: "description",
								message: "请输入描述",
								default: this.label_default.description,
							},
						])
						.then(async lv2 => {
							await this.createFile(
								lv1.title,
								lv2.author,
								lv2.description
							);
						});
				} else {
					const label = this.checkLabel(lv1.title);
					await inquirer
						.prompt([
							{
								type: "input",
								name: "author",
								message: "请输入作者",
								default: label.author,
							},
							{
								type: "input",
								name: "description",
								message: "请输入描述",
								default: label.description,
							},
						])
						.then(async lv2 => {
							await this.createFile(
								lv1.title,
								lv2.author,
								lv2.description
							);
						});
				}
			});
	}

	/**
	 * @description 更新文件前的提示
	 * @param {string} fileName 文件名
	 * @return {Promise<void>}
	 */
	async promptUpdateFile(fileName: string): Promise<void> {
		const fileCheck: boolean = await this.mucFile.fileExist(fileName);
		if (fileCheck) {
			const hasHeader: boolean = await this.checkHeader(fileName);
			inquirer
				.prompt([
					{
						type: "confirm",
						name: "insert",
						message: `文件 ${fileName} 未检测到文件头，是否插入文件头？`,
						when: !hasHeader,
						default: true,
					},
					{
						type: "confirm",
						name: "update",
						message: `文件 ${fileName} 已存在，是否更新文件头？`,
						when: hasHeader,
						default: true,
					},
				])
				.then(async answer => {
					const title = fileName.replace(/\.md$/, "");
					if (answer.insert) {
						const label: MmdLabel = this.checkLabel(title);
						await inquirer
							.prompt([
								{
									type: "input",
									name: "author",
									message: "请输入作者",
									default: label.author,
								},
								{
									type: "input",
									name: "description",
									message: "请输入描述",
									default: label.description,
								},
							])
							.then(async input => {
								const mdModel: MarkdownModel =
									new MarkdownModel(
										input.author,
										input.description
									);
								await this.mucFile.insertLine(
									fileName,
									0,
									mdModel.getHeader()
								);
							});
					} else if (answer.update) {
						const mdModel: MarkdownModel = new MarkdownModel();
						await this.mucFile.updateLine(
							fileName,
							0,
							await mdModel.writeHeader(fileName)
						);
					}
				});
		} else {
			inquirer
				.prompt([
					{
						type: "confirm",
						name: "create",
						message: `文件 ${fileName} 不存在，是否创建文件？`,
						default: false,
					},
				])
				.then(async answer => {
					if (answer.create) {
						const title = fileName.replace(/\.md$/, "");
						await this.promptCreateFile(title);
					}
				});
		}
	}
}

export default Markdown;
