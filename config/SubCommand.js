import MucConfig from "../config.js";

class SubCommandModel {
    // 项目根目录
    rootDir = MucConfig.getPath()

    // 初始化命令
    constructor(name, command, desc) {
        this.name = name
        this.command = command
        this.description = desc
    }

    // 字符串替换
    transCommand(name) {
        return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase()
    }

    // 构造几个文件
    getFilesPath() {
        var fileName = this.name + '.js'
        var cliPath = this.rootDir + '\\cli\\' + fileName
        var configPath = this.rootDir + '\\config\\' + fileName
        var utilsPath = this.rootDir + '\\utils\\' + fileName
        return {cliPath, configPath, utilsPath}
    }

    // 根据类型返回文件内容
    getModel(key) {
        switch (key) {
            case 'cliPath':
                return this.getCliModel()
            case 'configPath':
                return this.getConfigModel()
            case 'utilsPath':
                return this.getUtilsModel()
            default:
                return false
        }
    }

    // Cli 目录文件，负责 command 对应命令
    getCliModel() {
        var fileName = this.name + '.js'
        var clsName = this.transCommand(this.name)
        return "//此文件由 MuCli 自动生成\n" +
            "import {Command} from \"commander\";\n" +
            "import " + clsName + " from \"../utils/" + fileName + "\";\n\n" +
            "const " + this.name + "= new Command();\n\n" +
            "// Base info\n" +
            this.name + "\n" +
            "    .name('" + this.command + "')\n" +
            "    .description('" + this.description + "')\n" +
            "    .version('0.0.1', '-sv')\n\n" +
            "export default " + this.name + ";\n"
    }

    // Config 目录文件，负责 Model 构建
    getConfigModel() {
        var clsName = this.transCommand(this.name)
        return "//此文件由 MuCli 自动生成\n" +
            "class " + clsName + "Model {\n\n}\n\n" +
            "export default " + clsName + "Model;"
    }

    // Utils 目录文件，负责交互
    getUtilsModel() {
        var fileName = this.name + '.js'
        var clsName = this.transCommand(this.name)
        return "//此文件由 MuCli 自动生成\n" +
            "import inquirer from \"inquirer\";\n" +
            "import " + clsName + "Model from \"../config/" + fileName + "\";\n" +
            "import MucFile from \"./file.js\";\n\n" +
            "class " + clsName + "{\n\n}\n\n" +
            "export default " + clsName + ";"
    }
}

export default SubCommandModel
