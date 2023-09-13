/**
 * @file src/types/Npm.d.ts
 * @description Npm 类型定义
 * @since 1.0.0
 */

/**
 * @description Npm 包信息
 * @namespace Npm
 * @since 1.0.0
 * @return Npm
 */
declare namespace MUCLI.Npm {
  /**
   * @description 检测包信息的返回值
   * @interface CheckPackage
   * @since 1.0.0
   * @property {string} _id 包名
   * @property {string} _rev 版本号
   * @property {string} name 包名
   * @property {DistTags} 'dist-tags' 标签
   * @property {Record<string, unknown>} versions 各版本数据
   * @property {Record<string,string>} time 各版本时间相关
   * @property {unknown[]} maintainers
   * @property {string} description 描述
   * @property {string} homepage 首页
   * @property {string[]} keywords 关键词
   * @property {Record<string,string>} repository 仓库相关
   * @property {Record<string,string>} author 作者相关
   * @property {Record<string,string>} bugs bugs相关
   * @property {string} license license
   * @property {string} readme README
   * @property {string} readmeFilename README
   * @return CheckPackage
   */
  export interface CheckPackage {
    _id: string;
    _rev: string;
    name: string;
    "dist-tags": DistTags;
    versions: Record<string, string>;
    time: Record<string, string>;
    maintainers: unknown[];
    description: string;
    homepage: string;
    keywords: string[];
    repository: Record<string, string>;
    author: Record<string, string>;
    bugs: Record<string, string>;
    license: string;
    readme: string;
    readmeFilename: string;
  }

  /**
   * @description dist-tags
   * @since 1.0.0
   * @interface DistTags
   * @property {string} latest 最新
   * @return DistTags
   */
  export interface DistTags {
    latest: string;
  }
}
