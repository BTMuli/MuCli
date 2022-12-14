/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 子命令 mmd 相关模型
 * @update: 2021-12-14
 */

/* Node */
import { format } from 'silly-datetime';

class MarkdownModel {
	sign = '---';
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
		/* eslint-disable */
		return (
			this.sign + '\n' +
            'Date: ' + dateNow + '\n' +
            'Update: ' + dateNow + '\n' +
            'Author: ' + this.author + '\n' +
            'Description: ' + this.description + '\n' +
            this.sign + '\n' + '\n' +
            this.quote + '\n' +
            '`' + format(new Date(), 'YYYY-MM-DD HH:mm:ss') + '`'
		);
		/* eslint-disable */
	}
}

export default MarkdownModel;
