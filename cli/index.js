import {Command} from "commander";
import markdown from "./markdown.js";

const MuCli = new Command()

// Base info
MuCli
    .name('MuCli')
    .version('0.2.6', '-v, --version')
    .description("A Node Cli for Personal Use by BTMUli.");

// Command add mmd
MuCli
    .addCommand(markdown)

export default MuCli;
