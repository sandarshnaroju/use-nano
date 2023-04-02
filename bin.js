#!/usr/bin/env node
const { execSync } = require("child_process");

const inquirer = require("inquirer");

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

const createNanoConfig = (repoName, id, secret) => {
  let clientIdCommand = "";
  if (id != null && secret != null) {
    clientIdCommand = `cd ${repoName} &&  printf 'export const CLIENT_ID = '${id}'; \n export const CLIENT_SECRET = '${secret}';  \n export const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   ' > nano.config.js `;
  } else {
    clientIdCommand = `cd ${repoName} && printf 'export const CLIENT_ID = "id"; \n export const CLIENT_SECRET = "secret";  \n export const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;   ' > nano.config.js `;
  }

  const clientIdCommandRes = runCommand(clientIdCommand);

  if (!clientIdCommandRes) process.exit(-1);
};
const createFolderStructure = () => {
  const downloadWelcomeJs = `curl -s -S -LJO ${commonUrl}src/screens/welcome/Welcome.js > /dev/null`;
  const downloadIndexJs = `curl -s -S -LJO  ${commonUrl}src/screens/index.js > /dev/null`;
  const downloadWelcomeLogicFile = `curl -s -S -LJO ${commonUrl}src/screens/welcome/WelcomeLogic.js > /dev/null`;
  const downloadAppjsCommand = `cd ${repoName} && curl -s -S -LJO ${commonUrl}App.js > /dev/null  && mkdir src && cd src && mkdir screens && cd screens && ${downloadIndexJs} && mkdir welcome && cd welcome && ${downloadWelcomeJs} && ${downloadWelcomeLogicFile}`;
  const downloadresult = runCommand(downloadAppjsCommand);
  if (!downloadresult) process.exit(-1);
};
const createFolderStructureForMinimalProject = () => {
  const downloadAppjsCommand = `cd ${repoName} && curl -s -S -LJO ${commonUrl}App2.js > /dev/null  && mv App2.js App.js`;
  const downloadresult = runCommand(downloadAppjsCommand);
  if (!downloadresult) process.exit(-1);
};

const setUpANewProject = ({ repoName, appId = null, appSecret = null }) => {
  const reactnativeinstall = `npx react-native init ${repoName} --version 0.71.3`;
  const checkedOut = runCommand(reactnativeinstall);
  if (!checkedOut) process.exit(-1);

  // console.log("Installing and setting up React native");

  const deleteAppts = `cd ${repoName} && rm -rf App.tsx `;
  const delCommand = runCommand(deleteAppts);
  if (!delCommand) process.exit(-1);
  createFolderStructure();

  const installScreensAndSafeArea = `cd ${repoName} && npm install --save react-native-nano react-native-permissions react-native-safe-area-context react-native-screens realm@11.5.2 @notifee/react-native react-native-pager-view`;
  const installScreensAndSafeAreaResult = runCommand(installScreensAndSafeArea);

  if (!installScreensAndSafeAreaResult) process.exit(-1);
  createNanoConfig(repoName, appId, appSecret);
  console.log("Welcome to Nano");
  process.exit(0);
};
const setUpANewMinimalProject = ({
  repoName,
  appId = null,
  appSecret = null,
}) => {
  const reactnativeinstall = `npx react-native init ${repoName} --version 0.71.3`;
  const checkedOut = runCommand(reactnativeinstall);
  if (!checkedOut) process.exit(-1);

  // console.log("Installing and setting up React native");

  const deleteAppts = `cd ${repoName} && rm -rf App.tsx `;
  const delCommand = runCommand(deleteAppts);
  if (!delCommand) process.exit(-1);
  createFolderStructureForMinimalProject();

  const installScreensAndSafeArea = `cd ${repoName} && npm install --save react-native-nano react-native-permissions react-native-safe-area-context react-native-screens realm@11.5.2 @notifee/react-native react-native-pager-view`;
  const installScreensAndSafeAreaResult = runCommand(installScreensAndSafeArea);

  if (!installScreensAndSafeAreaResult) process.exit(-1);
  createNanoConfig(repoName, appId, appSecret);
  console.log("Welcome to Nano");
  process.exit(0);
};

const createProjectWithSyncEnabled = ({ projectName }) => {
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
    ])
    .then((answers) => {
      // Use user feedback for... whatever!!
      if (
        answers != null &&
        answers["app_id"] != null &&
        answers["app_secret"] != null
      ) {
        setUpANewProject({
          repoName: projectName,
          appId: answers["app_id"],
          appSecret: answers["app_secret"],
        });
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
            { name: "a) Simple Hello World (single screen) ", value: "a" },
            { name: "b) Multi screen starter template", value: "b" },
            { name: "c) Starter Template with Nano sync", value: "c" },
          ],
        },
      ])
      .then((answers) => {
        // Use user feedback for... whatever!!
        if (answers != null && answers["template_type"] != null) {
          switch (answers["template_type"]) {
            case "a":
              setUpANewMinimalProject({ repoName });
              break;
            case "b":
              setUpANewProject({ repoName: repoName });
              break;
            case "c":
              createProjectWithSyncEnabled({
                projectName: repoName,
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
  default:
    console.log(
      "To create a new Nano project use \n npx rn-nano init myawesomeproject "
    );
    break;
}
