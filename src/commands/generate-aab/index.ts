import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  generateAabWhenKeyStoreExists,
  generateDebugAabWhenKeyStoreExists,
  generateDebugAabWithoutKeystore,
  generateReleaseAabWithoutKeystore,
} from "../app-release/android-release.js";
export const generateAab = (): void => {
  const args = process.argv.slice(2);

  const keyStorePat = args.slice(1);
  /* npx use-nano generate-aab release/debug --keystore <keystore file path> --keystore-password <keystore password > */

  if (
    keyStorePat[0] != null &&
    (keyStorePat[0] == "release" || keyStorePat[0] == "debug")
  ) {
    const argv = yargs(hideBin(process.argv)).argv;
    if (
      keyStorePat[0] != null &&
      keyStorePat[0] == "debug" &&
      argv["keystore-password"] == null &&
      argv["keystore"] == null
    ) {
      generateDebugAabWithoutKeystore({
        generatedAabName: argv["generated-aab"],
      });
    }
    if (
      keyStorePat[0] != null &&
      keyStorePat[0] == "release" &&
      argv["keystore-password"] == null &&
      argv["keystore"] == null
    ) {
      generateReleaseAabWithoutKeystore({
        generatedAabName: argv["generated-aab"],
      });
    }
    if (
      argv != null &&
      argv.keystore != null &&
      argv["keystore-password"] != null &&
      argv["generated-aab"] != null
    ) {
      if (keyStorePat[0] == "release") {
        generateAabWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv["keystore-password"],
          generatedAabName: argv["generated-aab"],
        });
      }

      if (keyStorePat[0] == "debug") {
        generateDebugAabWhenKeyStoreExists({
          keyStoreName: argv.keystore,
          keyStorePassword: argv["keystore-password"],
          generatedAabName: argv["generated-aab"],
        });
      }
    }
  }
};
