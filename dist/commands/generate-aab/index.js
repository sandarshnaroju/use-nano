import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { generateAabWhenKeyStoreExists, generateDebugAabWhenKeyStoreExists, } from "../app-release/android-release.js";
export const generateAab = () => {
    const args = process.argv.slice(2);
    const keyStorePat = args.slice(1);
    /* npx use-nano generate-aab release/debug --keystore <keystore file path> --keystore-password <keystore password > */
    if (keyStorePat[0] != null &&
        (keyStorePat[0] == "release" || keyStorePat[0] == "debug")) {
        const argv = yargs(hideBin(process.argv)).argv;
        if (argv != null &&
            argv.keystore != null &&
            argv["keystore-password"] != null &&
            argv["generated-aab"] != null) {
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
//# sourceMappingURL=index.js.map