import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  generateAabWhenKeyStoreExists,
  generateDebugAabWhenKeyStoreExists,
} from "../app-release/androidRelease.js";
export const generateAab = (): void => {
  const args = process.argv.slice(2);

  const keyStorePat = args.slice(1);
  /* npx rn-nano generate-aab release/debug --keystore <keystore file path> --keystorepassword <keystore password > */

  if (
    keyStorePat[0] != null &&
    (keyStorePat[0] == "release" || keyStorePat[0] == "debug")
  ) {
    const argv = yargs(hideBin(process.argv)).argv;

    if (
      argv != null &&
      argv.keystore != null &&
      argv.keystorepassword != null &&
      argv.generatedaab != null
    ) {
      if (keyStorePat[0] == "release") {
        generateAabWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv.keystorepassword,
          generatedAabName: argv.generatedaab,
        });
      }

      if (keyStorePat[0] == "debug") {
        generateDebugAabWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv.keystorepassword,
          generatedAabName: argv.generatedaab,
        });
      }
    }
  }
};
