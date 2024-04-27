#!/usr/bin/env node

import inquirer from "inquirer";
import {
  downloadFileAtPathGiven,
  getKeystorePathAndPasswordArray,
  getNanoVersionAndReactNativeVersion,
  moveFile,
  runCommand,
} from "./src/common.js";
// const yargs = require("yargs/yargs");
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { themeText, commonUrl } from "./src/Constants.js";
import { setupAndroidIcons } from "./src/icons/AndroidIcons.js";
import { setupIosIcons } from "./src/icons/IosIcons.js";
import { createLauncherIcon } from "./src/launcherIcon/createLauncherIcons.js";
import { renameAndroidProject } from "./src/rename/Rename.js";
import {
  initialiseRNProjectInWindowsAndDeleteApptsxFile,
  createWindowsFolderStructureForMinimalProject,
  installWindowsRequiredPackagesInRNProject,
  setUpANewProjectWithDefaultLoadingScreenForWindows,
  addNanoConfigToExistingWindowsProject,
  createBabelConfigFileForWindows,
} from "./src/windows.js";
import {
  askUserInfoToGenerateKeyStoreFile,
  generateAabWhenKeyStoreExists,
  generateApkWhenKeyStoreExists,
  generateDebugAabWhenKeyStoreExists,
  generateDebugApkWhenKeyStoreExists,
} from "./src/apprelease/AndroidRelease.js";

const createNanoConfig = (repoName, id, secret) => {
  let clientIdCommand = "";
  if (id != null && secret != null) {
    clientIdCommand = `cd ${repoName} &&  printf 'export const LOAD_PRIORITY = "dynamic"; \n export const CLIENT_ID = '${id}'; \nexport const CLIENT_SECRET = '${secret}'; \nexport const RELOAD_TIME = 10000; \n ${themeText}   \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   ' > nano.config.js `;
  } else {
    clientIdCommand = `cd ${repoName} && printf 'export const LOAD_PRIORITY = "static"; \n export const CLIENT_ID = "id"; \nexport const CLIENT_SECRET = "secret"; \nexport const RELOAD_TIME = 10000; \n ${themeText}  \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   ' > nano.config.js `;
  }

  const clientIdCommandRes = runCommand(clientIdCommand);

  if (!clientIdCommandRes) process.exit(-1);
};

const addNanoConfigToExistingProject = (repoName, id, secret, appUrl) => {
  let clientIdCommand = "";
  if (id != null && secret != null) {
    clientIdCommand = `cd ${repoName} &&  printf 'export const LOAD_PRIORITY = "dynamic"; \n export const CLIENT_ID = "${id}"; \nexport const CLIENT_SECRET = "${secret}"; \nexport const APP_URL = "${appUrl}";\n ${themeText} \nexport const RELOAD_TIME = 10000;  \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   ' > nano.config.js `;
  } else {
    clientIdCommand = ` cd ${repoName} && printf 'export const LOAD_PRIORITY = "static"; \n export const CLIENT_ID = "id"; \nexport const CLIENT_SECRET = "secret"; \nexport const APP_URL = 'appurl'; \n ${themeText} \nexport const RELOAD_TIME = 10000; \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   ' > nano.config.js `;
  }

  const clientIdCommandRes = runCommand(clientIdCommand);

  if (!clientIdCommandRes) process.exit(-1);
};
const createBabelConfigFile = () => {
  downloadFileAtPathGiven({
    path: repoName,
    url: commonUrl + "babel.config.js",
  });
  // moveFile({ path: repoName, source: "App2.js", destination: "App.js" });
};
const createFolderStructureForMinimalProject = () => {
  downloadFileAtPathGiven({ path: repoName, url: commonUrl + "App2.js" });
  moveFile({ path: repoName, source: "App2.js", destination: "App.js" });
};
const createFolderStructureWithDefaultLoadingScreen = () => {
  downloadFileAtPathGiven({ path: repoName, url: commonUrl + "App3.js" });
  moveFile({ path: repoName, source: "App3.js", destination: "App.js" });
};

const changeJavaFilesForVectorIcons = ({ repoName }) => {
  const deleteAppts = `cd ${repoName}/android/ && echo "include ':react-native-vector-icons'
    project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')" >> settings.gradle`;
  const delCommand = runCommand(deleteAppts);
  if (!delCommand) process.exit(-1);
  const deleteAppt = `cd ${repoName}/android/app && awk '/dependencies/ {print; print \"    implementation project(\\\":react-native-vector-icons\\\")\"; next}1' build.gradle > temp && mv temp build.gradle`;

  const delComman = runCommand(deleteAppt);
  if (!delComman) process.exit(-1);

  downloadFileAtPathGiven({
    path: repoName + "/android/app/src/main",
    url: commonUrl + "assets.zip",
  });
  const downloadFontsZipCommand = `cd ${repoName}/android/app/src/main &&  unzip assets.zip > /dev/null  &&  rm -rf assets.zip`;
  const downloadresult = runCommand(downloadFontsZipCommand);
  if (!downloadresult) process.exit(-1);
};
const initialiseReactNativeProjectAndDeleteApptsxFile = ({
  repoName,
  reactNativeVers,
}) => {
  const RNversionString =
    reactNativeVers != null ? `--version ${reactNativeVers}` : "";

  const reactnativeinstall = `npx react-native init ${repoName} ${RNversionString}`;
  const checkedOut = runCommand(reactnativeinstall);
  if (!checkedOut) process.exit(-1);

  const deleteAppts = `cd ${repoName} && rm -rf App.tsx `;
  const delCommand = runCommand(deleteAppts);
  if (!delCommand) process.exit(-1);
};

const npmInstallRequiredPackagesInRNProject = ({
  repoName,
  appId,
  appSecret,
  isSyncFunctionalityRequired = false,
  nanoversion = null,
}) => {
  const syncCommand = isSyncFunctionalityRequired ? "rn-nano-sync " : "";
  const nanoVer =
    nanoversion != null && nanoversion != "" ? `@${nanoversion}` : "";
  const installScreensAndSafeArea = `cd ${repoName} && npm install --save react-native-nano${nanoVer} react-native-rsa-native  react-native-reanimated@3.6.2 react-native-safe-area-context react-native-screens realm@11.10.2 @notifee/react-native react-native-pager-view react-native-device-info react-native-image-crop-picker react-native-permissions@3.6.1 ${syncCommand} `;
  const installScreensAndSafeAreaResult = runCommand(installScreensAndSafeArea);

  if (!installScreensAndSafeAreaResult) process.exit(-1);
  createNanoConfig(repoName, appId, appSecret);
  changeJavaFilesForVectorIcons({ repoName });

  console.log("Welcome to Nano");
};

const setUpANewProjectWithDefaultLoadingScreen = ({
  repoName,
  appId = null,
  appSecret = null,
  nanoversion,
  reactNativeVers,
}) => {
  initialiseReactNativeProjectAndDeleteApptsxFile({
    repoName,
    reactNativeVers,
  });
  createFolderStructureWithDefaultLoadingScreen();
  npmInstallRequiredPackagesInRNProject({
    repoName,
    appId,
    appSecret,
    nanoversion,
    isSyncFunctionalityRequired: true,
  });
};

const setUpANewMinimalProject = async ({
  repoName,
  appId = null,
  appSecret = null,
  nanoversion,
  reactNativeVers,
}) => {
  if (process.platform === "win32") {
    /// execute only for windows
    initialiseRNProjectInWindowsAndDeleteApptsxFile({
      repoName,
      reactNativeVers,
    });
    createBabelConfigFileForWindows({ commonUrl: commonUrl, repoName });
    createWindowsFolderStructureForMinimalProject({ repoName });
    await installWindowsRequiredPackagesInRNProject({
      repoName,
      appId,
      nanoversion,
    });
    process.exit(0);
  } else {
    initialiseReactNativeProjectAndDeleteApptsxFile({
      repoName,
      reactNativeVers,
    });
    createBabelConfigFile();
    createFolderStructureForMinimalProject();
    npmInstallRequiredPackagesInRNProject({
      repoName,
      appId,
      appSecret,
      nanoversion,
    });
    process.exit(0);
  }
};

const createProjectWithSyncEnabled = ({
  projectName,
  nanoversion,
  reactNativeVers,
}) => {
  inquirer
    .prompt([
      /* Pass your questions in here */

      {
        type: "input",
        name: "app_id",

        message: "Enter your appId",
      },
      {
        type: "input",
        name: "app_secret",
        message: "Enter your appSecret",
      },
      {
        type: "input",
        name: "app_url",
        message: "Enter your app url",
      },
    ])
    .then((answers) => {
      // Use user feedback for... whatever!!
      if (
        answers != null &&
        answers["app_id"] != null &&
        answers["app_secret"] != null &&
        answers["app_url"] != null
      ) {
        if (process.platform === "win32") {
          setUpANewProjectWithDefaultLoadingScreenForWindows({
            repoName: projectName,
            nanoversion,
            reactNativeVers,
          });
          createBabelConfigFileForWindows({
            commonUrl: commonUrl,
            repoName: projectName,
          });

          addNanoConfigToExistingWindowsProject(
            projectName,
            answers["app_id"],
            answers["app_secret"],
            answers["app_url"]
          );
        } else {
          setUpANewProjectWithDefaultLoadingScreen({
            repoName: projectName,
            nanoversion,
            reactNativeVers,
          });
          createBabelConfigFile();
          addNanoConfigToExistingProject(
            projectName,
            answers["app_id"],
            answers["app_secret"],
            answers["app_url"]
          );
        }
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else went wrong
      }
    });
};

const args = process.argv.slice(2);

const command = args[0];
const repoName = args[1];
const firstArgCommand = args[2];
const firstArgValue = args[3];

const secondArgCommand = args[4];
const secondArgValue = args[5];

switch (command) {
  case "init":
    inquirer
      .prompt([
        /* Pass your questions in here */
        {
          type: "list",
          name: "template_type",
          message: "What kind of project do you want?",
          choices: [
            { name: "a) Simple Hello World project ", value: "a" },

            {
              name: "b) Connect to existing project at nanoapp.dev",
              value: "b",
            },
          ],
        },
      ])
      .then((answers) => {
        const versionValuesArray = getNanoVersionAndReactNativeVersion({
          firstArgCommand,
          firstArgValue,
          secondArgCommand,
          secondArgValue,
        });

        // Use user feedback for... whatever!!

        if (answers != null && answers["template_type"] != null) {
          switch (answers["template_type"]) {
            case "a":
              //  returns [nanoVersion, react native version]
              setUpANewMinimalProject({
                repoName,
                nanoversion: versionValuesArray[0],
                reactNativeVers: versionValuesArray[1],
              });
              break;

            case "b":
              createProjectWithSyncEnabled({
                projectName: repoName,
                nanoversion: versionValuesArray[0],
                reactNativeVers: versionValuesArray[1],
              });

              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      });
    break;

  case "rename":
    const userCommand = args.slice(1).join(" ");
    renameAndroidProject({ userCommand });

    break;

  case "icons":
    const platform = args.slice(1);
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
    const keyStorePath = args.slice(1);
    // npx rn-nano generate-apk release/debug --keystore <keystore file path> --keystorepassword <keystore password --generatedaab <name.aab> >
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

    break;
  case "generate-aab":
    const keyStorePat = args.slice(1);
    // npx rn-nano generate-aab release/debug --keystore <keystore file path> --keystorepassword <keystore password >

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

    break;
  case "build":
    // npx rn-nano build --name <newname> --launchericon <launcherIconPath> --keystorefile <keystore file>
    // npx rn-nano --generateapk release/debug --generatedapkname <apkname.apk> --keystore <keystore file path> --keystorepassword <keystore password >
    // npx rn-nano --generateaab release/debug --generatedaabname <apkname.aab> --keystore <keystore file path> --keystorepassword <keystore password >

    const argv = yargs(hideBin(process.argv)).argv;
    if (argv) {
      if (argv.name && typeof argv.name == "string") {
        console.log("Creating project ", argv.name);
        const command = `npx rn-nano init ${argv.name}`;
        const commandRes = runCommand(command);
        if (!commandRes) process.exit(-1);
      }
      // if (argv.rename && typeof argv.rename == "string") {
      //   console.log("Renaming project to ", argv.rename);
      //   let command = `"${argv.rename}"`;
      //   if (argv.packagename && typeof argv.packagename == "string") {
      //     command = command + ` -b "${argv.packagename}"`;
      //   }
      //   renameAndroidProject({ userCommand: command });
      // }
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

    break;
  default:
    console.log(
      "To create a new Nano project use \n npx rn-nano init myawesomeproject "
    );
    break;
}
