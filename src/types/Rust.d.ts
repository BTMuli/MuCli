/**
 * @file types/Rust.d.ts
 * @description Rust 子命令类型声明文件
 * @since 1.4.2
 */

declare namespace MUCLI.Rust {
  /**
   * @description 解析后的 Cargo.toml 文件
   * @interface CargoToml
   * @since 1.4.2
   * @property {Package[]} buildDeps 构建依赖
   * @property {Package[]} devDeps 开发依赖
   * @property {Package[]} deps 依赖
   * @return CargoToml
   */
  type CargoToml = {
    buildDeps: Package[];
    devDeps: Package[];
    deps: Package[];
  };

  /**
   * @description 转换后的包信息
   * @interface Package
   * @since 1.4.2
   * @property {string} name 包名
   * @property {string} version 版本号
   * @property {string} latest 最新版本号
   * @property {boolean} needUpdate 是否需要更新
   * @return Package
   */
  type Package = {
    name: string;
    version: string;
    latest: string;
    needUpdate: boolean;
  };

  /**
   * @description cargo.toml 的包信息
   * @interface PackageInfo
   * @since 1.4.2
   * @property {string} version 版本号
   * @property {Array<string>} features 特性
   * @return PackageInfo
   */
  type PackageInfo = { version: string; features?: string[] } | string;

  /**
   * @description 从 cargo.io 获取的数据
   * @interface CargoIoData
   * @since 1.4.2
   * @property {Crate} crate 包信息
   * @return CargoIoData
   */
  type CargoIoData = { crate: Crate };

  /**
   * @description 包信息
   * @interface Crate
   * @since 1.4.2
   * @property {string} max_stable_version 最新稳定版本
   * @property {string} max_version 最新版本
   * @return Crate
   */
  type Crate = { max_stable_version: string; max_version: string };
}
