import fs from "node:fs";
import util from "util";

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
}

export default MucFile
