import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { runCommand } from "../../common.js";
import { createLauncherIcon } from "../launcher-icon/launcher-icon.js";
import {
  generateAabWhenKeyStoreExists,
  generateApkWhenKeyStoreExists,
  generateDebugAabWhenKeyStoreExists,
  generateDebugApkWhenKeyStoreExists,
} from "../app-release/android-release.js";
export const build = (): void => {
  /* npx use-nano build --name <newname> --launchericon <launcherIconPath> --keystorefile <keystore file>
       npx use-nano --generateapk release/debug --generatedapkname <apkname.apk> --keystore <keystore file path> --keystorepassword <keystore password >
       npx use-nano --generateaab release/debug --generatedaabname <apkname.aab> --keystore <keystore file path> --keystorepassword <keystore password > */

  const argv = yargs(hideBin(process.argv)).argv;
  if (argv) {
    if (argv.name && typeof argv.name == "string") {
      const command = `npx use-nano init ${argv.name}`;
      const commandRes = runCommand(command);
      if (!commandRes) process.exit(-1);
    }

    if (argv.launchericon && typeof argv.launchericon == "string") {
      createLauncherIcon({ userCommand: `create ${argv.launchericon}` });
    }
    if (
      argv.generateapk &&
      typeof argv.generateapk == "string" &&
      argv.keystore &&
      typeof argv.keystore == "string" &&
      argv.keystorepassword &&
      typeof argv.keystorepassword == "string" &&
      argv.generatedapkname &&
      typeof argv.generatedapkname == "string"
    ) {
      if (argv.generateapk === "release") {
        generateApkWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv.keystorepassword,
          generatedApkName: argv.generatedapkname,
        });
      }
      if (argv.generateapk === "debug") {
        generateDebugApkWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv.keystorepassword,
          generatedApkName: argv.generatedapkname,
        });
      }
    }
    if (
      argv.generateaab &&
      typeof argv.generateaab == "string" &&
      argv.keystore &&
      typeof argv.keystore == "string" &&
      argv.keystorepassword &&
      typeof argv.keystorepassword == "string" &&
      argv.generatedaabname &&
      typeof argv.generatedaabname == "string"
    ) {
      if (argv.generateapk === "release") {
        generateAabWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv.keystorepassword,
          generatedAabName: argv.generatedaabname,
        });
      }
      if (argv.generateapk === "debug") {
        generateDebugAabWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv.keystorepassword,
          generatedAabName: argv.generatedaabname,
        });
      }
    }
  }
};
