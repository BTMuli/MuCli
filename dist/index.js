#!/usr/bin/env node
import n from"process";import{__awaiter as e,__generator as o}from"tslib";import{exec as r}from"child_process";import t from"chalk";import{Command as i}from"commander";import c from"fs-extra";import a from"ora";import m from"yamljs";import{resolve as s}from"path";import u from"app-root-path";import d from"inquirer";var l;function v(){var n=u.resolve("package.json");return c.readJSONSync(n)}function p(n){return v().subVersion[n]}function f(n){void 0===n&&(n=!1);var e=u.resolve("config"),o=s(e,"default.yml");if(n)return o;var r=m.load(o).update,t=s(e,"user.yml");return c.existsSync(t)||c.copyFileSync(o,t),m.load(t).update<r&&c.copyFileSync(o,t),t}!function(n){n.dev="dev",n.mmd="mmd"}(l||(l={}));var h=new i("dev"),b=p(l.dev);h.name("dev").description("A cli tool for devtools").version(b,"-sv, --subversion"),h.command("run [script]").description("run pnpm script").action((function(n){return e(void 0,void 0,void 0,(function(){var e,i,c,m;return o(this,(function(o){var s;if(e="build",s=v(),i=Object.keys(s.scripts),void 0!==n){if(!i.includes(n))return a("Scripts: ".concat(t.blue(n)," not found")).fail(),[2];e=n}return c="pnpm ".concat(e),m=a("Running scripts: ".concat(t.blue(c))).start(),r("pnpm ".concat(e),{cwd:u.path},(function(n,e,o){var r="";null!==n&&(r=n.message),null!==o&&(r=o),null!==n?(""===r&&(r=e),r="Scripts: ".concat(t.blue(c)," run failed\n").concat(t.red(r)),m.fail(r)):(r="Scripts: ".concat(t.blue(c)," successfully"),m.succeed(r)),m.stop()})),[2]}))}))})),h.command("update").description("update config file").action((function(){var n=f(!0),e=m.load(n);e.update=Math.floor(Date.now()/1e3),c.writeFileSync(n,m.stringify(e,4,2))}));var y=new i("mmd"),g=p(l.mmd);function w(n){void 0===n&&(n=!1);var e=f(n);return m.load(e)}function S(){var n=w(),e=[];return n.dev.enable&&e.push("dev"),n.mmd.enable&&e.push("mmd"),e}y.name("mmd").description("A cli tool for markdown").version(g,"-sv, --subversion");var k=new i;k.name("muc").description(v().description).version(v().version,"-v, --version"),k.command("set").description("set subcommand on or off").action((function(){return e(void 0,void 0,void 0,(function(){var n,r,t;return o(this,(function(i){switch(i.label){case 0:return n=["dev","mmd"],r=S(),t=n.map((function(n){return r.includes(n)?{name:n,value:n,checked:!0}:{name:n,value:n,checked:!1}})),[4,d.prompt([{type:"checkbox",name:"command",message:"Please select the subcommand you want to open",choices:t}]).then((function(n){return e(void 0,void 0,void 0,(function(){return o(this,(function(e){return function(n){var e=w();e.dev.enable=n.includes("dev"),e.mmd.enable=n.includes("mmd");var o=f();c.writeFileSync(o,m.stringify(e,4,2))}(n.command),[2]}))}))}))];case 1:return i.sent(),[2]}}))}))})),function(n,e){for(var o=S(),r=0,t=e;r<t.length;r++){var i=t[r];o.includes(i.name())&&n.addCommand(i)}}(k,[y,h]),k.parse(n.argv);
