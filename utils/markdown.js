import inquirer from "inquirer";
import MarkDownModel from "../config/markdown.js";
import MucFile from "./file.js";

class Markdown {
    createNew(name) {
        var mucFile = new MucFile()
        inquirer.prompt([
            {type: 'input', message: '请输入文件名称', name: 'title', default: name || 'README'},
            {type: 'input', message: '请输入作者', name: 'author', default: '目棃'},
            {type: 'input', message: '请输入描述', name: 'desc', default: name === 'README' ? '说明文档' : name}
        ]).then(async answers=> {
            var mdModel = new MarkDownModel(answers.author, answers.desc)
            var mdPath = answers.title + '.md'
            if (await mucFile.fileExistCheck(mdPath)===true) {
                inquirer.prompt([{
                    type: 'confirm',
                    message: '文件' + mdPath + '已存在,是否覆盖?',
                    name: 'rwChoice',
                    default: false
                }]).then(rwc => {
                    if (rwc.rwChoice===true) {
                        mucFile.create(mdPath, mdModel.getModel())
                    }
                })
            } else {
                mucFile.create(mdPath, mdModel.getModel())
            }
        })
    }
}

export default Markdown;
