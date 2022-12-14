/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令 mmd 相关模型
 * @update: 2021-12-21
 */

/* Node */
import { format } from 'silly-datetime';
/* MuCli */
import MucFile from '../utils/file.js';

class MarkdownModel {
	sign = '---';
	lineBreak = process.platform === 'win32' ? '\r\n' : '\n';
	/* eslint-disable */
	quote = (
		'> 本文档 [`Front-matter`](https://github.com/BTMuli/Mucli#FrontMatter) ' +
		'由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于'
	);
	/* eslint-disable */
	constructor(author, desc) {
		this.author = author;
		this.description = desc;
	}
	/**
	 * @description 获取默认写入内容
	 * @return {string}
	 */
	getHeader() {
		const dateNow = format(new Date(), 'YYYY-MM-DD');
		return (
			this.sign + this.lineBreak +
			'Author: ' + this.author + this.lineBreak +
            'Date: ' + dateNow + this.lineBreak +
            'Description: ' + this.description + this.lineBreak +
			'Update: ' + dateNow + this.lineBreak +
            this.sign + this.lineBreak + this.lineBreak +
            this.quote + '`' + format(new Date(), 'YYYY-MM-DD HH:mm:ss') + '`' + this.lineBreak +
			'> ' + this.lineBreak +
			'> 更新于 `' + format(new Date(), 'YYYY-MM-DD HH:mm:ss') + '`'
		);
	}
	/**
	 * @description 读取文件FrontMatter（确定已存在）
	 * @param {string} fileName 文件名
	 * @return {
	 * Promise<{
	 * 	header:{
	 * 		author:string,
	 * 		date:string,
	 * 		description:string,
	 * 		update:string},
	 * 	quote:{
	 * 		date:string,
	 * 		update:string}
	 * 	}>} FrontMatter
	 */
	async readHeader(fileName) {
		const headContent = await new MucFile().readLine(fileName, 10);
		return {
			header: {
				author: headContent[1].split(':')[1].trim(),
				date: headContent[2].split(':')[1].trim(),
				description: headContent[3].split(':')[1].trim(),
				update: headContent[4].split(':')[1].trim(),
			},
			quote: {
				date: headContent[7].split('`')[3],
				update: headContent[9].split('`')[1],
			}
		};
	}
	/**
	 * @description 更新文件FrontMatter
	 * @param {string} fileName 文件名
	 * @return {
	 * Promise<{
	 * 	header:{
	 * 		author:string,
	 * 		date:string,
	 * 		description:string,
	 * 		update:string},
	 * 	quote:{
	 * 		date:string,
	 * 		update:string}
	 * 	}>} FrontMatter
	 */
	async updateHeader(fileName) {
		let headRead = await this.readHeader(fileName);
		headRead.header.update = format(new Date(), 'YYYY-MM-DD');
		headRead.quote.update = format(new Date(), 'YYYY-MM-DD HH:mm:ss');
		return headRead;
	}
	/**
	 * @description 写入文件FrontMatter
	 * @param {string} fileName 文件名
	 * @return {Promise<string>} 写入内容
	 */
	async writeHeader(fileName) {
		const labelUpdate =await this.updateHeader(fileName);
		return (
			this.sign + this.lineBreak +
			'Author: ' + labelUpdate.header.author + this.lineBreak +
            'Date: ' + labelUpdate.header.date + this.lineBreak +
            'Description: ' + this.description + this.lineBreak +
			'Update: ' + labelUpdate.header.update + this.lineBreak +
            this.sign + this.lineBreak + this.lineBreak +
            this.quote + '`' + labelUpdate.quote.date + '`' + this.lineBreak +
			'> ' + this.lineBreak +
			'> 更新于 `' + labelUpdate.quote.update + '`'
		)
	}
}

export default MarkdownModel;
