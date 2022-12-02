// Node JS
import { Command } from "commander";
// MuCli JS
import Pip from "../utils/pip.js";
import { exec } from 'child_process';

const pip= new Command();

// Base info
pip
    .name('pip')
    .description('A SubCommand within MuCli for pip')
    .version('0.0.1', '-sv')

pip
	.command('install')
	.description('install package')
	// 无参数接受后面的内容
	.option('-p, --package [package]', 'install package')
	.option('-r, --requirement [requirement]', 'install requirement')
	.action(args => {
		let sh_str = 'pip install -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com'
		if(args.package){
			exec(sh_str + ' ' + args.package, (error, stdout, stderr) => {
				if (error) {
					console.error(`执行的错误: ${error}`);
					return;
				}
				console.log(`stdout: ${stdout}`);
				console.log(`stderr: ${stderr}`);
			});
		}else if(args.requirement){
			exec(sh_str + ' -r ' + args.requirement, (error, stdout, stderr) => {
				if (error) {
					console.error(`执行的错误: ${error}`);
					return;
				}
				console.log(`stdout: ${stdout}`);
				console.log(`stderr: ${stderr}`);
			});
		}
	});
export default pip;
