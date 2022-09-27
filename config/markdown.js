import moment from 'moment';

const sign = "---"

const dateNow = moment(Date.now()).format('YYYY-MM-DD')

const author = "目棃"

const description = "说明文档"

const configMarkdownCreate =
    sign + "\n" +
    "Date: " + dateNow + "\n" +
    "Update: " + dateNow + "\n" +
    "Author: " + author + "\n" +
    "Description: " + description + "\n" +
    sign + "\n";

export default configMarkdownCreate
