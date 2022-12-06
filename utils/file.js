/**
 * @author: BTMuli<bt-muli@outlook.com>
 * @date: 2022-12-06
 * @description: 文件相关操作
 * @update: 2022-12-06
 */

/* Node */
import fs from 'node:fs';
import util from 'node:util';
import path from 'node:path';

class MucFile {
	/**
	 * 文件创建
	 * @param inputPath 文件路径
	 * @param fileData 文件内容
	 */
	createFile(inputPath, fileData) {
		try {
			/* 判断输入路径是否含目录 */
			if (inputPath.indexOf('/') !== -1) {
				const fileName = inputPath.split('/').pop();
				const dirLen = inputPath.length - fileName.length;
				const filePath = inputPath.substring(0, dirLen);
				this.createDir(filePath);
			}
			/* 创建文件 */
			fs.writeFile(inputPath, fileData, error => {
				if (error) {
					console.log(`\n文件 ${inputPath} 创建失败!\n${error}\n`);
				} else {
					console.log(`\n文件 ${inputPath} 创建成功!\n`);
				}
			});
		} catch (error) {
			console.log(`\n文件 ${inputPath} 创建失败!\n${error}\n`);
		}
	}
	/**
	 * 目录创建
	 * @param dirPath 目录路径
	 * @return boolean 是否创建成功
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
	 * 文件覆写
	 * @param filePath 文件路径
	 * @param fileData 文件内容
	 */
	writeFile(filePath, fileData) {
		fs.writeFileSync(filePath, fileData, error => {
			if (error) {
				console.log(`\n文件 ${filePath} 覆写失败!\n${error}\n`);
			} else {
				console.log(`\n文件 ${filePath} 覆写成功!\n`);
			}
		});
	}
	/**
	 * 文件存在检验
	 * @param fileName 文件名称暨路径
	 * @return {Promise<boolean>} 文件是否存在
	 */
	async fileExist(fileName) {
		try {
			let stat = await util.promisify(fs.stat)(fileName);
			return stat.isFile();
		} catch (error) {
			return false;
		}
	}
}

export default MucFile;
