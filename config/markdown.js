import moment from 'moment';

class MarkDownModel {
    sign = "---"
    quote = "> 本文档由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于 `" + moment(Date.now()).format('YYYY-MM-DD HH:MM:SS') + "`"

    // 构造函数，相当于 py 中的  __init__()
    constructor(author, desc) {
        this.author = author
        this.description = desc
    }

    getModel() {
        let dateNow = moment(Date.now()).format('YYYY-MM-DD');
        return this.sign + "\n" +
            "Date: " + dateNow + "\n" +
            "Update: " + dateNow + "\n" +
            "Author: " + this.author + "\n" +
            "Description: " + this.description + "\n" +
            this.sign + "\n" + "\n" +
            this.quote + "\n";
    }
}

export default MarkDownModel
