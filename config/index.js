import {resolve} from "node:path";

// 本地 Node 应用，运行时根据实际情况修改
// todo 这个 github workflow 做 test 的时候过不了
const NODE_PATH = "E:\\Code\\Environment\\nodejs\\node.exe";
const Muc_PATH = resolve('./')

const configAll = [NODE_PATH, Muc_PATH]

export default configAll
