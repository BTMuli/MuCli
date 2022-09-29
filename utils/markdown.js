import fs from 'node:fs';
import inquirer from "inquirer";
import MarkDownModel from "../config/markdown.js";

class Markdown {
    static createNew(name) {
        inquirer.prompt([
            {type: 'input', message: '请输入文件名称', name: 'title', default: name || 'README'},
            {type: 'input', message: '请输入作者', name: 'author', default: '目棃'},
            {type: 'input', message: '请输入描述', name: 'desc', default: '说明文档'}
        ]).then(answers => {
            var mdModel = new MarkDownModel(answers.author, answers.desc)
            var mdPath = answers.title + '.md'
            if (this.fileExistCheck(mdPath)) {
                inquirer.prompt([{
                    type: 'confirm',
                    message: '文件' + mdPath + '已存在,是否覆盖?',
                    name: 'rwChoice',
                    default: 'n'
                }])
                    .then(rwc => {
                        if (rwc.rwChoice) {
                            fs.writeFile(mdPath, mdModel.getModel(), error => {
                                if (error) {
                                    console.log("创建失败" + error)
                                } else {
                                    console.log("文件创建成功！\n" + mdModel.getModel())
                                }
                            })
                        }
                    })
            }
        })
    }

    static fileExistCheck(name) {
        let checkRes = true
        fs.access(name, fs.constants.F_OK, err => {
            checkRes = !err;
        })
        return checkRes
    }
}

export default Markdown;
