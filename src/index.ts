#! /usr/bin/env node

import extract from "extract-zip";
import inquirer from "inquirer";

import {
  getNanoVersionAndReactNativeVersion,
  moveFileByNode,
  runCommand,
} from "./common.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import fs from "fs";
import { themeText, commonUrl, COMMAND_ARGUMENTS } from "./Constants.js";
import { setupAndroidIcons } from "./icons/AndroidIcons.js";
import { setupIosIcons } from "./icons/IosIcons.js";
import { createLauncherIcon } from "./launcherIcon/createLauncherIcons.js";
import { renameAndroidProject } from "./rename/Rename.js";

import {
  askUserInfoToGenerateKeyStoreFile,
  generateAabWhenKeyStoreExists,
  generateApkWhenKeyStoreExists,
  generateDebugAabWhenKeyStoreExists,
  generateDebugApkWhenKeyStoreExists,
} from "./apprelease/AndroidRelease.js";
import { downloadFileWithCallback } from "./Utilities.js";
import path from "path";
import { exec, execSync } from "child_process";
import { getPackageVersion } from "./Versions.js";
let realmVersion = null;
let reanimatedVersion = null;
let reactNativeVersion = null;
let rnNanoVersion = null;
const createNanoConfig = (repoName, id, secret) => {
  let totalText = "";
  if (id != null && secret != null) {
    totalText = `export const LOAD_PRIORITY = "dynamic"; \n export const CLIENT_ID = '${id}'; \nexport const CLIENT_SECRET = '${secret}'; \nexport const RELOAD_TIME = 10000; \n ${themeText}   \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;`;
  } else {
    totalText = `export const LOAD_PRIORITY = "static"; \n export const CLIENT_ID = "id"; \nexport const CLIENT_SECRET = "secret"; \nexport const RELOAD_TIME = 10000; \n ${themeText}  \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ; `;
  }
  fs.writeFileSync(path.join(repoName, "nano.config.js"), totalText);
};

const addNanoConfigToExistingProject = (repoName, id, secret, appUrl) => {
  let clientIdCommand = "";
  if (id != null && secret != null) {
    clientIdCommand = `export const LOAD_PRIORITY = "dynamic"; \n export const CLIENT_ID = "${id}"; \nexport const CLIENT_SECRET = "${secret}"; \nexport const APP_URL = "${appUrl}";\n ${themeText} \nexport const RELOAD_TIME = 10000;  \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;`;
  } else {
    clientIdCommand = `export const LOAD_PRIORITY = "static"; \n export const CLIENT_ID = "id"; \nexport const CLIENT_SECRET = "secret"; \nexport const APP_URL = 'appurl'; \n ${themeText} \nexport const RELOAD_TIME = 10000; \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;`;
  }
  fs.writeFileSync(path.join(repoName, "nano.config.js"), clientIdCommand);
};

const changeJavaFilesForVectorIcons = ({ repoName }) => {
  fs.appendFileSync(
    repoName + "/android/settings.gradle",
    `include ':react-native-vector-icons'
  project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')`
  );

  fs.readFile(`${repoName}/android/app/build.gradle`, function (err, data) {
    if (err) throw err;
    var array = data.toString().split("\n");

    for (let i = 0; i < array.length; i++) {
      if (array[i].includes("dependencies {")) {
        fs.appendFileSync(`${repoName}/build.gradle`, array[i] + "\n");
        fs.appendFileSync(
          `${repoName}/build.gradle`,
          `     implementation project(":react-native-vector-icons") \n`
        );
      } else {
        fs.appendFileSync(`${repoName}/build.gradle`, array[i] + "\n");
      }
    }
    // fs.unlinkSync(`${repoName}/android/app/build.gradle`);
    moveFileByNode(
      `${repoName}/build.gradle`,
      `${repoName}/android/app/build.gradle`,
      () => {
        downloadFileWithCallback(
          commonUrl + "assets.zip",
          repoName + "/android/app/src/main/assets.zip",
          () => {
            extract(repoName + "/android/app/src/main/assets.zip", {
              dir: path.resolve(path.join(repoName, "android/app/src/main")),
            });
            fs.unlinkSync(`${repoName}/android/app/src/main/assets.zip`);
            process.exit(0);

            return null;
          }
        );
      }
    );
  });
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

  const reanimatedCommand =
    reanimatedVersion != null
      ? `react-native-reanimated@` + reanimatedVersion
      : `react-native-reanimated` +
        getPackageVersion({
          packagename: "react-native-reanimated",
          rnNanoVersion: nanoversion,
        });

  const realmCommand =
    realmVersion != null
      ? "realm@" + realmVersion
      : "realm" +
        getPackageVersion({
          packagename: "realm",
          rnNanoVersion: nanoversion,
        });

  const installPackagesCOmmand = `npm install --save react-native-nano${nanoVer} react-native-rsa-native  ${reanimatedCommand} react-native-safe-area-context react-native-screens ${realmCommand} @notifee/react-native react-native-pager-view react-native-device-info react-native-image-crop-picker react-native-permissions@3.6.1 ${syncCommand} `;

  execSync(`${installPackagesCOmmand}`, { cwd: `${repoName}` });
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
  const RNversionString =
    reactNativeVers != null
      ? `--version ${reactNativeVers}`
      : `--version ` +
        getPackageVersion({
          packagename: "react-native",
          rnNanoVersion: nanoversion,
        });

  const reactnativeinstall = `npx react-native init ${repoName} ${RNversionString}`;

  execSync(`${reactnativeinstall}`);

  if (fs.existsSync(path.join(repoName, "/App.tsx"))) {
    fs.unlinkSync(path.join(repoName, "/App.tsx"));
  }
  if (fs.existsSync(path.join(repoName, "/App.js"))) {
    fs.unlinkSync(path.join(repoName, "/App.js"));
  }

  downloadFileWithCallback(commonUrl + "App3.js", repoName + "/App.js", () => {
    npmInstallRequiredPackagesInRNProject({
      repoName,
      appId,
      appSecret,
      nanoversion,
      isSyncFunctionalityRequired: true,
    });
    // process.exit(0);

    return null;
  });
};

const setUpANewMinimalProject = async ({
  repoName,
  appId = null,
  appSecret = null,
  nanoversion,
  reactNativeVers,
}) => {
  const RNversionString =
    reactNativeVers != null ? `--version ${reactNativeVers}` : "";

  const reactnativeinstall = `npx react-native init ${repoName} ${RNversionString}`;

  execSync(`${reactnativeinstall}`);
  if (fs.existsSync(path.join(repoName, "/App.tsx"))) {
    fs.unlinkSync(path.join(repoName, "/App.tsx"));
  }
  if (fs.existsSync(path.join(repoName, "/App.js"))) {
    fs.unlinkSync(path.join(repoName, "/App.js"));
  }
  if (fs.existsSync(path.join(repoName, "/babel.config.js"))) {
    fs.unlinkSync(path.join(repoName, "/babel.config.js"));
  }
  const babelDownloadUrl =
    reactNativeVers != null
      ? reactNativeVers > "0.72.0"
        ? commonUrl + "babel.config2.js"
        : commonUrl + "babel.config.js"
      : commonUrl + "babel.config2.js";
  downloadFileWithCallback(
    babelDownloadUrl,
    repoName + "/babel.config.js",
    () => {

      downloadFileWithCallback(
        commonUrl + "App2.js",
        repoName + "/App.js",
        () => {
          npmInstallRequiredPackagesInRNProject({
            repoName,
            appId,
            appSecret,
            nanoversion,
          });
          // process.exit(0);

          return null;
        }
      );
      return null;
    }
  );
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
        setUpANewProjectWithDefaultLoadingScreen({
          repoName: projectName,
          nanoversion,
          reactNativeVers,
        });
        // fs.unlinkSync(path.join(repoName, "/babel.config.js"));
        if (fs.existsSync(path.join(repoName, "/babel.config.js"))) {
          fs.unlinkSync(path.join(repoName, "/babel.config.js"));
        }
        const babelDownloadUrl =
          reactNativeVers != null
            ? reactNativeVers > "0.72.0"
              ? commonUrl + "babel.config2.js"
              : commonUrl + "babel.config.js"
            : commonUrl + "babel.config2.js";
        downloadFileWithCallback(
          babelDownloadUrl,
          repoName + "/babel.config.js",
          () => {
            addNanoConfigToExistingProject(
              projectName,
              answers["app_id"],
              answers["app_secret"],
              answers["app_url"]
            );
            return null;
          }
        );
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

function start() {
  switch (command) {
    case "init":
      const argv2 = yargs(hideBin(process.argv)).argv;

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
          if (argv2 != null) {
            reactNativeVersion = argv2[COMMAND_ARGUMENTS.REACT_NATIVE_VERSION];
            realmVersion = argv2[COMMAND_ARGUMENTS.REALM];
            reanimatedVersion =
              argv2[COMMAND_ARGUMENTS.REACT_NATIVE_REANIMATED];
            rnNanoVersion = argv2[COMMAND_ARGUMENTS.NANO_VERSION];
          }
          // const versionValuesArray = getNanoVersionAndReactNativeVersion({
          //   firstArgCommand,
          //   firstArgValue,
          //   secondArgCommand,
          //   secondArgValue,
          // });

          if (answers != null && answers["template_type"] != null) {
            switch (answers["template_type"]) {
              case "a":
                //  returns [nanoVersion, react native version]
                setUpANewMinimalProject({
                  repoName,
                  nanoversion: rnNanoVersion,
                  reactNativeVers: reactNativeVersion,
                });
                break;

              case "b":
                createProjectWithSyncEnabled({
                  projectName: repoName,
                  nanoversion: rnNanoVersion,
                  reactNativeVers: reactNativeVersion,
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
      // const platform = args.slice(1);
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
}

start();
