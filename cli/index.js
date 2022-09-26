import {Command} from 'commander'

const MuCli = new Command();

MuCli
    .version('0.1.1', '-v, --version')
    .description("A Node Cli for personal use by BTMUli.");

MuCli
    .command('hello')
    .description("Say hello for user.")
    .action(() => {
        console.log("Hello MuCli!");
    });

export default MuCli;
