#!/usr/bin/env node

import inquirer from "inquirer";
import {
  getNanoVersionAndReactNativeVersion,
  runCommand,
} from "./src/common.js";
import { themeText, commonUrl } from "./src/Constants.js";
import {
  initialiseRNProjectInWindowsAndDeleteApptsxFile,
  createWindowsFolderStructureForMinimalProject,
  installWindowsRequiredPackagesInRNProject,
  setUpANewProjectWithDefaultLoadingScreenForWindows,
  addNanoConfigToExistingWindowsProject,
} from "./src/windows.js";

const createNanoConfig = (repoName, id, secret) => {
  let clientIdCommand = "";
  if (id != null && secret != null) {
    clientIdCommand = `cd ${repoName} &&  printf 'export const CLIENT_ID = '${id}'; \nexport const CLIENT_SECRET = '${secret}'; \nexport const RELOAD_TIME = 10000; \n ${themeText}   \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   ' > nano.config.js `;
  } else {
    clientIdCommand = `cd ${repoName} && printf 'export const CLIENT_ID = "id"; \nexport const CLIENT_SECRET = "secret"; \nexport const RELOAD_TIME = 10000; \n ${themeText}  \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   ' > nano.config.js `;
  }

  const clientIdCommandRes = runCommand(clientIdCommand);

  if (!clientIdCommandRes) process.exit(-1);
};

const addNanoConfigToExistingProject = (repoName, id, secret, appUrl) => {
  let clientIdCommand = "";
  if (id != null && secret != null) {
    clientIdCommand = `cd ${repoName} &&  printf 'export const CLIENT_ID = "${id}"; \nexport const CLIENT_SECRET = "${secret}"; \nexport const APP_URL = "${appUrl}";\n ${themeText} \nexport const RELOAD_TIME = 10000;  \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   ' > nano.config.js `;
  } else {
    clientIdCommand = ` cd ${repoName} && printf 'export const CLIENT_ID = "id"; \nexport const CLIENT_SECRET = "secret"; \nexport const APP_URL = 'appurl'; \n ${themeText} \nexport const RELOAD_TIME = 10000; \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   ' > nano.config.js `;
  }

  const clientIdCommandRes = runCommand(clientIdCommand);

  if (!clientIdCommandRes) process.exit(-1);
};

const createFolderStructureForMinimalProject = () => {
  const downloadAppjsCommand = `cd ${repoName} && curl -s -S -LJO ${commonUrl}App2.js > /dev/null  && mv App2.js App.js`;
  const downloadresult = runCommand(downloadAppjsCommand);
  if (!downloadresult) process.exit(-1);
};
const createFolderStructureWithDefaultLoadingScreen = () => {
  const downloadAppjsCommand = `cd ${repoName} && curl -s -S -LJO ${commonUrl}App3.js > /dev/null  && mv App3.js App.js`;
  const downloadresult = runCommand(downloadAppjsCommand);
  if (!downloadresult) process.exit(-1);
};

// const changeJavaFilesForFirebase = ({ repoName }) => {
//   //ANdroid
//   const deleteAppts = `cd ${repoName}/android/app/ && echo 'apply plugin: "com.google.gms.google-services"' >> build.gradle`;
//   const delCommand = runCommand(deleteAppts);
//   if (!delCommand) process.exit(-1);

//   const buildg = `cd ${repoName}/android/ && awk '/ dependencies/{print; print "classpath \\"com.google.gms:google-services:4.3.15\\""} !/ dependencies/' build.gradle > temp && mv temp build.gradle `;
//   const buildgCom = runCommand(buildg);
//   if (!buildgCom) process.exit(-1);

//   if (process.platform === "darwin") {
//     /// IOS
//     const importfirebase = `cd ${repoName}/ios/${repoName}/ && awk '/#import "AppDelegate.h"/{print; print "#import <Firebase.h>"} !/#import "AppDelegate.h"/' AppDelegate.mm > temp && mv temp AppDelegate.mm`;
//     const delComman = runCommand(importfirebase);
//     if (!delComman) process.exit(-1);
//     const initfirebase = `cd ${repoName}/ios/${repoName}/ && awk '/self.moduleName = @"${repoName}";/{print; print "[FIRApp configure];"} !/self.moduleName = @"${repoName}";/' AppDelegate.mm > temp && mv temp AppDelegate.mm `;
//     const initfirebaseComm = runCommand(initfirebase);
//     if (!initfirebaseComm) process.exit(-1);
//     const podfile = `cd ${repoName}/ios/ && awk '/ config = use_native_modules!/{print; print " use_frameworks! :linkage => :static"} !/config = use_native_modules!/' Podfile > temp && mv temp Podfile `;
//     const podfileCom = runCommand(podfile);
//     if (!podfileCom) process.exit(-1);

//     const enablestaticfrmework = `cd ${repoName}/ios/ && awk '/ use_frameworks! :linkage => :static/{print; print "$RNFirebaseAsStaticFramework = true"} !/ use_frameworks! :linkage => :static/' Podfile > temp && mv temp Podfile `;
//     const enablestaticfrmeworkComm = runCommand(enablestaticfrmework);
//     if (!enablestaticfrmeworkComm) process.exit(-1);

//     const podInstall = `cd ${repoName}/ios/ && pod install --repo-update`;
//     const podInstallComm = runCommand(podInstall);
//     if (!podInstallComm) process.exit(-1);
//   }

// };
const changeJavaFilesForVectorIcons = ({ repoName }) => {
  const deleteAppts = `cd ${repoName}/android/ && echo "include ':react-native-vector-icons'
    project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')" >> settings.gradle`;
  const delCommand = runCommand(deleteAppts);
  if (!delCommand) process.exit(-1);
  const deleteAppt = `cd ${repoName}/android/app && awk '/dependencies/ {print; print \"    implementation project(\\\":react-native-vector-icons\\\")\"; next}1' build.gradle > temp && mv temp build.gradle`;

  const delComman = runCommand(deleteAppt);
  if (!delComman) process.exit(-1);
  const downloadFontsZipCommand = `cd ${repoName}/android/app/src/main && curl -s -S -LJO ${commonUrl}assets.zip > /dev/null  && unzip assets.zip > /dev/null  &&  rm -rf assets.zip`;
  const downloadresult = runCommand(downloadFontsZipCommand);
  if (!downloadresult) process.exit(-1);
  // }
};
const initialiseReactNativeProjectAndDeleteApptsxFile = ({
  repoName,
  reactNativeVers,
}) => {
  const RNversionString =
    reactNativeVers != null
      ? `--version ${reactNativeVers}`
      : "--version 0.71.3";

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
  // const firebaseCommands = isSyncFunctionalityRequired
  //   ? "@react-native-firebase/app @react-native-firebase/messaging "
  //   : "";
  const nanoVer =
    nanoversion != null && nanoversion != "" ? `@${nanoversion}` : "";
  const installScreensAndSafeArea = `cd ${repoName} && npm install --save react-native-nano${nanoVer} react-native-rsa-native react-native-permissions react-native-safe-area-context react-native-screens realm@11.5.2 @notifee/react-native react-native-pager-view react-native-device-info react-native-image-crop-picker `;
  const installScreensAndSafeAreaResult = runCommand(installScreensAndSafeArea);

  if (!installScreensAndSafeAreaResult) process.exit(-1);
  createNanoConfig(repoName, appId, appSecret);
  changeJavaFilesForVectorIcons({ repoName });
  // if (isSyncFunctionalityRequired) {
  //   changeJavaFilesForFirebase({ repoName });
  // }
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
            // { name: "b) Basic project with starter template", value: "b" },
            {
              name: "b) Connect to existing project at nanoapp.dev",
              value: "c",
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
            // case "b":
            //   setUpANewProject({ repoName: repoName });
            //   break;
            case "c":
              createProjectWithSyncEnabled({
                projectName: repoName,
                nanoversion: versionValuesArray[0],
                reactNativeVers: versionValuesArray[1],
              });
              // changeJavaFilesForVectorIcons({ repoName });
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
  default:
    console.log(
      "To create a new Nano project use \n npx rn-nano init myawesomeproject "
    );
    break;
}
