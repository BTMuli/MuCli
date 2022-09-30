import fs from "node:fs";

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
}

export default MucFile
