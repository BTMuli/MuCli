---
Date: 2022-09-29
Update: 2022-10-11
Author: 目棃
Description: 说明文档
---

> 本文档 [`Front-matter`](https://github.com/BTMuli/MuCli#FrontMatter) 由 [`MuCli`](https://github.com/BTMuli/MuCli) 自动生成

![](https://img.shields.io/github/license/BTMuli/MuCli?style=for-the-badge)![](https://img.shields.io/github/workflow/status/btmuli/MuCli/MuCli%20Workflow?style=for-the-badge)![](https://img.shields.io/github/package-json/v/btmuli/mucli?style=for-the-badge)![](https://img.shields.io/github/last-commit/btmuli/mucli?style=for-the-badge)

## 前言

本项目为个人使用的 Node-CLI 工具，即 `A Node CLI for Personal Use by BTMuli`，为了方便自己使用，所以发包到 `npm` 上面以及 `github` 上面。

> 若你写的 Workflow 发布到不同平台，则需保证`package.json`没有 `publishConfig` 之类的配置，其会覆盖你在 `workflow.yml`中写的路径。

---

## 命令说明

本 CLI 采用加载子命令的形式运行，可以通过修改 [`config.yml`](./config_default/config.yml) 对应 command 的 `enable` 属性来选择是否加载。

主 CLI 采用的是 `muc` 命令，其运行如下：

```text
> muc -h
Usage: muc [options] [command]

A Node Cli for Personal Use by BTMUli.

Options:
  -v, --version   output the version number
  -h, --help      display help for command

Commands:
  mmd [options]   A SubCommand within MuCli for Markdown
  ncm [options]   A SubCommand within MuCli for SubCommand
  help [command]  display help for command
```

如上，除了 Commander 默认的 `help` 之外，目前有两个子命令，`mmd` 跟 `ncm`。

### 查看版本

主 CLI 采用 `-v` 或 `--version` 查看版本，如下：

```text
> muc -v
0.3.1
```

子命令则通过 `-sv` 即 `subversion` 来查看，如下:

```text
> muc mmd -sv
0.3.0
> muc ncm -sv
0.0.2
```

### SubCli-Markdown

对应的是上面的 `mmd` 命令：

```text
> muc mmd -h
Usage: muc mmd [options] [command]

A SubCommand within MuCli for Markdown

Options:
  -sv               output the version number
  -h, --help        display help for command

Commands:
  new [options]     create a markdown file
  typora [options]  using local Typora - config is needed
  help [command]    display help for command
```

目前的功能有两个：新建 Markdown 文件与调用 [`Typora`](https://typoraio.cn/) 打开文件。

```text
> muc mmd typora -h
Usage: muc mmd typora [options]

using local Typora - config is needed

Options:
  -n [name]   open [name] with Typora (default: "")
  -p, --path  get local typora path
  -h, --help  display help for command
```

默认内容如下（以 `muc mmd new -n README` 为例）

```markdown
---
Date: 2022-10-07
Update: 2022-10-07
Author: 目棃
Description: 说明文档
---

> 本文档 [`Front-matter`](https://github.com/BTMuli/Mucli#FrontMatter) 由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于
`2022-10-07 15:34:07`
```

### SubCli-SubCommand

对应的是上面的 `ncm` 命令：

```text
> muc ncm -h
Usage: muc ncm [options] [command]

A SubCommand within MuCli for SubCommand

Options:
  -sv             output the version number
  -h, --help      display help for command

Commands:
  new [options]
  help [command]  display help for command
```

用于个人新建一个子命令，即 `Just for dev`。

---

## FrontMatter

`Frontmatter` 即前言，用来说明书目的总结跟内容。

但是在 Markdown 中， Front-matter 指的是 `.md` 文件最开始的那部分，如本文，其 `Frontmatter` 为:

```markdown
---
Date: 2022-09-29
Update: 2022-10-10
Author: 目棃
Description: 说明文档
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

每次提交的信息不超过100个字符

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

