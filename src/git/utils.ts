/**
 * @file src/git/utils.ts
 * @description git 命令-工具函数
 * @since 1.4.0
 * @version 1.0.0
 */

/**
 * @description 获取 proxy 命令
 * @since 1.4.0
 * @param {string} proxy - proxy 路径
 * @param {boolean} status - 目标状态
 * @param {boolean} isHttps - 是否是https
 * @return {string}
 */
export function getProxyCommand(
  proxy: string,
  status: boolean,
  isHttps: boolean,
): string {
  let command = "git config --global";
  if (!status) {
    if (isHttps) command += " --unset https.proxy";
    else command += " --unset http.proxy";
  } else {
    if (isHttps) command += ` https.proxy ${proxy}`;
    else command += ` http.proxy ${proxy}`;
  }
  return command;
}
