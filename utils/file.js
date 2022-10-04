import fs from "node:fs";
import util from "node:util";

class MucFile{
    create(path, data){
        fs.writeFile(path, data, error => {
            if (error) {
                console.log("创建失败" + error)
            } else {
                console.info("\n文件创建成功！\n" + data)
            }
        })
    }

    async fileExistCheck(name) {
        try {
            let stat = await util.promisify(fs.stat)(name);
            return stat.isFile() === true
        } catch (err) {
            return false
        }
    }

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
