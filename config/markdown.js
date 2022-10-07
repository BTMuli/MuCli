import {format} from 'silly-datetime';

class MarkdownModel {
    sign = "---"
    quote = "> 本文档由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于"

    // 构造函数，相当于 py 中的  __init__()
    constructor(author, desc) {
        this.author = author
        this.description = desc
    }

    /**
     * 获取默认写入内容
     * @return {string}
     */
    getModel() {
        var dateNow = format(new Date(), 'YYYY-MM-DD');
        return this.sign + "\n" +
            "Date: " + dateNow + "\n" +
            "Update: " + dateNow + "\n" +
            "Author: " + this.author + "\n" +
            "Description: " + this.description + "\n" +
            this.sign + "\n" + "\n" +
            this.quote + "\n" +
            "`" + format(new Date(), 'YYYY-MM-DD HH:mm:ss') + "`";
    }
}

export default MarkdownModel
