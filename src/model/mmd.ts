/**
 * @file model mmd.ts
 * @author BTMuli<bt-muli@outlook.com>
 * @description 子命令 mmd 相关模型
 * @since 0.7.8
 */

/* Node */
import { format } from "silly-datetime";
/* MuCli */
import FileBase from "../base/file";
import { FrontMatter } from "../interface/mmd";

class ModelMmd {
	sign: string;
	lineBreak: string;
	quote: string;
	author: string;
	description: string;

	constructor(author = "", description = "") {
		this.sign = "---";
		this.lineBreak = process.platform === "win32" ? "\r\n" : "\n";
		/* eslint-disable */
    this.quote = (
      '> 本文档 [`Front-matter`](https://github.com/BTMuli/Mucli#FrontMatter) ' +
      '由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于 '
    );
    /* eslint-enable */
		this.author = author;
		this.description = description;
	}

	/**
	 * @description 生成 markdown 文件头部
	 * @since 0.7.4
	 * @returns {string} markdown 文件头部
	 */
	getHeader(): string {
		const dateNow: string = format(new Date(), "YYYY-MM-DD");
		/* eslint-disable */
    return (
      this.sign + this.lineBreak +
      'Author: ' + this.author + this.lineBreak +
      'Date: ' + dateNow + this.lineBreak +
      'Description: ' + this.description + this.lineBreak +
      'Update: ' + dateNow + this.lineBreak +
      this.sign + this.lineBreak + this.lineBreak +
      this.quote + '`' + format(new Date(), 'YYYY-MM-DD HH:mm:ss') + ' `' + this.lineBreak +
      '> ' + this.lineBreak +
      '> 更新于 `' + format(new Date(), 'YYYY-MM-DD HH:mm:ss') + '`'
    );
    /* eslint-enable */
	}

	/**
	 * @description 读取 FrontMatter (确定已存在)
	 * @param {string} fileName 文件名
	 * @return {Promise<FrontMatter>} FrontMatter
	 */
	async readHeader(fileName: string): Promise<FrontMatter> {
		const headContent = await new FileBase().readLine(fileName, 10);
		// 不确定 FrontMatter 中的各属性排序
		const headerRead: FrontMatter = {
			header: {
				author: "",
				date: "",
				description: "",
				update: "",
			},
			quote: {
				date: headContent[7].split("`")[3],
				update: headContent[9].split("`")[1],
			},
		};
		headContent.forEach(item => {
			if (item.includes("Author")) {
				headerRead.header.author = item.split(":")[1].trim();
			}
			if (item.includes("Date")) {
				headerRead.header.date = item.split(":")[1].trim();
			}
			if (item.includes("Description")) {
				headerRead.header.description = item.split(":")[1].trim();
			}
			if (item.includes("Update")) {
				headerRead.header.update = item.split(":")[1].trim();
			}
		});
		return headerRead;
	}

	/**
	 * @description 更新 FrontMatter
	 * @param {string} fileName 文件名
	 * @return {Promise<FrontMatter>} FrontMatter
	 */
	async updateHeader(fileName: string): Promise<FrontMatter> {
		const headRead = await this.readHeader(fileName);
		headRead.header.update = format(new Date(), "YYYY-MM-DD");
		headRead.quote.update = format(new Date(), "YYYY-MM-DD HH:mm:ss");
		return headRead;
	}

	/**
	 * @description 写入 FrontMatter
	 * @param {string} fileName 文件名
	 * @return {Promise<string>} 写入内容
	 */
	async writeHeader(fileName: string): Promise<string> {
		const labelUpdate: FrontMatter = await this.updateHeader(fileName);
		/* eslint-disable */
    return (
      this.sign + this.lineBreak +
      'Author: ' + labelUpdate.header.author + this.lineBreak +
      'Date: ' + labelUpdate.header.date + this.lineBreak +
      'Description: ' + labelUpdate.header.description + this.lineBreak +
      'Update: ' + labelUpdate.header.update + this.lineBreak +
      this.sign + this.lineBreak + this.lineBreak +
      this.quote + '`' + labelUpdate.quote.date + '`' + this.lineBreak +
      '> ' + this.lineBreak +
      '> 更新于 `' + labelUpdate.quote.update + '`'
    );
    /* eslint-enable */
	}
}

export default ModelMmd;
