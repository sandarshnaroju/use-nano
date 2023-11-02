import path from "path";
import { runCommand } from "./common.js";
import { commonUrl, themeText } from "./Constants.js";
import AdmZip from "adm-zip";
import fs from "fs";
import fetch from "node-fetch";

export const initialiseRNProjectInWindowsAndDeleteApptsxFile = ({
  repoName,
  reactNativeVers,
}) => {
  const RNversionString =
    reactNativeVers != null ? `--version ${reactNativeVers}` : "";
  const reactnativeinstall = `npx react-native init ${repoName} ${RNversionString}`;

  const checkedOut = runCommand(reactnativeinstall);

  if (!checkedOut) process.exit(-1);

  const deleteAppts = `CD ${repoName} && del "App.tsx" `;
  const delCommand = runCommand(deleteAppts);

  if (!delCommand) process.exit(-1);
};
export const createWindowsFolderStructureForMinimalProject = ({ repoName }) => {
  const downloadAppjsCommand = `CD ${repoName} && curl -s -S -LJO ${commonUrl}App2.js `;
  const downloadresult = runCommand(downloadAppjsCommand);
  if (!downloadresult) process.exit(-1);

  const renameCommand = `CD ${repoName} &&  ren App2.js App.js`;
  const renameResult = runCommand(renameCommand);

  if (!renameResult) process.exit(-1);
};

const createNanoConfigForWindows = (repoName, id, secret) => {
  let createNanoConfigCommand = ``;

  if (id != null && secret != null) {
    createNanoConfigCommand = `export const CLIENT_ID = '${id}'; \nexport const CLIENT_SECRET = '${secret}'; \nexport const RELOAD_TIME = 10000; \n ${themeText}   \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   `;
  } else {
    createNanoConfigCommand = `export const CLIENT_ID = "id"; \nexport const CLIENT_SECRET = "secret"; \nexport const RELOAD_TIME = 10000; \n ${themeText}  \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   `;
  }

  const nanoConfigPath = path.join(repoName, "nano.config.js");

  try {
    fs.writeFileSync(nanoConfigPath, createNanoConfigCommand, "utf-8");
  } catch (error) {
    console.error("Failed to modify nano.config.js:", error);
    process.exit(-1);
  }
};

const changeJavaFilesForVectorIcons = async ({ repoName }) => {
  const deleteAppts = `CD ${repoName} && CD android/ && echo include ':react-native-vector-icons' >> settings.gradle && echo project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android') >> settings.gradle`;
  const delCommand = runCommand(deleteAppts);

  if (!delCommand) process.exit(-1);

  const buildGradlePath = path.join(repoName, "android", "app", "build.gradle");

  const buildGradleContent = fs.readFileSync(buildGradlePath, "utf-8");

  const modifiedBuildGradleContent = buildGradleContent.replace(
    /dependencies\s*{/,
    `dependencies {
  implementation project(':react-native-vector-icons')`
  );

  try {
    fs.writeFileSync(buildGradlePath, modifiedBuildGradleContent, "utf-8");
  } catch (error) {
    console.error("Failed to modify build.gradle:", error);
    process.exit(-1);
  }

  // Download and unzip fonts
  const fontsUrl = `${commonUrl}assets.zip`;
  const fontsZipPath = path.join(
    repoName,
    "android",
    "app",
    "src",
    "main",
    "assets.zip"
  );
  const fontsExtractPath = path.join(repoName, "android", "app", "src", "main");

  try {
    const response = await fetch(fontsUrl);

    const buffer = await response.buffer();

    fs.writeFileSync(fontsZipPath, buffer);

    const zip = new AdmZip(fontsZipPath);

    zip.extractAllTo(fontsExtractPath, true);

    fs.unlinkSync(fontsZipPath);
  } catch (error) {
    console.error("Failed to download and extract fonts:", error);
    // process.exit(-1);
  }
};

export const installWindowsRequiredPackagesInRNProject = async ({
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

  const installScreensAndSafeArea = `CD ${repoName} && npm install --save react-native-nano${nanoVer} react-native-rsa-native react-native-permissions react-native-safe-area-context react-native-screens realm@11.5.2 @notifee/react-native react-native-pager-view react-native-device-info react-native-image-crop-picker run `;
  const installScreensAndSafeAreaResult = runCommand(installScreensAndSafeArea);
  if (!installScreensAndSafeAreaResult) process.exit(-1);
  createNanoConfigForWindows(repoName, appId, appSecret);
  await changeJavaFilesForVectorIcons({ repoName });
  // if (isSyncFunctionalityRequired) {
  //   changeJavaFilesForFirebase({ repoName });
  // }
  console.log("Welcome to Nano");
};

const createFolderStructureWithDefaultLoadingScreenInWindows = ({
  repoName,
}) => {
  const downloadAppjsCommand = `CD ${repoName} && curl -s -S -LJO ${commonUrl}App3.js  && ren App3.js App.js`;
  const downloadresult = runCommand(downloadAppjsCommand);
  if (!downloadresult) process.exit(-1);
};

export const setUpANewProjectWithDefaultLoadingScreenForWindows = ({
  repoName,
  appId = null,
  appSecret = null,
  nanoversion,
  reactNativeVers,
}) => {
  initialiseRNProjectInWindowsAndDeleteApptsxFile({
    repoName,
    reactNativeVers,
  });
  createFolderStructureWithDefaultLoadingScreenInWindows({ repoName });
  installWindowsRequiredPackagesInRNProject({
    repoName,
    appId,
    appSecret,
    nanoversion,
  });
};

export const addNanoConfigToExistingWindowsProject = (
  repoName,
  id,
  secret,
  appUrl
) => {
  let createNanoConfigCommand = ``;

  if (id != null && secret != null) {
    createNanoConfigCommand = `export const CLIENT_ID = '${id}'; \nexport const CLIENT_SECRET = '${secret}'; \n export const APP_URL = "${appUrl}";\n  export const RELOAD_TIME = 10000; \n ${themeText}   \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   `;
  } else {
    createNanoConfigCommand = `export const CLIENT_ID = "id"; \nexport const CLIENT_SECRET = "secret"; \n  export const APP_URL = "${appUrl}";\n  export const RELOAD_TIME = 10000; \n ${themeText}  \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   `;
  }

  const nanoConfigPath = path.join(repoName, "nano.config.js");

  try {
    fs.writeFileSync(nanoConfigPath, createNanoConfigCommand, "utf-8");
  } catch (error) {
    console.error("Failed to modify nano.config.js:", error);
    process.exit(-1);
  }
};
