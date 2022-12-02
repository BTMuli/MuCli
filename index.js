// MuCli JS
import MuCli from './cli/index.js';
// Config
import Config from './config/index.js';
// SubCommand
import markdown from './cli/markdown.js';
import subCommand from './cli/SubCommand.js';
import template from './cli/template.js';
import pip from './cli/pip.js';

// Read command line arguments
const cmd = process.argv;

// Load config
const muc = new Config();

// Load subCommand and setting
muc.setConfig(MuCli, markdown, subCommand, template, pip);

// Parse command line arguments
MuCli.parse(cmd);
