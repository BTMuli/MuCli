// Default Commander
import {Command} from "commander";
// Personal SubCommand
import markdown from "./markdown.js";
import subCommand from "./SubCommand.js";

const MuCli = new Command()

// Base info
MuCli
    .name('MuCli')
    .version('0.2.8', '-v, --version')
    .description("A Node Cli for Personal Use by BTMUli.");

// Commands add
MuCli
    .addCommand(markdown)
    .addCommand(subCommand)

export default MuCli;
