// Node JS
import fs from 'node:fs';
import util from 'node:util';
import path from 'node:path';

class MucFile {
	/**
	 * 文件创建
	 * @param path 文件路径
	 * @param data 文件内容
	 */
	createFile(path, data) {
		try {
			if (path.indexOf('/') !== -1) {
				var fileName = path.split('/').pop();
				var dirLen = path.length - fileName.length;
				var filePath = path.substring(0, dirLen);
				this.createDir(filePath);
			}
			fs.writeFile(path, data, error => {
				if (error) {
					console.log('创建失败\n' + error);
				} else {
					console.info('\n文件创建成功！\n' + data);
				}
			});
		} catch (e) {
			console.log('创建失败\n', e);
		}
	}

	/**
	 * 目录创建
	 * @param dirPath 目录路径
	 * @return {boolean}
	 */
	createDir(dirPath) {
		if (fs.existsSync(dirPath)) {
			return true;
		} else {
			if (this.createDir(path.dirname(dirPath))) {
				fs.mkdirSync(dirPath);
				return true;
			}
		}
	}

	/**
	 * 读取文件内容
	 * @param path 文件相对路径
	 * @param type 文件类型
	 * @param encode 文件编码
	 * @return {string} 文件解析内容
	 */
	read(path, type = 'json', encode = 'utf-8') {
		var data = fs.readFileSync(path, encode);
		var res;
		switch (type) {
			case 'json':
				res = JSON.parse(data);
				break;
			default:
				res = data;
		}
		return res;
	}
	/**
	 * 文件修改
	 * @param path 文件路径
	 * @param data 文件内容
	 */
	change(path, data) {
		fs.writeFile(path, data, error => {
			if (error) {
				console.log('文件修改失败！');
				console.log(error);
			} else {
				console.log('文件修改成功！');
			}
		});
	}

	/**
	 * 文件存在检验
	 * @param name 文件名称暨路径
	 * @return {Promise<boolean>} 文件是否存在
	 */
	async fileExistCheck(name) {
		try {
			let stat = await util.promisify(fs.stat)(name);
			return stat.isFile() === true;
		} catch (err) {
			return false;
		}
	}

	/**
	 * 文件覆盖确认
	 * @param path 文件路径
	 * @param data 文件写入数据
	 * @param inq  交互类
	 * @return {Promise<void>} 执行结果
	 */
	async fileRewriteCheck(path, data, inq) {
		if ((await this.fileExistCheck(path)) === true) {
			inq.prompt([
				{
					type: 'confirm',
					message: '文件"' + path + '"已存在，是否覆盖？',
					name: 'choice',
					default: false,
				},
			]).then(rc => {
				if (rc.choice === true) {
					this.createFile(path, data);
				}
			});
		} else {
			this.createFile(path, data);
		}
	}
}

export default MucFile;
