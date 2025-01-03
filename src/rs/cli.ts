/**
 * @file src/rs/cli.ts
 * @description rs 命令-入口文件
 * @since 1.5.0
 * @version 1.2.0
 */

import { Command } from "commander";
import ora from "ora";

import { getLatestVersion, printPackageInfo, readCargoToml } from "./utils";
import { getSubVersion } from "../utils/getBaseInfo";

const rs = new Command("rs");
const version = getSubVersion("rs");

// base info
rs.name("rs")
  .description("A cli tool for rs")
  .version(version, "-s, --subversion");

interface RsUpdateOptions {
  package: string | undefined;
}

// command for update package
rs.command("update")
  .description("update package")
  .option("-p, --package <package>", "package name")
  .action(async (opt: RsUpdateOptions) => {
    if (opt.package) {
      const spinner = ora(`Checking dependency ${opt.package}`).start();
      const crate = await getLatestVersion(opt.package);
      spinner.stop();
      if (!crate) {
        spinner.fail(`Check dependency ${opt.package} failed`);
        return;
      }
      const pkg: MUCLI.Rust.Package = {
        name: opt.package,
        version: crate.max_stable_version,
        latest: crate.max_version,
        needUpdate: false,
      };
      const print = printPackageInfo(pkg, false);
      spinner.succeed(`Check success:\n-${print[0]}`);
      return;
    }
    const res = await readCargoToml();
    const spinner = ora("Checking dependencies").start();
    if (res === false) {
      spinner.fail("No Cargo.toml file found or parse failed");
      return;
    }
    if (
      res.deps.length === 0 &&
      res.devDeps.length === 0 &&
      res.buildDeps.length === 0
    ) {
      spinner.info("No dependencies found");
      return;
    }
    const infoArr: Array<string> = ["Check success:"];
    if (res.buildDeps.length > 0) {
      infoArr.push("Build dependencies:");
      res.buildDeps.sort((a, b) =>
        a.needUpdate === b.needUpdate ? 0 : a.needUpdate ? -1 : 1,
      );
      res.buildDeps.forEach((pkg) => {
        const print = printPackageInfo(pkg, true);
        print.forEach((info) => infoArr.push(`-${info}`));
      });
    }
    if (res.deps.length > 0) {
      infoArr.push("Dependencies:");
      res.deps.sort((a, b) =>
        a.needUpdate === b.needUpdate ? 0 : a.needUpdate ? -1 : 1,
      );
      res.deps.forEach((pkg) => {
        const print = printPackageInfo(pkg, true);
        print.forEach((info) => infoArr.push(`-${info}`));
      });
    }
    if (res.devDeps.length > 0) {
      infoArr.push("Dev dependencies:");
      res.devDeps.sort((a, b) =>
        a.needUpdate === b.needUpdate ? 0 : a.needUpdate ? -1 : 1,
      );
      res.devDeps.forEach((pkg) => {
        const print = printPackageInfo(pkg, true);
        print.forEach((info) => infoArr.push(`-${info}`));
      });
    }
    spinner.succeed(infoArr.join("\n"));
  });

export default rs;
