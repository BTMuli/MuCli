import YAML from 'yamljs';
import MucFile from "./file.js";

class MucYaml{
    constructor() {
        this.configPath = './config_default/config.yml'
        this.mucFile = new MucFile()
    }

    yamlRead(path){
        return YAML.load(path)
    }

    yamlDetailRead(data, args){
        var yamlRead = data
        args.forEach(value => {
            console.log(value)
            yamlRead = yamlRead[value]
        })
        return yamlRead
    }

    /**
     * 修改 yaml 文件某属性值 todo 待检验
     * @param path yaml 文件路径
     * @param args 要修改属性位置
     * @param key  要修改属性名称
     * @param val  要修改属性值
     */
    yamlChange(path, args, key, val){
        var yamlOri = this.yamlRead(path)
        yamlOri[args][key] = val
        this.mucFile.change(path, yamlOri)
    }
}

export default MucYaml
