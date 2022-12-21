---
Author: 目棃
Date: 2022-09-29
Description: 说明文档
Update: 2022-12-21
---

> 本文档 [`Front-matter`](https://github.com/BTMuli/Mucli#FrontMatter) 由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于`2022-12-21 12:58:15`
> 
> 更新于 `2022-12-21 12:58:15`

![](https://img.shields.io/github/license/BTMuli/MuCli?style=for-the-badge)![](https://img.shields.io/github/package-json/v/btmuli/mucli?style=for-the-badge)![](https://img.shields.io/github/last-commit/btmuli/mucli?style=for-the-badge)

## 前言

本项目为个人使用的 Node-CLI 工具，即 `A Node CLI for Personal Use by BTMuli`，

为了方便自己使用，所以发包到 `npm` 上面以及 `github` 上面。

---

## 适用平台

本命令行针对 `Windows` 平台跟 `Linux` 平台进行了适配，但是后者没有经过测试。

除了 `muc mmd typora`需要 `windows` 平台外，其他命令均可在 `Linux` 平台使用。

---

## 命令说明

本 CLI 采用加载子命令的形式运行，可以通过修改 [`config.yml`](./config_default/config.yml) 对应 command 的 `enable` 属性来选择是否加载。

主 CLI 采用的是 `muc` 命令，其运行如下：

```text
Usage: muc [options] [command]

A Node Cli for Personal Use by BTMUli.

Options:
  -v, --version  output the version number
  -l, --list     list all commands
  -h, --help     display help for command

Commands:
  set [options]  change subcommand use status
  dev [options]  A SubCommand within MuCli for SubCommand
  mmd [options]  A SubCommand within MuCli for Markdown
  pip [options]  A SubCommand within MuCli for pip
```

如上，除了 Commander 默认的 `help` 之外，目前的子命令如下：

+ `set`：用于子命令的启用/禁用
+ `list`：用于列出所有子命令
+ `mmd`：用于 Markdown 相关操作
+ `dev`：用于创建子命令及更新命令版本，**Just for Dev**。
+ `pip`：用于 pip 相关操作

### 查看版本

主 CLI 采用 `-v` 或 `--version` 查看版本，如下：

```text
> muc -v
0.6.2
```

子命令则通过 `-sv` 即 `subversion` 来查看，如下:

```text
> muc dev -sv
0.1.8
> muc mmd -sv
0.6.0
> muc pip -sv
0.3.0
```

当然，你也可以通过 `muc -l` 来查看所有命令的版本及其可用性，如下：

```text
> muc -l
┌─────────┬─────────┬────────┬────────────────────────────────────────────┐
│ (index) │ version │ enable │                description                 │
├─────────┼─────────┼────────┼────────────────────────────────────────────┤
│   muc   │ '0.6.2' │  true  │  'A Node Cli for Personal Use by BTMUli.'  │
│   dev   │ '0.1.8' │  true  │ 'A SubCommand within MuCli for SubCommand' │
│   mmd   │ '0.6.0' │  true  │  'A SubCommand within MuCli for Markdown'  │
│   pip   │ '0.3.0' │  true  │    'A SubCommand within MuCli for pip'     │
└─────────┴─────────┴────────┴────────────────────────────────────────────┘
```

### MuCli-Markdown

对应的是上面的 `mmd` 命令：

```text
> muc mmd -h
Usage: muc mmd [options] [command]

A SubCommand within MuCli for Markdown

Options:
  -sv, --subversion  output the subversion of MuCli-Markdown
  -h, --help         display help for command

Commands:
  new [options]      create a markdown file
  update [options]   update the header of the markdown file
  typora [options]   get local typora path
  label [options]    add the template
  help [command]     display help for command
```

目前主要功能如下：

+ `new`：创建一个 Markdown 文件，支持自定义模板
+ `update`：更新 Markdown 文件的头部信息
+ `typora`：通过 Typora 进行相关操作

markdown 文件支持模板，模板参数如下：

```yaml
author: [author]
filename: [filename]
description: [description]
```

相关命令如下:

```shell
> muc mmd label -h
Usage: muc mmd label [options]

add the template

Options:
  -l, --list           get the list of markdown label
  -g, --get <name>     get the markdown label
  -d, --delete <name>  delete the markdown label
  -a, --add <name>     add the markdown label
  -h, --help           display help for command
```

Typora 相关操作如下：

```shell
> muc mmd typora -h
Usage: muc mmd typora [options]

get local typora path

Options:
  -n, --name [name]  the name of the markdown file
  -i, --info         get the path of Typora
  -s, --set [path]   set the path of Typora
  -h, --help         display help for command
```

---

### MuCli-Dev

对应的是上面的 `dev` 命令：

```shell
> muc dev -h
Usage: muc dev [options] [command]

A SubCommand within MuCli for SubCommand

Options:
  -sv, --subversion  output the subversion of MuCli-Dev
  -h, --help         display help for command

Commands:
  new [options]      create a new command
  update             update a command version
  help [command]     display help for command
```

其中，`new` 命令用于创建新的子命令，`update` 命令用于更新命令版本。

---

## MuCli-Pip

对应的是上面的 `pip` 命令：

```text
> muc pip -h
Usage: muc pip [options] [command]

A SubCommand within MuCli for pip

Options:
  -sv, --subversion  output the subversion of MuCli-Pip
  -h, --help         display help for command

Commands:
  install [options]  install package
  test [options]     test mirror
  mirror [options]   handle mirror
  help [command]     display help for command
```

目前支持：使用镜像源下载包跟`requirements.txt`文件，测试镜像源速度，以及镜像源的增删改查。

`pip install` 相关操作如下：

```shell
> muc pip install -h
Usage: muc pip install [options]

install package

Options:
  -p, --package [package]          install package
  -r, --requirement [requirement]  install requirement
  -h, --help                       display help for command
```

`pip mirror` 相关操作如下：

```shell
> muc pip mirror -h
Usage: muc pip mirror [options]

handle mirror

Options:
  -a, --add [add]        add mirror
  -d, --delete [delete]  delete mirror
  -s, --set [set]        set mirror
  -l, --list             list mirror
  -u, --update           update mirror
  -h, --help             display help for command
```

`pip test` 相关操作如下：

```shell
> muc pip test -h
Usage: muc pip test [options]

test mirror

Options:
  -n, --name [name]  mirror name
  -h, --help         display help for command
```

---

## FrontMatter

`Frontmatter` 即前言，用来说明书目的总结跟内容。

但是在 Markdown 中， Front-matter 指的是 `.md` 文件最开始的那部分，如本文，其 `Frontmatter` 为:

```markdown
---
Author: 目棃
Date: 2022-09-29
Description: 说明文档
Update: 2022-12-21
---
```

是以 `yaml` 格式在文件开头增加的元数据。

---

## 代码格式化

本项目通过 [`Eslint`](http://eslint.cn/) 结合 [`eslint-plugin-prettier`](https://github.com/prettier/eslint-plugin-prettier) 进行代码格式化。

相关安装包如下：

```yaml
"eslint": "^8.25.0",
"eslint-config-prettier": "^8.5.0",
"eslint-plugin-json": "^3.1.0",
"eslint-plugin-prettier": "^4.2.1",
"prettier": "^2.7.1"
```

相关配置文件如下：

> 参考：[prettier/eslint-plugin-prettier: ESLint plugin for Prettier formatting (github.com)](https://github.com/prettier/eslint-plugin-prettier)

+ [`.eslintignore`](.eslintignore)：Eslint 忽略文件，类似于 [`.gitignore`](.gitignore)
+ [`.eslintrc.json`](.eslintrc.json)：Eslint 主配置文件
+ [`.prettierrc.json`](.prettierrc.json)：Prettier 主配置文件

配置完后可以通过如下命令执行：

+ `npm run lint-all`：执行 Eslint，进行代码检查
+ `npm run lint-fix`：执行 Eslint ，对一些不符合条件的代码进行格式化

若有代码需要忽略，可以采用如下方式：

```js
/* 忽略某段代码 */
/* eslint-disable */
// [code block]
/* eslint-disable */

/* 忽略某行代码 */
// [code line] // eslint-disable-line

/* 忽略下一行代码 */
// eslint-disable-next-line
// [code line]
```

---

## 提交规范

本项目 Commit 采用 [Angular 团队提交规范](https://zjdoc-gitguide.readthedocs.io/zh_CN/latest/message/angular-commit.html)。

通过 Webstorm 上的插件 [Git Commit Template](https://plugins.jetbrains.com/plugin/9861-git-commit-template) 予以辅助。

其提交格式如下：

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

每次提交可以包含页眉 `header` 、正文 `body` 和页脚 `footer` ，每次提交必须包含页眉内容

每次提交的信息不超过100个字符。

---

## LICENSE

本项目采用 MIT 协议。

```text
The MIT License (MIT)

Copyright (C) 2022-present BTMuli<bt-muli@outlook.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## 致谢

感谢 Github 提供的 Education Pack[^1]，使得本项目可以免费使用 Github Copilot[^2]。

感谢 JetBrains 提供的 Education Pack[^3]，使得本项目可以免费使用 Webstorm[^4]。

感谢 npmjs[^5] 提供的免费服务，使得本项目可以免费使用 npmjs 仓库[^6]。

用到本项目的朋友们，如果觉得本项目对你有帮助，欢迎 Star 本项目，也欢迎 Fork 本项目，如果有任何问题，欢迎提 Issue 或者 Pull Request。

[^1]: [GitHub Education Pack](https://education.github.com/pack)
[^2]: [GitHub Copilot](https://copilot.github.com/)
[^3]: [JetBrains Education Pack](https://www.jetbrains.com/zh-cn/community/education/#students)
[^4]: [JetBrains Webstorm](https://www.jetbrains.com/zh-cn/webstorm/)
[^5]: [npmjs](https://www.npmjs.com/)
[^6]: [本项目 npmjs 仓库](https://www.npmjs.com/package/@btmuli/mucli)
