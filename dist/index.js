#!/usr/bin/env node
import e from"process";import{__awaiter as t,__generator as n,__spreadArray as r}from"tslib";import{exec as a}from"child_process";import i from"axios";import o from"chalk";import{Command as c}from"commander";import s from"inquirer";import u from"ora";import{resolve as l}from"path";import d from"app-root-path";import p from"fs-extra";import m from"yamljs";import f from"assert";import v from"node:fs";import*as h from"toml";var g;function b(){return d.path.endsWith("dist")?d.resolve("../"):d.path}function y(){var e=l(b(),"package.json");return p.readJSONSync(e)}function w(e){return y().subVersion[e]}function S(e){void 0===e&&(e=!1);var t=l(b(),"config"),n=l(t,"default.yml");if(e)return n;var r=m.load(n).update,a=l(t,"user.yml");return p.existsSync(a)||p.copyFileSync(n,a),m.load(a).update<r&&p.copyFileSync(n,a),a}function k(e){void 0===e&&(e=!1);var t=S(e);return m.load(t)}function F(){var e=k(),t=[];return e.dev.enable&&t.push("dev"),e.mmd.enable&&t.push("mmd"),e.pip.enable&&t.push("pip"),e.rs.enable&&t.push("rs"),t}!function(e){e.dev="dev",e.mmd="mmd",e.pip="pip",e.rs="rs"}(g||(g={}));var x=new c,D=y().version;x.name("muc").description(y().description).version(D,"-v, --version"),x.command("set").description("set subcommand on or off").action((function(){return t(void 0,void 0,void 0,(function(){var e,r,a;return n(this,(function(i){switch(i.label){case 0:return e=["dev","mmd","pip","rs"],r=F(),a=e.map((function(e){return r.includes(e)?{name:e,value:e,checked:!0}:{name:e,value:e,checked:!1}})),[4,s.prompt([{type:"checkbox",name:"command",message:"Please select the subcommand you want to open",choices:a}]).then((function(e){return t(void 0,void 0,void 0,(function(){return n(this,(function(t){return function(e){var t=k();t.dev.enable=e.includes("dev"),t.mmd.enable=e.includes("mmd"),t.pip.enable=e.includes("pip"),t.rs.enable=e.includes("rs");var n=S();p.writeFileSync(n,m.stringify(t,4,2))}(e.command),[2]}))}))}))];case 1:return i.sent(),[2]}}))}))})),x.command("update").description("check and update from upstream").action((function(){return t(void 0,void 0,void 0,(function(){var e,t,r,c;return n(this,(function(n){switch(n.label){case 0:return e=u("Checking update...").start(),[4,i.get("https://registry.npmjs.org/@btmuli/mucli")];case 1:return t=n.sent().data,r=t["dist-tags"].latest,D<r?(e.stop(),[4,s.prompt([{type:"confirm",name:"update",message:"There is a new version ".concat(o.blue(r),", update?"),default:!0}])]):[3,3];case 2:return!0===n.sent().update&&(c=u("Updating...").start(),a("npm i -g @btmuli/mucli",(function(e,t,n){var r="";null!==e&&(r=e.message),null!==n&&""!==n&&(r=""===r?n:"".concat(r,"\n").concat(n)),""!==r?(r="Updated failed\n".concat(o.red(r,t)),c.fail(r)):(r="Updated successfully",c.succeed(r)),c.stop()}))),[3,4];case 3:e.succeed("MuCli is latest!"),n.label=4;case 4:return[2]}}))}))})),x.command("test [url]").option("-t, --timeout <timeout>","set the timeout of request","10").description("test the time to request the site").action((function(e,r){return t(void 0,void 0,void 0,(function(){var t,a,c,s,l,d;return n(this,(function(n){return t=e,a=void 0!==r.timeout?parseInt(r.timeout):10,a=isNaN(a)?10:a,void 0===t&&(t="https://www.github.com"),c="Testing Website Response Time for ".concat(o.blue(t)),s=u("".concat(c," 0.00/").concat(a)).start(),l="0.00",d=setInterval((function(){l=(parseFloat(l)+.1).toFixed(1),s.text="".concat(c," ").concat(l,"/").concat(a)}),100),i.get(t,{timeout:1e3*a}).then((function(e){clearInterval(d),s.succeed("Response Time: ".concat(o.blue(e.headers["x-response-time"])))})).catch((function(e){clearInterval(d);var t=e.isAxiosError?e.message:JSON.stringify(e.toJSON());s.fail("Request failed, cost time: ".concat(o.red(l),"s\n").concat(t))})),[2]}))}))}));var A=new c("dev"),C=w(g.dev);function E(){return t(this,void 0,void 0,(function(){var e;return n(this,(function(t){switch(t.label){case 0:return[4,s.prompt([{type:"list",name:"type",message:"What do you want to do about label?",choices:[{name:"See all labels",value:"see"},{name:"Create a new label",value:"create"},{name:"Update a label",value:"update"},{name:"Delete label(s)",value:"delete"},{name:"Do nothing",value:"nothing"}]}])];case 1:switch(e=t.sent(),e.type){case"see":return[3,2];case"create":return[3,4];case"update":return[3,6];case"delete":return[3,8];case"nothing":return[3,10]}return[3,11];case 2:return[4,W()];case 3:case 5:case 7:case 9:return t.sent(),[3,11];case 4:return[4,M()];case 6:return[4,N()];case 8:return[4,T()];case 10:return[3,11];case 11:return[2]}}))}))}function j(e){return"[filename] ".concat(o.yellow(e.filename)," [author] ").concat(o.yellow(e.author)," [description] ").concat(o.yellow(e.description))}function W(){return t(this,void 0,void 0,(function(){var e,t,r,a,i,c;return n(this,(function(n){if(e=k(),t=e.mmd.defaultLabel,console.log(o.green("Default label:"),j(t)),r=e.mmd.labels,console.log(o.green("Custom labels:")),0===r.length)return console.log(o.yellow("\tNo custom labels")),[2];for(a=0,i=r;a<i.length;a++)c=i[a],console.log("\t",j(c));return[2]}))}))}function M(e){return t(this,void 0,void 0,(function(){var t,r,a,i,o,c,l;return n(this,(function(n){switch(n.label){case 0:return t=k(),r=t.mmd.labels,a=t.mmd.defaultLabel,[4,s.prompt([{type:"input",name:"filename",message:"Filename:",default:null!=e?e:""}])];case 1:return(i=n.sent())===a.filename||r.some((function(e){return e.filename===i.filename}))?(i.filename===a.filename&&u("The label is already exists as the default label!").fail(),void 0===(o=r.find((function(e){return e.filename===i.filename})))?[2]:[4,s.prompt([{type:"confirm",name:"confirm",message:"The label already exists, do you want to update the label ?\n".concat(j(o))}])]):[3,4];case 2:return!1===(c=n.sent()).confirm?[2]:[4,N(i.filename)];case 3:return n.sent(),[3,7];case 4:return[4,s.prompt([{type:"input",name:"author",message:"Author:",default:a.author},{type:"input",name:"description",message:"Description:",default:a.description}])];case 5:return c=n.sent(),l={filename:i.filename,author:c.author,description:c.description},[4,s.prompt([{type:"confirm",name:"confirm",message:"Do you want to create the label ?\n".concat(j(l))}])];case 6:if(!1===n.sent().confirm)return[2];r.push(l),t.mmd.labels=r,p.writeFileSync(S(),m.stringify(t,4,2)),n.label=7;case 7:return[2]}}))}))}function N(e,r){return t(this,void 0,void 0,(function(){var t,r,a,i,o,c;return n(this,(function(n){switch(n.label){case 0:return[4,s.prompt([{type:"input",name:"input",message:"Please input the filename of the label you want to update:",default:null!=e?e:""}])];case 1:return t=n.sent(),r=k().mmd.labels,a=r.find((function(e){return e.filename=t.input})),0!==r.length&&void 0!==a?[3,4]:[4,s.prompt([{type:"confirm",name:"confirm",message:"The label is not exist yet, create a new ?",default:!0}])];case 2:return!1===(i=n.sent()).confirm?[2]:[4,M(t.input)];case 3:return n.sent(),[3,7];case 4:return f(void 0!==a),[4,s.prompt([{type:"input",name:"author",message:"Author: ",default:a.author},{type:"input",name:"description",message:"Description: ",default:a.description}])];case 5:return i=n.sent(),o={filename:t.input,author:i.author,description:i.description},[4,s.prompt([{type:"confirm",name:"confirm",message:"Are you sure to update ?\n\tOld: ".concat(j(a),"\n\tNew:").concat(j(o))}])];case 6:if(!1===n.sent())return[2];r.forEach((function(e){e.filename===t.input&&(e=o)})),(c=k()).mmd.labels=r,p.writeFileSync(S(),m.stringify(c,4,2)),n.label=7;case 7:return[2]}}))}))}function T(){return t(this,void 0,void 0,(function(){var e,t,r,a,i;return n(this,(function(n){switch(n.label){case 0:return 0===(e=k().mmd.labels).length?(u("No custom labels").fail(),[2]):(t=e.map((function(e){return{name:e.filename,value:e.filename,checked:!1}})),[4,s.prompt([{type:"checkbox",name:"filename",message:"Which label(s) do you want to delete ?",choices:t}])]);case 1:return r=n.sent(),[4,s.prompt([{type:"confirm",name:"confirm",message:"Are you sure to delete these labels ?"}])];case 2:return!1===n.sent().confirm||(a=[],e.forEach((function(e){!1===r.filename.includes(e.filename)&&a.push(e)})),(i=k()).mmd.labels=a,p.writeFileSync(S(),m.stringify(i,4,2)),u("Delete successfully").succeed()),[2]}}))}))}function U(e){var t=new Date,n=t.getFullYear().toString().padStart(4,"0"),r=(t.getMonth()+1).toString().padStart(2,"0"),a=t.getDate().toString().padStart(2,"0"),i=t.getHours().toString().padStart(2,"0"),o=t.getMinutes().toString().padStart(2,"0"),c=t.getSeconds().toString().padStart(2,"0");return!0===e?"".concat(n,"-").concat(r,"-").concat(a," ").concat(i,":").concat(o,":").concat(c):"".concat(n,"-").concat(r,"-").concat(a)}function R(e){var t="./README.md";return void 0!==e&&(t=e.endsWith(".md")?e:e+=".md"),t}function I(e){var t;return(t=e.includes("\\")?e.split("\\").pop():e.includes("/")?e.split("/").pop():e).endsWith(".md")&&(t=t.split(".md")[0]),t}function O(e,t,n){var r=l(b(),"template","MuCli","README.md"),a=p.readFileSync(r,"utf-8"),i=U(!1),o=U(!0),c=a.split("\n");return c.forEach((function(r,a){var s;if(1===a&&(s=r.replace("author",e),c[a]=s),2===a&&(s=r.replace("description",t),c[a]=s),4===a&&(s=r.replace("update",i),c[a]=s),9===a&&(s=r.replace("modify",o),c[a]=s),7===a&&(s=void 0!==n?r.replace("create",n):r.replace("create",o),c[a]=s),3===a){if(void 0!==n){var u=n.split(" ")[0];s=r.replace("date",u)}else s=r.replace("date",i);c[a]=s}})),c.join("\n")}function q(e){var t;if(void 0===e)t="README.md";else if(e.includes(".")){if("md"!==e.split(".").pop())return!1;t=e}else t="".concat(e,".md");if(!p.existsSync(t))return!1;var n=p.readFileSync(t,"utf-8").split("\n"),r={author:"",description:"",date:"",update:"",create:"",modify:""};for(var a in n.forEach((function(e,t){t>=1&&t<=4&&(e.startsWith("Author: ")?r.author=e.split("Author: ")[1].trim():e.startsWith("Description: ")?r.description=e.split("Description: ")[1].trim():e.startsWith("Date: ")?r.date=e.split("Date: ")[1].trim():e.startsWith("Update: ")&&(r.update=e.split("Update: ")[1].trim())),7===t&&(r.create=e.split("`")[3]),9===t&&(r.modify=e.split("`")[1])})),r){var i=r[a];if(""===i||void 0===i)return!1}return r}function _(e){return t(this,void 0,void 0,(function(){var t,r,a,i;return n(this,(function(n){switch(n.label){case 0:return t=I(e),[4,s.prompt([{type:"input",name:"title",message:"Title:",default:t}])];case 1:return r=n.sent(),a=function(e){var t=k().mmd,n=t.defaultLabel,r=t.labels.find((function(t){return t.filename===e}));return void 0===r&&(r=n),r}(r.title),[4,s.prompt([{type:"input",name:"author",message:"Author:",default:a.author},{type:"input",name:"description",message:"Description:",default:a.description}])];case 2:return i=n.sent(),[2,{filename:r.title,author:i.author,description:i.description}]}}))}))}function J(e){return t(this,void 0,void 0,(function(){var t,r,a,i,c,l,d;return n(this,(function(n){switch(n.label){case 0:return t=I(e),p.existsSync(e)?(r=q(e),a=[{name:"Create new file",value:"create"}],!1!==r?a.unshift({name:"Update frontmatter",value:"update"}):a.unshift({name:"Insert frontmatter",value:"insert"}),[4,s.prompt([{type:"list",name:"action",message:"File ".concat(o.yellow(t)," already exists, what do you want to do?"),choices:a,default:!1===r?"insert":"update"}])]):[3,7];case 1:switch(i=n.sent(),i.action){case"update":return[3,2];case"insert":return[3,4];case"create":return[3,6]}return[3,7];case 2:return[4,L(e)];case 3:case 5:return n.sent(),[2];case 4:return[4,P(e)];case 6:return[3,7];case 7:return[4,_(e)];case 8:return c=n.sent(),l=u("Creating markdown file").start(),d=O(c.author,c.description),t!==c.filename&&(e=e.replace(t,c.filename)),p.createFileSync(e),p.writeFileSync(e,d),l.succeed("Markdown file ".concat(o.yellow(c.filename)," created")),[2]}}))}))}function L(e){return t(this,void 0,void 0,(function(){var t,a,i,c,l;return n(this,(function(n){switch(n.label){case 0:return t=I(e),!1!==(a=q(e))?[3,4]:[4,s.prompt([{type:"confirm",name:"create",message:"Frontmatter not found in ".concat(o.yellow(t),", create?"),default:!0}])];case 1:return!0!==n.sent().create?[3,3]:[4,J(e)];case 2:n.sent(),n.label=3;case 3:return[3,6];case 4:return[4,s.prompt([{type:"confirm",name:"update",message:"Frontmatter found in ".concat(o.yellow(t),", update?"),default:!0}])];case 5:!0===n.sent().update&&(i=u("Updating frontmatter").start(),c=O(a.author,a.description,a.create),(l=p.readFileSync(e,"utf-8").split("\n")).splice.apply(l,r([0,11],c.split("\n"),!1)),p.writeFileSync(e,l.join("\n")),i.succeed("Frontmatter updated")),n.label=6;case 6:return[2]}}))}))}function P(e){return t(this,void 0,void 0,(function(){var t,a,i,o;return n(this,(function(n){switch(n.label){case 0:return[4,_(e)];case 1:return t=n.sent(),a=u("Inserting frontmatter").start(),i=O(t.author,t.description),(o=p.readFileSync(e,"utf-8").split("\n")).splice.apply(o,r([0,0],i.split("\n"),!1)),p.writeFileSync(e,o.join("\n")),a.succeed("Frontmatter inserted"),[2]}}))}))}A.name("dev").description("A cli tool for devtools").version(C,"-sv, --subversion"),A.command("run [script]").description("run pnpm script").action((function(e){return t(void 0,void 0,void 0,(function(){var t,r,i,c;return n(this,(function(n){var s;if(t="build",s=y(),r=Object.keys(s.scripts),void 0!==e){if(!r.includes(e))return u("Scripts: ".concat(o.blue(e)," not found")).fail(),[2];t=e}return i="pnpm ".concat(t),c=u("Running scripts: ".concat(o.blue(i))).start(),a("pnpm ".concat(t),{cwd:b()},(function(e,t,n){var r="";null!==e&&(r=e.message),null!==n&&""!==n&&(r=""===r?n:"".concat(r,"\n").concat(n)),""!==r?(r="Scripts: ".concat(o.blue(i)," run failed\n").concat(o.red(r,t)),c.fail(r)):(r="Scripts: ".concat(o.blue(i)," successfully"),c.succeed(r)),c.stop()})),[2]}))}))})),A.command("update").description("update config file").action((function(){var e=S(!0),t=m.load(e);t.update=Math.floor(Date.now()/1e3),p.writeFileSync(e,m.stringify(t,4,2))}));var H=new c("mmd"),V=w(g.mmd);H.name("mmd").description("A cli tool for markdown").version(V,"-sv, --subversion"),H.command("label").description("label crud").action((function(){return t(void 0,void 0,void 0,(function(){return n(this,(function(e){switch(e.label){case 0:return[4,E()];case 1:return e.sent(),[2]}}))}))})),H.command("new [name]").description("create markdown file").action((function(e){return t(void 0,void 0,void 0,(function(){return n(this,(function(t){switch(t.label){case 0:return[4,J(R(e))];case 1:return t.sent(),[2]}}))}))})),H.command("update [name]").description("update markdown frontmatter").action((function(e){return t(void 0,void 0,void 0,(function(){return n(this,(function(t){switch(t.label){case 0:return[4,L(R(e))];case 1:return t.sent(),[2]}}))}))}));var Y=new c("pip"),z=w(g.pip);function B(){var e;return t(this,void 0,void 0,(function(){var t,r,a,i;return n(this,(function(n){if(t=process.cwd()+"\\Cargo.toml",!v.existsSync(t))return[2,!1];try{if(r=v.readFileSync(t,"utf-8"),void 0===(a=null===(e=h.parse(r))||void 0===e?void 0:e.dependencies))return[2,!1];for(i in a)"object"==typeof a[i]&&(a[i]=a[i].version);return[2,a]}catch(e){return[2,!1]}return[2]}))}))}function G(e){return t(this,void 0,void 0,(function(){var t,r;return n(this,(function(n){switch(n.label){case 0:return[4,fetch("https://crates.io/api/v1/crates/"+e)];case 1:return[4,n.sent().json()];case 2:return t=n.sent(),[2,[(r=t).crate.max_stable_version,r.crate.max_version]]}}))}))}Y.name("pip").description("A cli tool for pip").version(z,"-sv, --subversion"),Y.command("mirror").description("mirror crud").action((function(){return t(void 0,void 0,void 0,(function(){return n(this,(function(e){return console.log("mirror"),[2]}))}))})),Y.command("install [pkg]").description("install package").action((function(e){return t(void 0,void 0,void 0,(function(){return n(this,(function(t){return void 0===e?(console.log("search requirements.txt"),[2]):("https://pypi.tuna.tsinghua.edu.cn/simple",a("pip install ".concat(e," -i ").concat("https://pypi.tuna.tsinghua.edu.cn/simple"),(function(e,t,n){null==e?console.log(t):console.log(e)})),[2])}))}))}));var K=new c("rs"),Q=w(g.rs);K.name("rs").description("A cli tool for rs").version(Q,"-sv, --subversion"),K.command("update").description("update package").option("-p, --package <package>","package name").action((function(e){return t(void 0,void 0,void 0,(function(){var t,r,a,i,o,c,s,l,d,p,m;return n(this,(function(n){switch(n.label){case 0:return[4,B()];case 1:return!1===(t=n.sent())?(console.log("No Cargo.toml file found or parse failed"),[2]):void 0===e.package?[3,5]:Object.keys(t).includes(e.package)?(r=u("Checking dependency ".concat(e.package)).start(),[4,G(e.package)]):[3,3];case 2:return a=n.sent(),r.succeed("Check dependency ".concat(e.package," success")),console.table({name:e.package,version:t[e.package],stable:a[0],latest:a[1]}),[3,4];case 3:console.log("The package ".concat(e.package," is not in the dependencies")),n.label=4;case 4:return[2];case 5:for(l in i=[],o=u("Checking dependencies").start(),s=[],c=t)s.push(l);d=0,n.label=6;case 6:return d<s.length?(l=s[d])in c?(p=l,o.text="Checking ".concat(p),[4,G(p)]):[3,8]:[3,9];case 7:m=n.sent(),i.push({name:p,version:t[p],stable:m[0],latest:m[1]}),n.label=8;case 8:return d++,[3,6];case 9:return o.succeed("Check dependencies success"),console.table(i),[2]}}))}))})),function(e,t){for(var n=F(),r=0,a=t;r<a.length;r++){var i=a[r];n.includes(i.name())&&e.addCommand(i)}}(x,[H,A,Y,K]),x.parse(e.argv);
