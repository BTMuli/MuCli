/**
 * @file Markdown.d.ts
 * @description 子命令 mmd 的类型声明文件
 * @since 1.2.1
 * @version 1.1.0
 */

/**
 * @description markdown 类型声明
 * @namespace Markdown
 * @since 1.2.1
 * @version 1.1.0
 * @return Markdown
 */
declare namespace MUCLI.Markdown {
  /**
   * @description markdown frontmatter 类型声明
   * @interface Frontmatter
   * @since 1.0.0
   * @property {string} author markdown 文件作者
   * @property {string} description markdown 文件描述
   * @property {string} date markdown 文件创建时间，YYYY-MM-DD
   * @property {string} update markdown 文件更新时间，YYYY-MM-DD
   * @property {string} create markdown 文件创建时间，YYYY-MM-DD HH:mm:ss
   * @property {string} modify markdown 文件更新时间，YYYY-MM-DD HH:mm:ss
   * @return Frontmatter
   */
  interface Frontmatter {
    author: string;
    description: string;
    date: string;
    update: string;
    create: string;
    modify: string;
  }

  /**
   * @description markdown frontmatter 类型声明
   * @interface FrontmatterFull
   * @since 1.2.1
   * @version 1.1.0
   * @property {Frontmatter} fm frontmatter
   * @property {Record<string,string>} raw 原始 frontmatter
   * @return FrontmatterFull
   */
  interface FrontmatterFull {
    fm: Frontmatter;
    raw: Record<string, string>;
  }

  /**
   * @description 创建时的 options 类型声明
   * @interface CreateOptions
   * @since 1.2.1
   * @version 1.1.0
   * @property {string} create 创建时间
   * @property {Record<string,string>} raw 原始 frontmatter
   * @return CreateOptions
   */
  interface CreateOptions {
    create?: string;
    raw?: Record<string, string>;
  }
}
