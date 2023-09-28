---
Author: 目棃
Description: 说明文档
Date: 2023-09-10
Update: 2023-09-28
---

> 本文档 [`Frontmatter`](https://github.com/BTMuli/MuCli#Frontmatter) 由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于 `2023-09-10 11:38:39`
>
> 更新于 `2023-09-28 17:46:06`

[![](https://img.shields.io/github/license/BTMuli/MuCli?style=for-the-badge)](./LICENSE) ![](https://img.shields.io/github/package-json/v/btmuli/mucli?style=for-the-badge) ![](https://img.shields.io/github/last-commit/btmuli/mucli?style=for-the-badge)

# MuCli

A Node CLI for personal use by BTMuli.

## Install

By npm:

```bash
npm install -g @btmuli/mucli
```

## Usage

```bash
muc [command] [options]
```

## What can MuCli do?

It can do some things:

Using `muc set` to change the subcommand enabled.

Using `muc mmd` to create/update a markdown file with `Frontmatter`.

You can use `muc -h` to get more information, and there will be more subcommands in the future.

## Frontmatter

What is `Frontmatter`?

> Frontmatter is metadata at the top of a file. It is commonly used to specify the title, author, and date of a document, but can be used for any kind of metadata.

For example，this file's `Frontmatter` is(since `2023-09-10 11:38:39`):

```yaml
---
Author: 目棃
Description: 说明文档
Date: 2023-09-10
Update: 2023-09-10
---
```

And the subcommand `mmd` add two more lines:

```yaml
---
Author: 目棃
Description: 说明文档
Date: 2023-09-10
Update: 2023-09-10
---

> 本文档 [`Frontmatter`](https://github.com/BTMuli/MuCli#Frontmatter) 由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于 `2023-09-10 11:38:39`
>
> 更新于 `2023-09-10 11:38:39`
```

The template to create a new file in `./template/MuCli/README.md` is:

```markdown
---
Author: author
Description: description
Date: date
Update: update
---

> 本文档 [`Frontmatter`](https://github.com/BTMuli/MuCli#Frontmatter) 由 [MuCli](https://github.com/BTMuli/Mucli) 自动生成于 `create`
>
> 更新于 `modify`
```

It includes some properties:

- `Author`: The author of the file.
- `Description`: The description of the file.
- `Date`: The date of the file created, format: `YYYY-MM-DD`.
- `Update`: The date of the file updated, format: `YYYY-MM-DD`.
- `create`: The date of the file created, format: `YYYY-MM-DD HH:mm:ss`.
- `modify`: The date of the file updated, format: `YYYY-MM-DD HH:mm:ss`.

## License

[MIT](./LICENSE)
