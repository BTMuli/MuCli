/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令 mmd 相关模型
 * @update: 2021-12-21
 */

/* Node */
import { format } from 'silly-datetime';

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
	getLabel() {
		const dateNow = format(new Date(), 'YYYY-MM-DD');
		return (
			this.sign + this.lineBreak +
			'Author: ' + this.author + this.lineBreak +
            'Date: ' + dateNow + this.lineBreak +
            'Description: ' + this.description + this.lineBreak +
			'Update: ' + dateNow + this.lineBreak +
            this.sign + this.lineBreak + this.lineBreak +
            this.quote + this.lineBreak +
            '`' + format(new Date(), 'YYYY-MM-DD HH:mm:ss') + '`' + this.lineBreak
		);
	}
}

export default MarkdownModel;
