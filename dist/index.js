#!/usr/bin/env node
import e from"process";import{__awaiter as t,__generator as n,__spreadArray as r}from"tslib";import{exec as a}from"child_process";import i from"axios";import o from"chalk";import{Command as c}from"commander";import s from"inquirer";import u from"ora";import{resolve as l}from"path";import d from"app-root-path";import m from"fs-extra";import p from"yamljs";import f from"assert";var v;function h(){return d.path.endsWith("dist")?d.resolve("../"):d.path}function y(){var e=l(h(),"package.json");return m.readJSONSync(e)}function b(e){return y().subVersion[e]}function g(e){void 0===e&&(e=!1);var t=l(h(),"config"),n=l(t,"default.yml");if(e)return n;var r=p.load(n).update,a=l(t,"user.yml");return m.existsSync(a)||m.copyFileSync(n,a),p.load(a).update<r&&m.copyFileSync(n,a),a}function w(e){void 0===e&&(e=!1);var t=g(e);return p.load(t)}function S(){var e=w(),t=[];return e.dev.enable&&t.push("dev"),e.mmd.enable&&t.push("mmd"),t}!function(e){e.dev="dev",e.mmd="mmd"}(v||(v={}));var F=new c,D=y().version;F.name("muc").description(y().description).version(D,"-v, --version"),F.command("set").description("set subcommand on or off").action((function(){return t(void 0,void 0,void 0,(function(){var e,r,a;return n(this,(function(i){switch(i.label){case 0:return e=["dev","mmd"],r=S(),a=e.map((function(e){return r.includes(e)?{name:e,value:e,checked:!0}:{name:e,value:e,checked:!1}})),[4,s.prompt([{type:"checkbox",name:"command",message:"Please select the subcommand you want to open",choices:a}]).then((function(e){return t(void 0,void 0,void 0,(function(){return n(this,(function(t){return function(e){var t=w();t.dev.enable=e.includes("dev"),t.mmd.enable=e.includes("mmd");var n=g();m.writeFileSync(n,p.stringify(t,4,2))}(e.command),[2]}))}))}))];case 1:return i.sent(),[2]}}))}))})),F.command("update").description("check and update from upstream").action((function(){return t(void 0,void 0,void 0,(function(){var e,t,r,c;return n(this,(function(n){switch(n.label){case 0:return e=u("Checking update...").start(),[4,i.get("https://registry.npmjs.org/@btmuli/mucli")];case 1:return t=n.sent().data,r=t["dist-tags"].latest,D<r?(e.stop(),[4,s.prompt([{type:"confirm",name:"update",message:"There is a new version ".concat(o.blue(r),", update?"),default:!0}])]):[3,3];case 2:return!0===n.sent().update&&(c=u("Updating...").start(),a("npm i -g @btmuli/mucli",(function(e,t,n){var r="";null!==e&&(r=e.message),null!==n&&""!==n&&(r=""===r?n:"".concat(r,"\n").concat(n)),""!==r?(r="Updated failed\n".concat(o.red(r,t)),c.fail(r)):(r="Updated successfully",c.succeed(r)),c.stop()}))),[3,4];case 3:e.succeed("MuCli is latest!"),n.label=4;case 4:return[2]}}))}))})),F.command("test [url]").option("-t, --timeout <timeout>","set the timeout of request","10").description("test the time to request the site").action((function(e,r){return t(void 0,void 0,void 0,(function(){var t,a,c,s,l,d;return n(this,(function(n){return t=e,a=parseInt(r.timeout),void 0===t&&(t="https://www.github.com"),void 0===a&&(a=10),c="Testing Website Response Time for ".concat(o.blue(t)),s=u("".concat(c," 0.00/").concat(a)).start(),l="0.00",d=setInterval((function(){l===a.toString()?clearInterval(d):l=(parseFloat(l)+.1).toFixed(1),s.text="".concat(c," ").concat(l,"/").concat(a)}),100),i.get(t,{timeout:1e3*a}).then((function(e){clearInterval(d),s.succeed("Response Time: ".concat(o.blue(e.headers["x-response-time"])))})).catch((function(e){clearInterval(d),s.fail("Request failed, cost time: ".concat(o.red(l),"s"))})),[2]}))}))}));var k=new c("dev"),x=b(v.dev);function A(){return t(this,void 0,void 0,(function(){var e;return n(this,(function(t){switch(t.label){case 0:return[4,s.prompt([{type:"list",name:"type",message:"What do you want to do about label?",choices:[{name:"See all labels",value:"see"},{name:"Create a new label",value:"create"},{name:"Update a label",value:"update"},{name:"Delete label(s)",value:"delete"},{name:"Do nothing",value:"nothing"}]}])];case 1:switch(e=t.sent(),e.type){case"see":return[3,2];case"create":return[3,4];case"update":return[3,6];case"delete":return[3,8];case"nothing":return[3,10]}return[3,11];case 2:return[4,M()];case 3:case 5:case 7:case 9:return t.sent(),[3,11];case 4:return[4,C()];case 6:return[4,T()];case 8:return[4,j()];case 10:return[3,11];case 11:return[2]}}))}))}function E(e){return"[filename] ".concat(o.yellow(e.filename)," [author] ").concat(o.yellow(e.author)," [description] ").concat(o.yellow(e.description))}function M(){return t(this,void 0,void 0,(function(){var e,t,r,a,i,c;return n(this,(function(n){if(e=w(),t=e.mmd.defaultLabel,console.log(o.green("Default label:"),E(t)),r=e.mmd.labels,console.log(o.green("Custom labels:")),0===r.length)return console.log(o.yellow("\tNo custom labels")),[2];for(a=0,i=r;a<i.length;a++)c=i[a],console.log("\t",E(c));return[2]}))}))}function C(e){return t(this,void 0,void 0,(function(){var t,r,a,i,o,c,l;return n(this,(function(n){switch(n.label){case 0:return t=w(),r=t.mmd.labels,a=t.mmd.defaultLabel,[4,s.prompt([{type:"input",name:"filename",message:"Filename:",default:null!=e?e:""}])];case 1:return(i=n.sent())===a.filename||r.some((function(e){return e.filename===i.filename}))?(i.filename===a.filename&&u("The label is already exists as the default label!").fail(),void 0===(o=r.find((function(e){return e.filename===i.filename})))?[2]:[4,s.prompt([{type:"confirm",name:"confirm",message:"The label already exists, do you want to update the label ?\n".concat(E(o))}])]):[3,4];case 2:return!1===(c=n.sent()).confirm?[2]:[4,T(i.filename)];case 3:return n.sent(),[3,7];case 4:return[4,s.prompt([{type:"input",name:"author",message:"Author:"},{type:"input",name:"description",message:"Description:"}])];case 5:return c=n.sent(),l={filename:i.filename,author:c.author,description:c.description},[4,s.prompt([{type:"confirm",name:"confirm",message:"Do you want to create the label ?\n".concat(E(l))}])];case 6:if(!1===n.sent().confirm)return[2];r.push(l),t.mmd.labels=r,m.writeFileSync(g(),p.stringify(t,4,2)),n.label=7;case 7:return[2]}}))}))}function T(e,r){return t(this,void 0,void 0,(function(){var t,r,a,i,o,c;return n(this,(function(n){switch(n.label){case 0:return[4,s.prompt([{type:"input",name:"input",message:"Please input the filename of the label you want to update:",default:null!=e?e:""}])];case 1:return t=n.sent(),r=w().mmd.labels,a=r.find((function(e){return e.filename=t.input})),0!==r.length&&void 0!==a?[3,4]:[4,s.prompt([{type:"confirm",name:"confirm",message:"The label is not exist yet, create a new ?",default:!0}])];case 2:return!1===(i=n.sent()).confirm?[2]:[4,C(t.input)];case 3:return n.sent(),[3,7];case 4:return f(void 0!==a),[4,s.prompt([{type:"input",name:"author",message:"Author: ",default:a.author},{type:"input",name:"description",message:"Description: ",default:a.description}])];case 5:return i=n.sent(),o={filename:t.input,author:i.author,description:i.description},[4,s.prompt([{type:"confirm",name:"confirm",message:"Are you sure to update ?\n\tOld: ".concat(E(a),"\n\tNew:").concat(E(o))}])];case 6:if(!1===n.sent())return[2];r.forEach((function(e){e.filename===t.input&&(e=o)})),(c=w()).mmd.labels=r,m.writeFileSync(g(),p.stringify(c,4,2)),n.label=7;case 7:return[2]}}))}))}function j(){return t(this,void 0,void 0,(function(){var e,t,r,a,i;return n(this,(function(n){switch(n.label){case 0:return 0===(e=w().mmd.labels).length?(u("No custom labels").fail(),[2]):(t=e.map((function(e){return{name:e.filename,value:e.filename,checked:!1}})),[4,s.prompt([{type:"checkbox",name:"filename",message:"Which label(s) do you want to delete ?",choices:t}])]);case 1:return r=n.sent(),[4,s.prompt([{type:"confirm",name:"confirm",message:"Are you sure to delete these labels ?"}])];case 2:return!1===n.sent().confirm||(a=[],e.forEach((function(e){!1===r.filename.includes(e.filename)&&a.push(e)})),(i=w()).mmd.labels=a,m.writeFileSync(g(),p.stringify(i,4,2)),u("Delete successfully").succeed()),[2]}}))}))}function I(e){var t=new Date,n=t.getFullYear().toString().padStart(4,"0"),r=(t.getMonth()+1).toString().padStart(2,"0"),a=t.getDate().toString().padStart(2,"0"),i=t.getHours().toString().padStart(2,"0"),o=t.getMinutes().toString().padStart(2,"0"),c=t.getSeconds().toString().padStart(2,"0");return!0===e?"".concat(n,"-").concat(r,"-").concat(a," ").concat(i,":").concat(o,":").concat(c):"".concat(n,"-").concat(r,"-").concat(a)}function R(e){var t="./README.md";return void 0!==e&&(t=e.endsWith(".md")?e:e+=".md"),t}function U(e){return e.includes("\\")?e.split("\\").pop():e.includes("/")?e.split("/").pop():e}function W(e,t,n){var r=l(h(),"template","MuCli","README.md"),a=m.readFileSync(r,"utf-8"),i=I(!1),o=I(!0),c=a.split("\n");return c.forEach((function(r,a){var s;if(1===a&&(s=r.replace("author",e),c[a]=s),2===a&&(s=r.replace("description",t),c[a]=s),4===a&&(s=r.replace("update",i),c[a]=s),9===a&&(s=r.replace("modify",o),c[a]=s),7===a&&(s=void 0!==n?r.replace("create",n):r.replace("create",o),c[a]=s),3===a){if(void 0!==n){var u=n.split(" ")[0];s=r.replace("date",u)}else s=r.replace("date",i);c[a]=s}})),c.join("\n")}function q(e){var t;if(void 0===e)t="README.md";else if(e.includes(".")){if("md"!==e.split(".").pop())return!1;t=e}else t="".concat(e,".md");if(!m.existsSync(t))return!1;var n=m.readFileSync(t,"utf-8").split("\n"),r={author:"",description:"",date:"",update:"",create:"",modify:""};for(var a in n.forEach((function(e,t){1===t&&(r.author=e.split("Author: ")[1].trim()),2===t&&(r.description=e.split("Description: ")[1].trim()),3===t&&(r.date=e.split("Date: ")[1].trim()),4===t&&(r.update=e.split("Update: ")[1].trim()),7===t&&(r.create=e.split("`")[3]),9===t&&(r.modify=e.split("`")[1])})),r){var i=r[a];if(""===i||void 0===i)return!1}return r}function N(e){return t(this,void 0,void 0,(function(){var t,r,a,i;return n(this,(function(n){switch(n.label){case 0:return t=U(e),[4,s.prompt([{type:"input",name:"title",message:"Title:",default:t}])];case 1:return r=n.sent(),a=function(e){var t=w().mmd,n=t.defaultLabel,r=t.labels.find((function(t){return t.filename===e}));return void 0===r&&(r=n),r}(r.title),[4,s.prompt([{type:"input",name:"author",message:"Author:",default:a.author},{type:"input",name:"description",message:"Description:",default:a.description}])];case 2:return i=n.sent(),[2,{filename:r.title,author:i.author,description:i.description}]}}))}))}function L(e){return t(this,void 0,void 0,(function(){var t,r,a,i,c,l,d;return n(this,(function(n){switch(n.label){case 0:return t=U(e),m.existsSync(e)?(r=q(e),a=[{name:"Create new file",value:"create"}],!1!==r?a.unshift({name:"Update frontmatter",value:"update"}):a.unshift({name:"Insert frontmatter",value:"insert"}),[4,s.prompt([{type:"list",name:"action",message:"File ".concat(o.yellow(t)," already exists, what do you want to do?"),choices:a,default:!1===r?"insert":"update"}])]):[3,7];case 1:switch(i=n.sent(),i.action){case"update":return[3,2];case"insert":return[3,4];case"create":return[3,6]}return[3,7];case 2:return[4,O(e)];case 3:case 5:return n.sent(),[2];case 4:return[4,P(e)];case 6:return[3,7];case 7:return[4,N(e)];case 8:return c=n.sent(),l=u("Creating markdown file").start(),d=W(c.author,c.description),m.createFileSync(e),m.writeFileSync(e,d),l.succeed("Markdown file created"),[2]}}))}))}function O(e){return t(this,void 0,void 0,(function(){var t,a,i,c,l;return n(this,(function(n){switch(n.label){case 0:return t=U(e),!1!==(a=q(e))?[3,4]:[4,s.prompt([{type:"confirm",name:"create",message:"Frontmatter not found in ".concat(o.yellow(t),", create?"),default:!0}])];case 1:return!0!==n.sent().create?[3,3]:[4,L(e)];case 2:n.sent(),n.label=3;case 3:return[3,6];case 4:return[4,s.prompt([{type:"confirm",name:"update",message:"Frontmatter found in ".concat(o.yellow(t),", update?"),default:!0}])];case 5:!0===n.sent().update&&(i=u("Updating frontmatter").start(),c=W(a.author,a.description,a.create),(l=m.readFileSync(e,"utf-8").split("\n")).splice.apply(l,r([0,11],c.split("\n"),!1)),m.writeFileSync(e,l.join("\n")),i.succeed("Frontmatter updated")),n.label=6;case 6:return[2]}}))}))}function P(e){return t(this,void 0,void 0,(function(){var t,a,i,o;return n(this,(function(n){switch(n.label){case 0:return[4,N(e)];case 1:return t=n.sent(),a=u("Inserting frontmatter").start(),i=W(t.author,t.description),(o=m.readFileSync(e,"utf-8").split("\n")).splice.apply(o,r([0,0],i.split("\n"),!1)),m.writeFileSync(e,o.join("\n")),a.succeed("Frontmatter inserted"),[2]}}))}))}k.name("dev").description("A cli tool for devtools").version(x,"-sv, --subversion"),k.command("run [script]").description("run pnpm script").action((function(e){return t(void 0,void 0,void 0,(function(){var t,r,i,c;return n(this,(function(n){var s;if(t="build",s=y(),r=Object.keys(s.scripts),void 0!==e){if(!r.includes(e))return u("Scripts: ".concat(o.blue(e)," not found")).fail(),[2];t=e}return i="pnpm ".concat(t),c=u("Running scripts: ".concat(o.blue(i))).start(),a("pnpm ".concat(t),{cwd:h()},(function(e,t,n){var r="";null!==e&&(r=e.message),null!==n&&""!==n&&(r=""===r?n:"".concat(r,"\n").concat(n)),""!==r?(r="Scripts: ".concat(o.blue(i)," run failed\n").concat(o.red(r,t)),c.fail(r)):(r="Scripts: ".concat(o.blue(i)," successfully"),c.succeed(r)),c.stop()})),[2]}))}))})),k.command("update").description("update config file").action((function(){var e=g(!0),t=p.load(e);t.update=Math.floor(Date.now()/1e3),m.writeFileSync(e,p.stringify(t,4,2))}));var H=new c("mmd"),J=b(v.mmd);H.name("mmd").description("A cli tool for markdown").version(J,"-sv, --subversion"),H.command("label").description("label crud").action((function(){return t(void 0,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return[4,A()];case 1:return e.sent(),[2]}}))}))})),H.command("new [name]").description("create markdown file").action((function(e){return t(void 0,void 0,void 0,(function(){return n(this,(function(t){switch(t.label){case 0:return[4,L(R(e))];case 1:return t.sent(),[2]}}))}))})),H.command("update [name]").description("update markdown frontmatter").action((function(e){return t(void 0,void 0,void 0,(function(){return n(this,(function(t){switch(t.label){case 0:return[4,O(R(e))];case 1:return t.sent(),[2]}}))}))})),function(e,t){for(var n=S(),r=0,a=t;r<a.length;r++){var i=a[r];n.includes(i.name())&&e.addCommand(i)}}(F,[H,k]),F.parse(e.argv);
