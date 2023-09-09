/**
 * @file src/types/Config.d.ts
 * @description 配置文件类型定义
 * @since 1.0.0
 */

/**
 * @description 配置文件类型定义
 * @namespace Config
 * @since 1.0.0
 * @return Config
 */
declare namespace MUCLI.Config {
  /**
   * @description 基本配置
   * @interface Base
   * @since 1.0.0
   * @property {string} name - 名称
   * @property {boolean} enable - 是否启用
   * @return Base
   */
  export interface Base {
    name: string;
    enable: boolean;
  }

  /**
   * @description 配置文件类型定义
   * @interface FullInfo
   * @since 1.0.0
   * @property {Dev} dev - 子命令 dev 配置
   * @property {Mmd} mmd - 子命令 mmd 配置
   * @property {number} update - 更新时间戳（秒）
   * @return FullInfo
   */
  export interface FullInfo {
    dev: Dev;
    mmd: Mmd;
    update: number;
  }

  /**
   * @description 子命令 dev 配置
   * @interface Dev
   * @since 1.0.0
   * @extends Base
   * @return Dev
   */
  export interface Dev extends Base {}

  /**
   * @description 子命令 mmd 配置
   * @interface Mmd
   * @since 1.0.0
   * @extends Base
   * @property {MmdLabel[]} labels - 模板
   * @property {MmdLabel} defaultLabel - 默认模板
   * @return Mmd
   */
  export interface Mmd extends Base {
    labels: MmdLabel[];
    defaultLabel: MmdLabel;
  }

  /**
   * @description Mmd 模板
   * @interface MmdLabel
   * @since 1.0.0
   * @property {string} author - 作者
   * @property {string} filename - 文件名
   * @property {string} description - 描述
   * @return MmdLabel
   */
  export interface MmdLabel {
    author: string;
    filename: string;
    description: string;
  }
}
