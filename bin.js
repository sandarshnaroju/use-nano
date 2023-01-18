#!/usr/bin/env node
const { execSync } = require("child_process");
const commonUrl =
  "https://raw.githubusercontent.com/sandarshnaroju/nano-starter-template/master/";

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: "inherit" });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

const args = process.argv.slice(2);

const command = args[0];
const repoName = args[1];
if (command !== "init") {
  console.log(
    "Please use command as follows \n npx rn-nano init myawesomeproject"
  );
  process.exit(-1);
}
const reactnativeinstall = `npx react-native init ${repoName} --version 0.70.6`;
const checkedOut = runCommand(reactnativeinstall);
if (!checkedOut) process.exit(-1);

console.log("Installing and setting up React native");

const deleteAppts = `cd ${repoName} && rm -rf App.tsx `;
const delCommand = runCommand(deleteAppts);
if (!delCommand) process.exit(-1);
const downloadWelcomescreenFiles = `curl -LJO ${commonUrl}src/screens/Welcome.js && curl -LJO ${commonUrl}src/screens/WelcomeLogic.js && curl -LJO ${commonUrl}src/screens/index.js`;

const downloadAppjsCommand = `cd ${repoName} && curl -LJO ${commonUrl}App.js && mkdir src && cd src && mkdir screens && cd screens && ${downloadWelcomescreenFiles}`;
const downloadresult = runCommand(downloadAppjsCommand);
if (!downloadresult) process.exit(-1);
console.log("successfully downloaded and setup started code");

const installScreensAndSafeArea = `cd ${repoName} && npm install --save react-native-nano react-native-safe-area-context react-native-screens`;
const installScreensAndSafeAreaResult = runCommand(installScreensAndSafeArea);

if (!installScreensAndSafeAreaResult) process.exit(-1);
console.log("successfully installed safearea and screens and nano");
process.exit(0);
