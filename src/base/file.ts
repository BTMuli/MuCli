/**
 * @author BTMuli<bt-muli@outlook.com>
 * @description 文件操作相关
 * @version 0.7.2
 */

/* Node */
import { existsSync, mkdirSync, readFile, stat, writeFile, rename } from "fs";
import { dirname } from "path";
import { promisify } from "util";

class FileBase {
	/**
	 * @description 创建目录
	 * @param dirPath {string} 目录路径
	 * @return {boolean} 是否创建成功
	 */
	createDir(dirPath: string): boolean {
		if (existsSync(dirPath)) {
			return true;
		} else {
			if (this.createDir(dirname(dirPath))) {
				mkdirSync(dirPath);
				return true;
			}
		}
	}

	/**
	 * @description 创建文件
	 * @param inputPath {string} 文件路径
	 * @param fileData {string} 文件内容
	 * @return {void}
	 */
	createFile(inputPath: string, fileData: string): void {
		try {
			if (inputPath.indexOf("/") !== -1) {
				const fileName: string = inputPath.split("/").pop();
				const dirLen: number = inputPath.length - fileName.length;
				const filePath: string = inputPath.substring(0, dirLen);
				this.createDir(filePath);
			}
			writeFile(inputPath, fileData, err => {
				if (err) {
					console.log(`\n文件 ${inputPath} 创建失败！\n${err}`);
				} else {
					console.log(`\n文件 ${inputPath} 创建成功！`);
				}
			});
		} catch (error) {
			console.log(`\n文件 ${inputPath} 创建失败！\n${error}`);
		}
	}

	/**
	 * @description 文件覆写
	 * @param filePath {string} 文件路径
	 * @param fileData {string} 文件内容
	 * @return {void}
	 */
	updateFile(filePath: string, fileData: string): void {
		// 将文件写入到 filePath.new 中
		writeFile(`${filePath}.new`, fileData, err => {
			if (err) {
				console.log(`\n文件 ${filePath} 覆写失败！\n${err}`);
			} else {
				// 将 filePath.new 重命名为 filePath
				rename(`${filePath}.new`, filePath, err => {
					if (err) {
						console.log(`\n文件 ${filePath} 覆写失败！\n${err}`);
					}
				});
				console.log(`\n文件 ${filePath} 覆写成功！`);
			}
		});
	}

	/**
	 * @description 文件存在校验
	 * @param filePath {string} 文件路径
	 * @return {Promise<boolean>} 是否存在
	 */
	async fileExist(filePath: string): Promise<boolean> {
		try {
			const status = await promisify(stat)(filePath);
			return status.isFile();
		} catch (error) {
			return false;
		}
	}

	/**
	 * @description 读取文件前 n 行
	 * @param filePath {string} 文件路径
	 * @param lineNum {number} 行数
	 * @return {Promise<array<string>>} 文件内容
	 */
	async readLine(filePath: string, lineNum: number): Promise<Array<string>> {
		try {
			const fileData = await promisify(readFile)(filePath, "utf-8");
			const lineSeparator =
				fileData.indexOf("\r\n") !== -1 ? "\r\n" : "\n";
			const fileLine = fileData.split(lineSeparator);
			const fileLineNum = fileLine.length;
			return fileLine.slice(
				0,
				lineNum > fileLineNum ? fileLineNum : lineNum
			);
		} catch (error) {
			console.log(`\n文件 ${filePath} 读取失败！\n${error}`);
		}
	}

	/**
	 * @description 从文件第 n 行开始插入内容
	 * @param filePath {string} 文件路径
	 * @param lineNum {number} 行数
	 * @param insertData {string} 插入内容
	 * @return {Promise<boolean>} 是否插入成功
	 */
	async insertLine(
		filePath: string,
		lineNum: number,
		insertData: string
	): Promise<boolean> {
		try {
			const fileData = await promisify(readFile)(filePath, "utf-8");
			const lineSeparator =
				fileData.indexOf("\r\n") !== -1 ? "\r\n" : "\n";
			const fileLine = fileData.split(lineSeparator);
			const fileLineNum = fileLine.length;
			if (fileLineNum >= lineNum) {
				fileLine.splice(lineNum, 0, insertData + lineSeparator);
				this.updateFile(filePath, fileLine.join(lineSeparator));
				return true;
			} else {
				console.log(`\n文件 ${filePath} 行数不足！`);
				return false;
			}
		} catch (error) {
			console.log(`\n文件 ${filePath} 插入失败！\n${error}`);
			return false;
		}
	}

	/**
	 * @description 覆盖文件前 n 行
	 * @param filePath {string} 文件路径
	 * @param lineNum {number} 行数
	 * @param coverData {string} 覆盖内容
	 * @return {Promise<boolean>} 是否覆盖成功
	 */
	async updateLine(
		filePath: string,
		lineNum: number,
		coverData: string
	): Promise<boolean> {
		try {
			const fileData = await promisify(readFile)(filePath, "utf-8");
			const lineSeparator =
				fileData.indexOf("\r\n") !== -1 ? "\r\n" : "\n";
			const fileLine = fileData.split(lineSeparator);
			const fileLineNum = fileLine.length;
			if (fileLineNum >= lineNum) {
				fileLine.splice(0, lineNum, coverData);
				this.updateFile(filePath, fileLine.join(lineSeparator));
				return true;
			} else {
				console.log(`\n文件 ${filePath} 行数不足！`);
				return false;
			}
		} catch (error) {
			console.log(`\n文件 ${filePath} 覆盖失败！\n${error}`);
			return false;
		}
	}
}

export default FileBase;
