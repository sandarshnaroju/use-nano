#! /usr/bin/env node
import { setupAndroidIcons } from "./commands/icons/android-icons.js";
import { setupIosIcons } from "./commands/icons/ios-icons.js";
import { createLauncherIcon } from "./commands/launcher-icon/launcher-icon.js";
import { renameAndroidProject } from "./commands/rename/rename.js";

import { initProjectCreation } from "./commands/init/index.js";
import { generateApk } from "./commands/generate-apk/index.js";
import { generateAab } from "./commands/generate-aab/index.js";
import { build } from "./commands/build/index.js";
import { askUserInfoToGenerateKeyStoreFile } from "./commands/generate-keystore/index.js";
import { convertDocsToPdf } from "./commands/md-to-pdf/md-to-pdf.js";
import { changeAppUrlAppIdAppSecretInExistingProject } from "./commands/configure/index.js";
import { initProjectCommand } from "./commands/project/index.js";
import { updateVersion } from "./commands/version/index.js";
import { createWebBundle } from "./commands/web-bundle/index.js";

const args = process.argv.slice(2);
const command = args[0];
const repoName = args[1];

function start(): void {
  switch (command) {
    case "init":
      initProjectCreation({ repoName: repoName });

      break;

    case "rename":
      const userCommand = args.slice(1).join(" ");
      renameAndroidProject({ userCommand });

      break;

    case "icons":
      const platform: string = args.slice(1)[0];
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
    case "md-to-pdf":
      const docsPath = args[1];
      const resultPdfName = args[2];

      convertDocsToPdf({ dirPath: docsPath, resultPdfName });

      break;
    case "configure":
      changeAppUrlAppIdAppSecretInExistingProject();
      break;
    case "project":
      // npx use-nano project --screens <base64> --assets <base64> --app-icon <path string> --packages <base64> --version-code <string> --version-number <integer>
      initProjectCommand();
      break;
    case "version":
      updateVersion()
      break;

    case 'web-bundle':
      createWebBundle()
      break;
    default:
      console.log(
        "To create a new Nano project use \n npx use-nano init myawesomeproject "
      );
      break;
  }
}

start();
