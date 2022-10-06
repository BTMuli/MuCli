import inquirer from "inquirer";
import MarkdownModel from "../config/markdown.js";
import MucFile from "./file.js";

class Markdown {
    /**
     * 创建新文件
     * @param name 文件名称
     */
    createNew(name) {
        var mucFile = new MucFile()
        inquirer.prompt([
            {type: 'input', message: '请输入文件名称', name: 'title', default: name || 'README'},
            {type: 'input', message: '请输入作者', name: 'author', default: '目棃'},
            {type: 'input', message: '请输入描述', name: 'desc', default: name === 'README' ? '说明文档' : name}
        ]).then(async answers => {
            var mdModel = new MarkdownModel(answers.author, answers.desc)
            var mdPath = answers.title + '.md'
            await mucFile.fileRewriteCheck(mdPath, mdModel.getModel(), inquirer)
        })
    }
}

export default Markdown;
