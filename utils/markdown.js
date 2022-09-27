import fs from 'node:fs';
import configMarkdownCreate from "../config/markdown.js";

class Markdown{
    static create(path, name) {
        var filePath = path + '\\' + name + '.md'
        console.log(filePath)
        fs.writeFile(filePath, configMarkdownCreate, error => {
            if(error){
                console.log("创建失败"+error)
            }
            else {
                console.log(configMarkdownCreate)
            }
        })
    }
}

export default Markdown;
