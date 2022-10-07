import inquirer from "inquirer";
import MarkdownModel from "../config/markdown.js";
import MucFile from "./file.js";
import Config from "../config/index.js";

var markdownConfig = new Config().readDetailConfig('Commands', 'mmd')

class Markdown {
    constructor() {
        this.authorDefault = markdownConfig.default.author
        this.fileDefault = markdownConfig.default.filename
        this.descDefault = markdownConfig.default.description
    }

    /**
     * 创建新文件
     * @param name 文件名称
     */
    createNew(name) {
        var mucFile = new MucFile()
        inquirer.prompt([
            {type: 'input', message: '请输入文件名称', name: 'title', default: name || this.fileDefault},
            {type: 'input', message: '请输入作者', name: 'author', default: this.authorDefault},
            {
                type: 'input',
                message: '请输入描述',
                name: 'desc',
                default: name === this.fileDefault ? this.descDefault : name
            }
        ]).then(async answers => {
            var mdModel = new MarkdownModel(answers.author, answers.desc)
            var mdPath = answers.title + '.md'
            await mucFile.fileRewriteCheck(mdPath, mdModel.getModel(), inquirer)
        })
    }
}

export default Markdown;
