import fs from "node:fs";
import util from "node:util";

class MucFile{
    /**
     * 文件创建
     * @param path 文件路径
     * @param data 文件内容
     */
    create(path, data){
        fs.writeFile(path, data, error => {
            if (error) {
                console.log("创建失败" + error)
            } else {
                console.info("\n文件创建成功！\n" + data)
            }
        })
    }

    /**
     * 文件修改
     * @param path 文件路径
     * @param data 文件内容
     */
    change(path, data){
        fs.writeFile(path, data, error =>{
            if (error){
                console.log("文件修改失败！")
                console.log(error)
            } else {
                console.log("文件修改成功！")
            }
        })
    }

    /**
     * 文件存在检验
     * @param name 文件名称暨路径
     * @return {Promise<boolean>} 文件是否存在
     */
    async fileExistCheck(name) {
        try {
            let stat = await util.promisify(fs.stat)(name);
            return stat.isFile() === true
        } catch (err) {
            return false
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
        if (await this.fileExistCheck(path) === true) {
            inq.prompt([{
                type: 'confirm',
                message: '文件\"' + path + '\"已存在，是否覆盖？',
                name: 'choice',
                default: false
            }]).then(rc => {
                if (rc.choice === true) {
                    this.create(path, data)
                }
            })
        } else {
            this.create(path, data)
        }
    }
}

export default MucFile
