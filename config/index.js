import MucYaml from "../utils/yaml.js";

class Config{
    constructor() {
        this.configPath = './config_default/config.yml'
        this.mucYaml = new MucYaml()
    }

    readConfig(){
        return this.mucYaml.yamlRead(this.configPath)
    }

    readDetailConfig(...args){
        var configRead = this.readConfig()
        configRead = this.mucYaml.yamlDetailRead(configRead, args)
        return configRead
    }
    // 按需加载
    doConfig(cmd){
        var cmdConfig = this.readDetailConfig('Commands', cmd.name())
        return cmdConfig['enable'] === true;
    }
    // 修改 yml todo 待检验
    transConfig(val, cmd, ...args){
        this.mucYaml.yamlChange(this.configPath, args, cmd, val)
    }
}

export default Config
