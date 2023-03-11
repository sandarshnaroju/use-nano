#!/usr/bin/env node
const { execSync } = require("child_process");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
const askUser = (ques) => {
  return new Promise((resolve, reject) => {
    return rl.question(ques, (inp) => {
      return resolve(inp);
    });
  });
};

const setUpANewProject = ({ repoName }) => {
  const reactnativeinstall = `npx react-native init ${repoName} --version 0.70.6`;
  const checkedOut = runCommand(reactnativeinstall);
  if (!checkedOut) process.exit(-1);

  console.log("Installing and setting up React native");

  const deleteAppts = `cd ${repoName} && rm -rf App.tsx `;
  const delCommand = runCommand(deleteAppts);
  if (!delCommand) process.exit(-1);

  const downloadWelcomescreenFiles = `curl -LJO ${commonUrl}src/screens/Welcome.js && curl -LJO  ${commonUrl}src/screens/index.js`;
  const downloadLogicFile = `curl -LJO ${commonUrl}src/logic/Logic.js`;
  const downloadAppjsCommand = `cd ${repoName} && curl -LJO ${commonUrl}App.js  && mkdir src && cd src && mkdir screens && cd screens && ${downloadWelcomescreenFiles} && cd .. && mkdir logic && cd logic && ${downloadLogicFile}`;
  const downloadresult = runCommand(downloadAppjsCommand);
  if (!downloadresult) process.exit(-1);
  console.log("successfully downloaded and setup started code");

  const installScreensAndSafeArea = `cd ${repoName} && npm install --save react-native-nano react-native-safe-area-context react-native-screens realm@11.3.1 @notifee/react-native react-native-pager-view`;
  const installScreensAndSafeAreaResult = runCommand(installScreensAndSafeArea);

  if (!installScreensAndSafeAreaResult) process.exit(-1);
  console.log("Welcome to Nano");
  process.exit(0);
};

const addConfigToExistingProject = async () => {
  let clientId = null;
  let clientSecret = null;

  clientId = await askUser("Enter the project clientId: ");
  clientSecret = await askUser("Enter the project clientSecret: ");
  rl.close();
  const createFileCommand = `touch nano.config.js`;
  const createFileCommandRes = runCommand(createFileCommand);
  if (!createFileCommandRes) process.exit(-1);

  const clientIdCommand = `printf 'export const CLIENT_ID = '${clientId}'; \n export const CLIENT_SECRET = '${clientSecret}';' > nano.config.js `;

  const clientIdCommandRes = runCommand(clientIdCommand);

  if (!clientIdCommandRes) process.exit(-1);
};
const args = process.argv.slice(2);

const command = args[0];
const repoName = args[1];

switch (command) {
  case "init":
    setUpANewProject({ repoName });
    break;
  case "config":
    addConfigToExistingProject();
    break;

  default:
    console.log(
      "To create a new Nano project use \n npx rn-nano init myawesomeproject \nor to configure an existing project use \n npx rn-nano config "
    );
    break;
}
