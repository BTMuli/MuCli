// Default Commander
import {Command} from "commander";
// Config file
import Config from "../config/index.js";
// Personal SubCommand
import markdown from "./markdown.js";
import subCommand from "./SubCommand.js";
import bangumi from "./bangumi.js";

const MuCli = new Command()

// Base info
MuCli
    .name('muc')
    .version('0.3.0', '-v, --version')
    .description("A Node Cli for Personal Use by BTMUli.");

/**
 * 检验权限然后添加命令
 * @param cmd 命令
 */
function setCommand(...cmd) {
    var config = new Config()
    cmd.forEach(value => {
        if (config.doConfig(value))
            MuCli.addCommand(value)
    })
}

// Commands add
setCommand(markdown, subCommand, bangumi)

export default MuCli;
