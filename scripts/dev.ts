/**
 * @file script/dev.ts
 * @description dev测试脚本，用于hotfix测试
 * @since 1.3.0
 */

import { execSync } from "node:child_process";

import appRootPath from "app-root-path";
import * as chokiadr from "chokidar";

const watcher = chokiadr.watch(appRootPath.path + "/src", {
  persistent: true,
});

let building = false;

watcher.on("change", (file) => {
  console.log(`File ${file} has been changed`);
  // 如果不是ts文件，直接返回
  if (!file.endsWith(".ts")) {
    return;
  }
  if (building) {
    return;
  }
  building = true;
  const res = execSync("pnpm build");
  console.log(res.toString());
  building = false;
});
