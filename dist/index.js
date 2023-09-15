#!/usr/bin/env node
import e from"process";import{exec as t}from"child_process";import n from"axios";import r from"chalk";import{Command as a}from"commander";import i from"inquirer";import o from"ora";import{resolve as c}from"path";import s from"app-root-path";import u from"fs-extra";import l from"yamljs";import d from"assert";function m(e,t,n,r){return new(n||(n=Promise))((function(a,i){function o(e){try{s(r.next(e))}catch(e){i(e)}}function c(e){try{s(r.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,c)}s((r=r.apply(e,t||[])).next())}))}function p(e,t){var n,r,a,i,o={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(c){return function(s){return function(c){if(n)throw new TypeError("Generator is already executing.");for(;i&&(i=0,c[0]&&(o=0)),o;)try{if(n=1,r&&(a=2&c[0]?r.return:c[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,c[1])).done)return a;switch(r=0,a&&(c=[2&c[0],a.value]),c[0]){case 0:case 1:a=c;break;case 4:return o.label++,{value:c[1],done:!1};case 5:o.label++,r=c[1],c=[0];continue;case 7:c=o.ops.pop(),o.trys.pop();continue;default:if(!(a=o.trys,(a=a.length>0&&a[a.length-1])||6!==c[0]&&2!==c[0])){o=0;continue}if(3===c[0]&&(!a||c[1]>a[0]&&c[1]<a[3])){o.label=c[1];break}if(6===c[0]&&o.label<a[1]){o.label=a[1],a=c;break}if(a&&o.label<a[2]){o.label=a[2],o.ops.push(c);break}a[2]&&o.ops.pop(),o.trys.pop();continue}c=t.call(e,o)}catch(e){c=[6,e],r=0}finally{n=a=0}if(5&c[0])throw c[1];return{value:c[0]?c[1]:void 0,done:!0}}([c,s])}}}function f(e,t,n){if(n||2===arguments.length)for(var r,a=0,i=t.length;a<i;a++)!r&&a in t||(r||(r=Array.prototype.slice.call(t,0,a)),r[a]=t[a]);return e.concat(r||Array.prototype.slice.call(t))}var h;function v(){return s.path.endsWith("dist")?s.resolve("../"):s.path}function y(){var e=c(v(),"package.json");return u.readJSONSync(e)}function b(e){return y().subVersion[e]}function g(e){void 0===e&&(e=!1);var t=c(v(),"config"),n=c(t,"default.yml");if(e)return n;var r=l.load(n).update,a=c(t,"user.yml");return u.existsSync(a)||u.copyFileSync(n,a),l.load(a).update<r&&u.copyFileSync(n,a),a}function w(e){void 0===e&&(e=!1);var t=g(e);return l.load(t)}function S(){var e=w(),t=[];return e.dev.enable&&t.push("dev"),e.mmd.enable&&t.push("mmd"),t}"function"==typeof SuppressedError&&SuppressedError,function(e){e.dev="dev",e.mmd="mmd"}(h||(h={}));var F=new a,x=y().version;F.name("muc").description(y().description).version(x,"-v, --version"),F.command("set").description("set subcommand on or off").action((function(){return m(void 0,void 0,void 0,(function(){var e,t,n;return p(this,(function(r){switch(r.label){case 0:return e=["dev","mmd"],t=S(),n=e.map((function(e){return t.includes(e)?{name:e,value:e,checked:!0}:{name:e,value:e,checked:!1}})),[4,i.prompt([{type:"checkbox",name:"command",message:"Please select the subcommand you want to open",choices:n}]).then((function(e){return m(void 0,void 0,void 0,(function(){return p(this,(function(t){return function(e){var t=w();t.dev.enable=e.includes("dev"),t.mmd.enable=e.includes("mmd");var n=g();u.writeFileSync(n,l.stringify(t,4,2))}(e.command),[2]}))}))}))];case 1:return r.sent(),[2]}}))}))})),F.command("update").description("check and update from upstream").action((function(){return m(void 0,void 0,void 0,(function(){var e,a,c,s;return p(this,(function(u){switch(u.label){case 0:return e=o("Checking update...").start(),[4,n.get("https://registry.npmjs.org/@btmuli/mucli")];case 1:return a=u.sent().data,c=a["dist-tags"].latest,x<c?(e.stop(),[4,i.prompt([{type:"confirm",name:"update",message:"There is a new version ".concat(r.blue(c),", update?"),default:!0}])]):[3,3];case 2:return!0===u.sent().update&&(s=o("Updating...").start(),t("npm i -g @btmuli/mucli",(function(e,t,n){var a="";null!==e&&(a=e.message),null!==n&&""!==n&&(a=""===a?n:"".concat(a,"\n").concat(n)),""!==a?(a="Updated failed\n".concat(r.red(a,t)),s.fail(a)):(a="Updated successfully",s.succeed(a)),s.stop()}))),[3,4];case 3:e.succeed("MuCli is latest!"),u.label=4;case 4:return[2]}}))}))})),F.command("test [url]").option("-t, --timeout <timeout>","set the timeout of request","10").description("test the time to request the site").action((function(e,t){return m(void 0,void 0,void 0,(function(){var a,i,c,s,u,l;return p(this,(function(d){return a=e,i=parseInt(t.timeout),void 0===a&&(a="https://www.github.com"),void 0===i&&(i=10),c="Testing Website Response Time for ".concat(r.blue(a)),s=o("".concat(c," 0.00/").concat(i)).start(),u="0.00",l=setInterval((function(){u=(parseFloat(u)+.1).toFixed(1),s.text="".concat(c," ").concat(u,"/").concat(i)}),100),n.get(a,{timeout:1e3*i}).then((function(e){clearInterval(l),s.succeed("Response Time: ".concat(r.blue(e.headers["x-response-time"])))})).catch((function(e){clearInterval(l);var t=e.isAxiosError?e.message:JSON.stringify(e.toJSON());s.fail("Request failed, cost time: ".concat(r.red(u),"s\n").concat(t))})),[2]}))}))}));var k=new a("dev"),D=b(h.dev);function A(){return m(this,void 0,void 0,(function(){var e;return p(this,(function(t){switch(t.label){case 0:return[4,i.prompt([{type:"list",name:"type",message:"What do you want to do about label?",choices:[{name:"See all labels",value:"see"},{name:"Create a new label",value:"create"},{name:"Update a label",value:"update"},{name:"Delete label(s)",value:"delete"},{name:"Do nothing",value:"nothing"}]}])];case 1:switch(e=t.sent(),e.type){case"see":return[3,2];case"create":return[3,4];case"update":return[3,6];case"delete":return[3,8];case"nothing":return[3,10]}return[3,11];case 2:return[4,M()];case 3:case 5:case 7:case 9:return t.sent(),[3,11];case 4:return[4,T()];case 6:return[4,C()];case 8:return[4,j()];case 10:return[3,11];case 11:return[2]}}))}))}function E(e){return"[filename] ".concat(r.yellow(e.filename)," [author] ").concat(r.yellow(e.author)," [description] ").concat(r.yellow(e.description))}function M(){return m(this,void 0,void 0,(function(){var e,t,n,a,i,o;return p(this,(function(c){if(e=w(),t=e.mmd.defaultLabel,console.log(r.green("Default label:"),E(t)),n=e.mmd.labels,console.log(r.green("Custom labels:")),0===n.length)return console.log(r.yellow("\tNo custom labels")),[2];for(a=0,i=n;a<i.length;a++)o=i[a],console.log("\t",E(o));return[2]}))}))}function T(e){return m(this,void 0,void 0,(function(){var t,n,r,a,c,s,d;return p(this,(function(m){switch(m.label){case 0:return t=w(),n=t.mmd.labels,r=t.mmd.defaultLabel,[4,i.prompt([{type:"input",name:"filename",message:"Filename:",default:null!=e?e:""}])];case 1:return(a=m.sent())===r.filename||n.some((function(e){return e.filename===a.filename}))?(a.filename===r.filename&&o("The label is already exists as the default label!").fail(),void 0===(c=n.find((function(e){return e.filename===a.filename})))?[2]:[4,i.prompt([{type:"confirm",name:"confirm",message:"The label already exists, do you want to update the label ?\n".concat(E(c))}])]):[3,4];case 2:return!1===(s=m.sent()).confirm?[2]:[4,C(a.filename)];case 3:return m.sent(),[3,7];case 4:return[4,i.prompt([{type:"input",name:"author",message:"Author:"},{type:"input",name:"description",message:"Description:"}])];case 5:return s=m.sent(),d={filename:a.filename,author:s.author,description:s.description},[4,i.prompt([{type:"confirm",name:"confirm",message:"Do you want to create the label ?\n".concat(E(d))}])];case 6:if(!1===m.sent().confirm)return[2];n.push(d),t.mmd.labels=n,u.writeFileSync(g(),l.stringify(t,4,2)),m.label=7;case 7:return[2]}}))}))}function C(e,t){return m(this,void 0,void 0,(function(){var t,n,r,a,o,c;return p(this,(function(s){switch(s.label){case 0:return[4,i.prompt([{type:"input",name:"input",message:"Please input the filename of the label you want to update:",default:null!=e?e:""}])];case 1:return t=s.sent(),n=w().mmd.labels,r=n.find((function(e){return e.filename=t.input})),0!==n.length&&void 0!==r?[3,4]:[4,i.prompt([{type:"confirm",name:"confirm",message:"The label is not exist yet, create a new ?",default:!0}])];case 2:return!1===(a=s.sent()).confirm?[2]:[4,T(t.input)];case 3:return s.sent(),[3,7];case 4:return d(void 0!==r),[4,i.prompt([{type:"input",name:"author",message:"Author: ",default:r.author},{type:"input",name:"description",message:"Description: ",default:r.description}])];case 5:return a=s.sent(),o={filename:t.input,author:a.author,description:a.description},[4,i.prompt([{type:"confirm",name:"confirm",message:"Are you sure to update ?\n\tOld: ".concat(E(r),"\n\tNew:").concat(E(o))}])];case 6:if(!1===s.sent())return[2];n.forEach((function(e){e.filename===t.input&&(e=o)})),(c=w()).mmd.labels=n,u.writeFileSync(g(),l.stringify(c,4,2)),s.label=7;case 7:return[2]}}))}))}function j(){return m(this,void 0,void 0,(function(){var e,t,n,r,a;return p(this,(function(c){switch(c.label){case 0:return 0===(e=w().mmd.labels).length?(o("No custom labels").fail(),[2]):(t=e.map((function(e){return{name:e.filename,value:e.filename,checked:!1}})),[4,i.prompt([{type:"checkbox",name:"filename",message:"Which label(s) do you want to delete ?",choices:t}])]);case 1:return n=c.sent(),[4,i.prompt([{type:"confirm",name:"confirm",message:"Are you sure to delete these labels ?"}])];case 2:return!1===c.sent().confirm||(r=[],e.forEach((function(e){!1===n.filename.includes(e.filename)&&r.push(e)})),(a=w()).mmd.labels=r,u.writeFileSync(g(),l.stringify(a,4,2)),o("Delete successfully").succeed()),[2]}}))}))}function R(e){var t=new Date,n=t.getFullYear().toString().padStart(4,"0"),r=(t.getMonth()+1).toString().padStart(2,"0"),a=t.getDate().toString().padStart(2,"0"),i=t.getHours().toString().padStart(2,"0"),o=t.getMinutes().toString().padStart(2,"0"),c=t.getSeconds().toString().padStart(2,"0");return!0===e?"".concat(n,"-").concat(r,"-").concat(a," ").concat(i,":").concat(o,":").concat(c):"".concat(n,"-").concat(r,"-").concat(a)}function U(e){var t="./README.md";return void 0!==e&&(t=e.endsWith(".md")?e:e+=".md"),t}function I(e){return e.includes("\\")?e.split("\\").pop():e.includes("/")?e.split("/").pop():e}function N(e,t,n){var r=c(v(),"template","MuCli","README.md"),a=u.readFileSync(r,"utf-8"),i=R(!1),o=R(!0),s=a.split("\n");return s.forEach((function(r,a){var c;if(1===a&&(c=r.replace("author",e),s[a]=c),2===a&&(c=r.replace("description",t),s[a]=c),4===a&&(c=r.replace("update",i),s[a]=c),9===a&&(c=r.replace("modify",o),s[a]=c),7===a&&(c=void 0!==n?r.replace("create",n):r.replace("create",o),s[a]=c),3===a){if(void 0!==n){var u=n.split(" ")[0];c=r.replace("date",u)}else c=r.replace("date",i);s[a]=c}})),s.join("\n")}function O(e){var t;if(void 0===e)t="README.md";else if(e.includes(".")){if("md"!==e.split(".").pop())return!1;t=e}else t="".concat(e,".md");if(!u.existsSync(t))return!1;var n=u.readFileSync(t,"utf-8").split("\n"),r={author:"",description:"",date:"",update:"",create:"",modify:""};for(var a in n.forEach((function(e,t){1===t&&(r.author=e.split("Author: ")[1].trim()),2===t&&(r.description=e.split("Description: ")[1].trim()),3===t&&(r.date=e.split("Date: ")[1].trim()),4===t&&(r.update=e.split("Update: ")[1].trim()),7===t&&(r.create=e.split("`")[3]),9===t&&(r.modify=e.split("`")[1])})),r){var i=r[a];if(""===i||void 0===i)return!1}return r}function W(e){return m(this,void 0,void 0,(function(){var t,n,r,a;return p(this,(function(o){switch(o.label){case 0:return t=I(e),[4,i.prompt([{type:"input",name:"title",message:"Title:",default:t}])];case 1:return n=o.sent(),r=function(e){var t=w().mmd,n=t.defaultLabel,r=t.labels.find((function(t){return t.filename===e}));return void 0===r&&(r=n),r}(n.title),[4,i.prompt([{type:"input",name:"author",message:"Author:",default:r.author},{type:"input",name:"description",message:"Description:",default:r.description}])];case 2:return a=o.sent(),[2,{filename:n.title,author:a.author,description:a.description}]}}))}))}function q(e){return m(this,void 0,void 0,(function(){var t,n,a,c,s,l,d;return p(this,(function(m){switch(m.label){case 0:return t=I(e),u.existsSync(e)?(n=O(e),a=[{name:"Create new file",value:"create"}],!1!==n?a.unshift({name:"Update frontmatter",value:"update"}):a.unshift({name:"Insert frontmatter",value:"insert"}),[4,i.prompt([{type:"list",name:"action",message:"File ".concat(r.yellow(t)," already exists, what do you want to do?"),choices:a,default:!1===n?"insert":"update"}])]):[3,7];case 1:switch(c=m.sent(),c.action){case"update":return[3,2];case"insert":return[3,4];case"create":return[3,6]}return[3,7];case 2:return[4,J(e)];case 3:case 5:return m.sent(),[2];case 4:return[4,L(e)];case 6:return[3,7];case 7:return[4,W(e)];case 8:return s=m.sent(),l=o("Creating markdown file").start(),d=N(s.author,s.description),u.createFileSync(e),u.writeFileSync(e,d),l.succeed("Markdown file created"),[2]}}))}))}function J(e){return m(this,void 0,void 0,(function(){var t,n,a,c,s;return p(this,(function(l){switch(l.label){case 0:return t=I(e),!1!==(n=O(e))?[3,4]:[4,i.prompt([{type:"confirm",name:"create",message:"Frontmatter not found in ".concat(r.yellow(t),", create?"),default:!0}])];case 1:return!0!==l.sent().create?[3,3]:[4,q(e)];case 2:l.sent(),l.label=3;case 3:return[3,6];case 4:return[4,i.prompt([{type:"confirm",name:"update",message:"Frontmatter found in ".concat(r.yellow(t),", update?"),default:!0}])];case 5:!0===l.sent().update&&(a=o("Updating frontmatter").start(),c=N(n.author,n.description,n.create),(s=u.readFileSync(e,"utf-8").split("\n")).splice.apply(s,f([0,11],c.split("\n"),!1)),u.writeFileSync(e,s.join("\n")),a.succeed("Frontmatter updated")),l.label=6;case 6:return[2]}}))}))}function L(e){return m(this,void 0,void 0,(function(){var t,n,r,a;return p(this,(function(i){switch(i.label){case 0:return[4,W(e)];case 1:return t=i.sent(),n=o("Inserting frontmatter").start(),r=N(t.author,t.description),(a=u.readFileSync(e,"utf-8").split("\n")).splice.apply(a,f([0,0],r.split("\n"),!1)),u.writeFileSync(e,a.join("\n")),n.succeed("Frontmatter inserted"),[2]}}))}))}k.name("dev").description("A cli tool for devtools").version(D,"-sv, --subversion"),k.command("run [script]").description("run pnpm script").action((function(e){return m(void 0,void 0,void 0,(function(){var n,a,i,c;return p(this,(function(s){var u;if(n="build",u=y(),a=Object.keys(u.scripts),void 0!==e){if(!a.includes(e))return o("Scripts: ".concat(r.blue(e)," not found")).fail(),[2];n=e}return i="pnpm ".concat(n),c=o("Running scripts: ".concat(r.blue(i))).start(),t("pnpm ".concat(n),{cwd:v()},(function(e,t,n){var a="";null!==e&&(a=e.message),null!==n&&""!==n&&(a=""===a?n:"".concat(a,"\n").concat(n)),""!==a?(a="Scripts: ".concat(r.blue(i)," run failed\n").concat(r.red(a,t)),c.fail(a)):(a="Scripts: ".concat(r.blue(i)," successfully"),c.succeed(a)),c.stop()})),[2]}))}))})),k.command("update").description("update config file").action((function(){var e=g(!0),t=l.load(e);t.update=Math.floor(Date.now()/1e3),u.writeFileSync(e,l.stringify(t,4,2))}));var P=new a("mmd"),G=b(h.mmd);P.name("mmd").description("A cli tool for markdown").version(G,"-sv, --subversion"),P.command("label").description("label crud").action((function(){return m(void 0,void 0,void 0,(function(){return p(this,(function(e){switch(e.label){case 0:return[4,A()];case 1:return e.sent(),[2]}}))}))})),P.command("new [name]").description("create markdown file").action((function(e){return m(void 0,void 0,void 0,(function(){return p(this,(function(t){switch(t.label){case 0:return[4,q(U(e))];case 1:return t.sent(),[2]}}))}))})),P.command("update [name]").description("update markdown frontmatter").action((function(e){return m(void 0,void 0,void 0,(function(){return p(this,(function(t){switch(t.label){case 0:return[4,J(U(e))];case 1:return t.sent(),[2]}}))}))})),function(e,t){for(var n=S(),r=0,a=t;r<a.length;r++){var i=a[r];n.includes(i.name())&&e.addCommand(i)}}(F,[P,k]),F.parse(e.argv);
