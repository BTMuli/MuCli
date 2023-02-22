/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description markdown 文件相关操作
 * @version 0.7.3
 */

/* Node */
import inquirer from "inquirer";
import { exec } from "child_process";
/* MuCli Base */
import FileBase from "../base/file";
import ModelMmd from "../model/mmd";
import ConfigMmd from "../config/mmd";
/* MuCli Interface */
import { Config, Label, LabelSingle } from "../interface/mmd";

class Mmd {
	config: ConfigMmd;
	label: Label;
	file: FileBase;

	constructor() {
		const mmdConfig: Config = new ConfigMmd().readConfig().mmd;
		this.config = new ConfigMmd();
		this.label = mmdConfig.label;
		this.file = this.config.yamlTool.fileTool;
	}

	/**
	 * @description 检测 Label 是否存在
	 * @param {string} fileName Label 名称
	 * @return {LabelSingle} Label 信息
	 */
	checkLabel(fileName: string): LabelSingle {
		const customLabel: Array<LabelSingle> = this.label.custom;
		const defaultLabel: LabelSingle = {
			filename: fileName,
			author: undefined,
			description: fileName,
		};
		// 判断是否是默认模板
		if (fileName === this.label.default.filename) {
			return this.label.default;
		}
		// 判断是否为空
		if (customLabel === null) {
			return defaultLabel;
		}
		// 判断是否存在
		customLabel.map((label: LabelSingle) => {
			if (label.filename === fileName) {
				return label;
			}
		});
		return defaultLabel;
	}

	/**
	 * @description 创建 Label
	 * @param {string} fileName Label 名称
	 * @return {void}
	 */
	addLabel(fileName: string): void {
		const labelCheck: LabelSingle = this.checkLabel(fileName);
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
						default: this.label.default.description,
					},
				])
				.then(label => {
					const labelGet: LabelSingle = {
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
								let labelCustom: Array<LabelSingle> =
									this.label.custom;
								if (
									labelCustom === undefined ||
									labelCustom === null
								) {
									labelCustom = [];
								}
								labelCustom.push(labelGet);
								this.label.custom = labelCustom;
								this.config.saveMmdConfig(this.label);
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
			let labelsInfo = [];
			labelsInfo.push(label.default);
			if (label.custom !== undefined && label.custom !== null) {
				labelsInfo = labelsInfo.concat(label.custom);
			}
			console.table(labelsInfo);
		} else {
			const labelCheck: LabelSingle = this.checkLabel(fileName);
			if (labelCheck.author !== undefined) {
				console.table(labelCheck);
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
		const labelCheck: LabelSingle = this.checkLabel(fileName);
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
					let labelCustom: Array<LabelSingle> = this.label.custom;
					labelCustom = labelCustom.filter((label: LabelSingle) => {
						return label.filename !== fileName;
					});
					this.label.custom = labelCustom;
					this.config.saveMmdConfig(this.label);
				}
			});
	}

	/**
	 * @description 操作中转
	 * @return {void}
	 */
	operaLabel(): void {
		inquirer
			.prompt([
				{
					type: "list",
					name: "label",
					message: "请选择要进行的操作",
					choices: [
						{
							name: "查看所有 Label",
							value: "get",
						},
						{
							name: "查询 Label",
							value: "check",
						},
						{
							name: "创建 Label",
							value: "add",
						},
						{
							name: "删除 Label",
							value: "del",
						},
						{
							name: "查看 muc mmd label 命令说明",
							value: "help",
						},
						{
							name: "退出",
							value: "exit",
						},
					],
				},
			])
			.then(lv1 => {
				if (lv1.label === "exit") {
					return;
				}
				if (lv1.label === "help") {
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
					return;
				}
				if (lv1.label === "get") {
					this.getLabel("all");
					return;
				}
				inquirer
					.prompt([
						{
							type: "input",
							name: "fileName",
							message: "请输入要查询的 Label",
							when: lv1.label === "check",
						},
						{
							type: "input",
							name: "fileName",
							message: "请输入要创建的 Label",
							when: lv1.label === "add",
						},
						{
							type: "input",
							name: "fileName",
							message: "请输入要删除的 Label",
						},
					])
					.then(lv2 => {
						if (lv2.fileName === "") {
							console.log("输入不能为空");
							return;
						}
						switch (lv1.label) {
							case "check":
								this.getLabel(lv2.fileName);
								break;
							case "add":
								this.addLabel(lv2.fileName);
								break;
							case "del":
								this.delLabel(lv2.fileName);
								break;
						}
					});
			});
	}

	/* File 相关 */

	/**
	 * @description 检测 FrontMatter 信息
	 * @param {string} fileName 文件名
	 * @return {Promise<boolean>} 是否存在 FrontMatter 信息
	 */
	async checkHeader(fileName: string): Promise<boolean> {
		const contentRead: Array<string> = await this.file.readLine(
			fileName,
			10
		);
		return !(contentRead.length !== 10 || contentRead[0] !== "---");
	}

	/**
	 * @description 创建新文件
	 * @param {string} filePath 文件路径
	 * @param {string} author 作者
	 * @param {string} description 描述
	 * @return {Promise<void>}
	 */
	async createFile(
		filePath: string,
		author: string,
		description: string
	): Promise<void> {
		// 分隔符可能是 / 或者 \
		let fileName: string;
		filePath.includes("\\")
			? (fileName = filePath.split("\\").pop())
			: (fileName = filePath.split("/").pop());
		const mdModel: ModelMmd = new ModelMmd(author, description);
		if (await this.file.fileExist(filePath)) {
			const hasHeader: boolean = await this.checkHeader(filePath);
			inquirer
				.prompt([
					{
						type: "list",
						name: "action",
						message: `文件 ${fileName} 已存在，未检测到文件头，执行以下操作：`,
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
						message: `文件 ${fileName} 已存在，检测到文件头，执行以下操作：`,
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
							this.file.updateFile(filePath, mdModel.getHeader());
							break;
						case "insert":
							await this.file.insertLine(
								filePath,
								0,
								mdModel.getHeader()
							);
							break;
						case "update":
							await this.file.updateLine(
								filePath,
								0,
								await mdModel.writeHeader(fileName)
							);
							break;
						case "none":
							break;
					}
				});
		} else {
			this.file.createFile(filePath, mdModel.getHeader());
		}
	}

	/**
	 * @description 创建新文件前的提示
	 * @param {string} filePath 文件路径
	 * @return {void}
	 */
	promptCreateFile(filePath: string): void {
		// 分隔符可能是 / 或者 \
		let fileName: string;
		filePath.includes("\\")
			? (fileName = filePath.split("\\").pop())
			: (fileName = filePath.split("/").pop());
		if (fileName.includes(".")) {
			if (fileName.endsWith(".md")) {
				fileName = fileName.replace(".md", "");
			} else {
				console.log("\n文件名不合法，文件名应以 .md 结尾");
				return;
			}
		}
		if (!fileName.includes(".")) {
			filePath = filePath + ".md";
		}
		const label = this.checkLabel(fileName);
		inquirer
			.prompt([
				{
					type: "input",
					name: "title",
					message: "请输入文件名称",
					default: fileName,
				},
				{
					type: "input",
					name: "author",
					message: "请输入作者",
					default: label.author || this.label.default.author,
				},
				{
					type: "input",
					name: "description",
					message: "请输入描述",
					default: label.description,
				},
			])
			.then(async answers => {
				await this.createFile(
					filePath,
					answers.author,
					answers.description
				);
			});
	}

	/**
	 * @description 更新文件前的提示
	 * @param {string} filePath 文件路径
	 * @return {Promise<void>}
	 */
	async promptUpdateFile(filePath: string): Promise<void> {
		// 分隔符可能是 / 或者 \
		let fileName: string;
		filePath.includes("\\")
			? (fileName = filePath.split("\\").pop())
			: (fileName = filePath.split("/").pop());
		if (fileName.includes(".")) {
			if (fileName.endsWith(".md")) {
				fileName = fileName.replace(".md", "");
			} else {
				console.log("\n文件名不合法，文件名应以 .md 结尾");
				return;
			}
		} else {
			filePath = filePath + ".md";
		}
		const fileCheck: boolean = await this.file.fileExist(filePath);
		if (fileCheck) {
			const hasHeader: boolean = await this.checkHeader(filePath);
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
					if (answer.insert) {
						const label: LabelSingle = this.checkLabel(fileName);
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
								const mdModel: ModelMmd = new ModelMmd(
									input.author,
									input.description
								);
								await this.file.insertLine(
									filePath,
									0,
									mdModel.getHeader()
								);
							});
					} else if (answer.update) {
						const mdModel: ModelMmd = new ModelMmd();
						await this.file.updateLine(
							filePath,
							10,
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
						await this.promptCreateFile(filePath);
					}
				});
		}
	}
}

export default Mmd;
