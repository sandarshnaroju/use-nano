import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  generateApkWhenKeyStoreExists,
  generateDebugApkWhenKeyStoreExists,
} from "../app-release/android-release.js";
export const generateApk = (): void => {
  const args = process.argv.slice(2);

  const keyStorePath = args.slice(1);
  /* npx rn-nano generate-apk release/debug --keystore <keystore file path> --keystorepassword <keystore password --generatedaab <name.aab> > */
  if (
    keyStorePath[0] != null &&
    (keyStorePath[0] == "release" || keyStorePath[0] == "debug")
  ) {
    const argv = yargs(hideBin(process.argv)).argv;

    if (
      argv != null &&
      argv.keystore != null &&
      argv.keystorepassword != null &&
      argv.generatedapk != null
    ) {
      if (keyStorePath[0] == "release") {
        generateApkWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv.keystorepassword,
          generatedApkName: argv.generatedapk,
        });
      }

      if (keyStorePath[0] == "debug") {
        generateDebugApkWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv.keystorepassword,
          generatedApkName: argv.generatedapk,
        });
      }
    }
  }
};
