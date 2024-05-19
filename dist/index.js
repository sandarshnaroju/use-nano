#! /usr/bin/env node
import { setupAndroidIcons } from "./commands/icons/androidIcons.js";
import { setupIosIcons } from "./commands/icons/iosIcons.js";
import { createLauncherIcon } from "./commands/launcherIcon/createLauncherIcons.js";
import { renameAndroidProject } from "./commands/rename/rename.js";
import { initProjectCreation } from "./commands/init/index.js";
import { generateApk } from "./commands/generate-apk/index.js";
import { generateAab } from "./commands/generate-aab/index.js";
import { build } from "./commands/build/index.js";
import { askUserInfoToGenerateKeyStoreFile } from "./commands/generate-keystore/index.js";
const args = process.argv.slice(2);
const command = args[0];
const repoName = args[1];
function start() {
    switch (command) {
        case "init":
            initProjectCreation({ repoName: repoName });
            break;
        case "rename":
            const userCommand = args.slice(1).join(" ");
            renameAndroidProject({ userCommand });
            break;
        case "icons":
            // const platform = args.slice(1);
            const platform = args.slice(1)[0];
            switch (platform) {
                case "android":
                    setupAndroidIcons();
                    break;
                case "ios":
                    setupIosIcons();
                    break;
                default:
                    break;
            }
            break;
        case "launcher-icon":
            const launcherIconArgs = args.slice(1).join(" ");
            createLauncherIcon({ userCommand: launcherIconArgs });
            break;
        case "generate-keystore-file":
            askUserInfoToGenerateKeyStoreFile();
            break;
        case "generate-apk":
            generateApk();
            break;
        case "generate-aab":
            generateAab();
            break;
        case "build":
            build();
            break;
        default:
            console.log("To create a new Nano project use \n npx rn-nano init myawesomeproject ");
            break;
    }
}
start();
// fs.unlinkSync(`mammamamama/android/app/src/main/assets.zip`);
//# sourceMappingURL=index.js.map