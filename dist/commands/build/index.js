import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { runCommand } from "../../common.js";
import { createLauncherIcon } from "../launcher-icon/launcher-icon.js";
import { generateAabWhenKeyStoreExists, generateApkWhenKeyStoreExists, generateDebugAabWhenKeyStoreExists, generateDebugApkWhenKeyStoreExists, } from "../app-release/android-release.js";
export const build = () => {
    /* npx use-nano build --name <newname> --launchericon <launcherIconPath> --keystorefile <keystore file>
         npx use-nano --generate-apk release/debug --generated-apk-name <apkname.apk> --keystore <keystore file path> --keystore-password <keystore password >
         npx use-nano --generate-aab release/debug --generated-aab-name <apkname.aab> --keystore <keystore file path> --keystore-password <keystore password > */
    const argv = yargs(hideBin(process.argv)).argv;
    if (argv) {
        if (argv.name && typeof argv.name == "string") {
            const command = `npx use-nano init ${argv.name}`;
            const commandRes = runCommand(command);
            if (!commandRes)
                process.exit(-1);
        }
        if (argv["launcher-icon"] && typeof argv["launcher-icon"] == "string") {
            createLauncherIcon({ userCommand: `create ${argv["launcher-icon"]}` });
        }
        if (argv["generate-apk"] &&
            typeof argv["generate-apk"] == "string" &&
            argv.keystore &&
            typeof argv.keystore == "string" &&
            argv["keystore-password"] &&
            typeof argv["keystore-password"] == "string" &&
            argv["generated-apk-name"] &&
            typeof argv["generated-apk-name"] == "string") {
            if (argv["generate-apk"] === "release") {
                generateApkWhenKeyStoreExists({
                    keyStoreName: argv.keystore,
                    keyStorePassword: argv["keystore-password"],
                    generatedApkName: argv["generated-apk-name"],
                });
            }
            if (argv["generate-apk"] === "debug") {
                generateDebugApkWhenKeyStoreExists({
                    keyStoreName: argv.keystore,
                    keyStorePassword: argv["keystore-password"],
                    generatedApkName: argv["generated-apk-name"],
                });
            }
        }
        if (argv["generate-aab"] &&
            typeof argv["generate-aab"] == "string" &&
            argv.keystore &&
            typeof argv.keystore == "string" &&
            argv["keystore-password"] &&
            typeof argv["keystore-password"] == "string" &&
            argv["generated-aab-name"] &&
            typeof argv["generated-aab-name"] == "string") {
            if (argv["generate-apk"] === "release") {
                generateAabWhenKeyStoreExists({
                    keyStoreName: argv.keystore,
                    keyStorePassword: argv["keystore-password"],
                    generatedAabName: argv["generated-aab-name"],
                });
            }
            if (argv["generate-apk"] === "debug") {
                generateDebugAabWhenKeyStoreExists({
                    keyStoreName: argv.keystore,
                    keyStorePassword: argv["keystore-password"],
                    generatedAabName: argv["generated-aab-name"],
                });
            }
        }
    }
};
//# sourceMappingURL=index.js.map