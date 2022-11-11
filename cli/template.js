// Node JS
import { Command } from 'commander';
// MuCli JS
import Template from '../utils/template.js';

const template = new Command();

// Base info
template
	.name('tpl')
	.description('A SubCommand within MuCli for template')
	.version('0.0.1', '-sv');

export default template;
