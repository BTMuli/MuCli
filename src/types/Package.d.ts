/**
 * @file src/types/Package.d.ts
 * @description package.json 文件类型定义
 * @since 1.4.0
 */

/**
 * @description package.json 文件类型定义
 * @namespace Package
 * @since 1.4.0
 * @return namespace
 */
declare namespace MUCLI.Package {
  /**
   * @description package.json 文件类型定义
   * @interface FullInfo
   * @since 1.4.0
   * @property {string} name - 包名
   * @property {string} version - 版本号
   * @property {string} description - 描述
   * @property {string} packageManager - 包管理器
   * @property {Record<SubCommandEnum, string>} subVersion - 子版本号
   * @property {Record<string, string>} scripts - 脚本
   * @property {string} type - 类型
   * @property {Record<string, string>} bin - 命令
   * @property {Record<string, string|string[]>} "lint-staged" - git 钩子
   * @property {Array<string>} keywords - 关键字
   * @property {string} author - 作者
   * @property {Record<string, string>} respository - 仓库
   * @property {string} license - 许可证
   * @property {string} homepage - 主页
   * @property {Record<string, string>} bugs - bug 地址
   * @property {Record<string, string>} dependencies - 依赖
   * @property {Record<string, string>} devDependencies - 开发依赖
   * @return FullInfo
   */
  interface FullInfo {
    name: string;
    version: string;
    description: string;
    packageManager: string;
    subVersion: Record<SubCommandEnum, string>;
    scripts: Record<string, string>;
    type: string;
    bin: Record<string, string>;
    "lint-staged": Record<string, string | string[]>;
    keywords: string[];
    author: string;
    respository: Record<string, string>;
    license: string;
    homepage: string;
    bugs: Record<string, string>;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  }

  /**
   * @description 子命令
   * @interface SubCommand
   * @since 1.4.0
   * @property dev - 子命令 dev
   * @property git - 子命令 git
   * @property mmd - 子命令 mmd
   * @property pip - 子命令 pip
   * @property rs - 子命令 rs
   * @return SubCommand
   */
  enum SubCommand {
    dev,
    git,
    mmd,
    pip,
    rs,
  }

  /**
   * @description 子命令枚举类
   * @since 1.4.0
   * @type SubCommandEnum
   */
  type SubCommandEnum = keyof typeof SubCommand;
}
