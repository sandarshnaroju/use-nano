import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  generateApkWhenKeyStoreExists,
  generateDebugApkWhenKeyStoreExists,
  generateDebugApkWithoutKeystore,
} from "../app-release/android-release.js";
export const generateApk = (): void => {
  const args = process.argv.slice(2);

  const keyStorePath = args.slice(1);
  /* npx use-nano generate-apk release/debug --keystore <keystore file path> --keystore-password <keystore password --generated-apk <name.apk> > */
  if (
    keyStorePath[0] != null &&
    (keyStorePath[0] == "release" || keyStorePath[0] == "debug")
  ) {
    const argv = yargs(hideBin(process.argv)).argv;
  
    if (
      keyStorePath[0] != null &&
      keyStorePath[0] == "debug" &&
      argv["keystore-password"] == null &&
      argv["keystore"] == null
    ) {
   
      generateDebugApkWithoutKeystore({
        generatedApkName: argv["generated-apk"],
      });
    }
    if (
      argv != null &&
      argv.keystore != null &&
      argv["keystore-password"] != null &&
      argv["generated-apk"] != null
    ) {
      if (keyStorePath[0] == "release") {
        generateApkWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv["keystore-password"],
          generatedApkName: argv["generated-apk"],
        });
      }

      if (keyStorePath[0] == "debug") {
        generateDebugApkWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv["keystore-password"],
          generatedApkName: argv["generated-apk"],
        });
      }
    }
  }
};
