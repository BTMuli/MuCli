---
Author: 目棃
Date: 2022-09-29
Description: 说明文档
Update: 2023-07-03
---

> 本文档 [`Front-matter`](https://github.com/BTMuli/Mucli#FrontMatter) 由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于 `2022-12-21 12:58:15`
>
> 更新于 `2023-07-03 19:29:18`

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
  -v, --version     output the version number
  -h, --help        display help for command

Commands:
  list              list all commands
  set               change subcommand use status
  update            update muc from upstream
  build             build ts file
  backup            backup config file
  hello             get a essay from hitokoto.cn
  mmd [options]     A SubCommand within MuCli for Markdown
  pip [options]     A SubCommand within MuCli for pip
  typora [options]  A SubCommand within MuCli for Typora
  help [command]    display help for command
```

如上，除了 Commander 默认的 `help` 之外，目前的子命令如下：

-   `list`：用于展示子命令相关信息
-   `set`：用于子命令的启用/禁用
-   `update`：用于查找上游更新
-   `build`：用于开发环境，负责编译本地的 `ts` 文件
-   `backup`：用于备份配置文件，在配置文件错误清空时会从备份文件中恢复
-   `hello`：展示 hitokoto.cn 的一句话
-   `mmd`：用于 Markdown 相关操作
-   `pip`：用于 pip 相关操作
-   `typora`：用于 Typora 相关操作

> dev 命令为开发环境下的子命令，由于 npm 包文件仅包含 `dist` 文件夹，所以无法使用，强行使用可能会造成预期外的错误。

### 查看版本

主 CLI 采用 `-v` 或 `--version` 查看版本，如下：

```text
> muc -v
0.8.1
```

子命令则通过 `-sv` 即 `subversion` 来查看，如下:

```text
> muc dev -sv
0.2.3
> muc mmd -sv
0.7.8
> muc pip -sv
0.4.3
> muc typora -sv
0.7.3
```

当然，你也可以通过 `muc list` 来查看所有命令的版本及其可用性，如下：

```text
> muc list
┌─────────┬─────────┬────────┬────────────────────────────────────────────┐
│ (index) │ version │ enable │                description                 │
├─────────┼─────────┼────────┼────────────────────────────────────────────┤
│   muc   │ '0.8.1' │  true  │  'A Node Cli for Personal Use by BTMUli.'  │
│   dev   │ '0.2.3' │ false  │ 'A SubCommand within MuCli for SubCommand' │
│   mmd   │ '0.7.8' │  true  │  'A SubCommand within MuCli for Markdown'  │
│   pip   │ '0.4.3' │  true  │    'A SubCommand within MuCli for pip'     │
│ typora  │ '0.7.3' │  true  │   'A SubCommand within MuCli for Typora'   │
└─────────┴─────────┴────────┴────────────────────────────────────────────┘
```

## MuCli-Markdown

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
  label [options]    add the template
  help [command]     display help for command
```

目前主要功能如下：

-   `new`：创建一个 Markdown 文件，支持自定义模板
-   `update`：更新 Markdown 文件的头部信息
-   `label`：管理 Markdown 模板

markdown 文件支持模板，模板参数如下：

```yaml
filename: [filename]
author: [author]
description: [description]
```

相关命令如下:

```text
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

```text
> muc pip install -h
Usage: muc pip install [options]

install package

Options:
  -p, --package [package]          install package
  -r, --requirement [requirement]  install requirement
  -h, --help                       display help for command
```

`pip mirror` 相关操作如下：

```text
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

```text
> muc pip test -h
Usage: muc pip test [options]

test mirror

Options:
  -n, --name [name]  mirror name
  -h, --help         display help for command
```

## MuCli-Typora

对应的是上面的 `typora` 命令：

```text
> muc typora -h
Usage: muc typora [options] [command]

A SubCommand within MuCli for Typora

Options:
  -sv, --subversion  output the subversion of MuCli-Typora
  -h, --help         display help for command

Commands:
  init               init the config of Typora
  open [options]     open file with Typora
  info               get local typora path
  set [options]      set the path of Typora
  test               test the config of Typora
  help [command]     display help for command
```

这是将之前 Mmd-Typora 的功能单独拆分出来，目前支持的功能如下：

-   `init`：初始化 Typora 的配置文件
-   `open`：打开文件
-   `info`：获取本地 Typora 的路径
-   `set`：设置 Typora 的路径
-   `test`：测试 Typora 的配置
-   `help`：帮助

## FrontMatter

`Frontmatter` 即前言，用来说明书目的总结跟内容。

但是在 Markdown 中， Front-matter 指的是 `.md` 文件最开始的那部分，如本文，其 `Frontmatter` 为:

```markdown
---
Author: 目棃
Date: 2022-09-29
Description: 说明文档
Update: 2023-07-03
---
```

是以 `yaml` 格式在文件开头增加的元数据。

---

## LICENSE

本项目采用 [MIT](./LICENSE) 协议。
