import { execSync } from "child_process";
import { commonUrl } from "../../constants.js";
import fs from "fs";
import path from "path";
import { downloadFileWithCallback } from "../../utilities.js";
import { addNanoConfigToExistingProject, changeJavaFilesForVectorIcons, createNanoConfig, } from "./setup.js";
import { VERSIONS, getPackageVersion } from "./versions.js";
import inquirer from "inquirer";
const createReactNativeProject = ({ repoName, nanoversion, reactNativeVers, }) => {
    const RNversionString = reactNativeVers != null
        ? `--version ${reactNativeVers}`
        : `--version ` +
            getPackageVersion({
                packagename: "react-native",
                rnNanoVersion: nanoversion,
            }).slice(1);
    const reactnativeinstall = `npx react-native init ${repoName} ${RNversionString}`;
    execSync(`${reactnativeinstall}`);
};
const deleteDefaultAppTsAndBabelFiles = ({ repoName, }) => {
    if (fs.existsSync(path.join(repoName, "/App.tsx"))) {
        fs.unlinkSync(path.join(repoName, "/App.tsx"));
    }
    if (fs.existsSync(path.join(repoName, "/App.js"))) {
        fs.unlinkSync(path.join(repoName, "/App.js"));
    }
    if (fs.existsSync(path.join(repoName, "/babel.config.js"))) {
        fs.unlinkSync(path.join(repoName, "/babel.config.js"));
    }
};
const downloadNanoAppJsAndBabelFiles = ({ onFinish, repoName, reactNativeVers, }) => {
    const babelDownloadUrl = reactNativeVers != null
        ? reactNativeVers > "0.72.0"
            ? commonUrl + "babel.config2.js"
            : commonUrl + "babel.config.js"
        : commonUrl + "babel.config2.js";
    downloadFileWithCallback(babelDownloadUrl, repoName + "/babel.config.js", () => {
        downloadFileWithCallback(commonUrl + "App2.js", repoName + "/App.js", () => {
            onFinish();
            return null;
        });
        return null;
    });
};
const generateInstallationCommandWithVersions = ({ nanoVersion, isSyncFunctionalityRequired, userArgs, }) => {
    let finalCommand = "npm install --save";
    if (nanoVersion != null && nanoVersion != "") {
        Object.keys(VERSIONS[nanoVersion]).forEach((packagename) => {
            if (packagename !== "react-native") {
                finalCommand += ` ${packagename}@${VERSIONS[nanoVersion][packagename]}  `;
            }
            if (isSyncFunctionalityRequired && packagename == "rn-nano-sync") {
                finalCommand += ` ${packagename}@${VERSIONS[nanoVersion][packagename]}  `;
            }
        });
    }
    else {
        const versionsArray = Object.keys(VERSIONS);
        let latestVersion = versionsArray[0];
        versionsArray.forEach((version) => {
            if (!latestVersion || version > latestVersion) {
                latestVersion = version;
            }
        });
        Object.keys(VERSIONS[latestVersion]).forEach((packagename) => {
            if (packagename !== "react-native") {
                finalCommand += ` ${packagename}@${VERSIONS[latestVersion][packagename]}  `;
            }
            if (isSyncFunctionalityRequired && packagename == "rn-nano-sync") {
                finalCommand += ` ${packagename}@${VERSIONS[latestVersion][packagename]}  `;
            }
        });
    }
    return finalCommand;
};
const npmInstallRequiredPackagesInRNProject = ({ repoName, appId, appSecret, isSyncFunctionalityRequired = false, nanoversion = null, userArgs, }) => {
    /* const installPackagesCOmmand = `npm install --save react-native-nano${nanoVer} react-native-rsa-native  ${reanimatedCommand} react-native-safe-area-context react-native-screens ${realmCommand} @notifee/react-native react-native-pager-view react-native-device-info react-native-image-crop-picker react-native-permissions@3.6.1 ${syncCommand} `;*/
    const installPackagesCOmmand = generateInstallationCommandWithVersions({
        nanoVersion: nanoversion,
        isSyncFunctionalityRequired,
        userArgs,
    });
    execSync(`${installPackagesCOmmand}`, { cwd: `${repoName}` });
    if (!isSyncFunctionalityRequired) {
        createNanoConfig(repoName, appId, appSecret);
    }
    changeJavaFilesForVectorIcons({ repoName });
    console.log("Welcome to Nano");
};
export const setUpANewMinimalProject = ({ repoName, appId = null, appSecret = null, nanoversion, reactNativeVers, userArgs, }) => {
    createReactNativeProject({
        repoName,
        nanoversion,
        reactNativeVers,
    });
    deleteDefaultAppTsAndBabelFiles({ repoName });
    downloadNanoAppJsAndBabelFiles({
        onFinish: () => {
            npmInstallRequiredPackagesInRNProject({
                repoName,
                appId,
                appSecret,
                nanoversion,
                userArgs,
            });
        },
        repoName,
        reactNativeVers: reactNativeVers,
    });
};
export const createProjectWithSyncEnabled = ({ projectName, nanoversion, reactNativeVers, userArgs, }) => {
    inquirer
        .prompt([
        /* Pass your questions in here */
        {
            type: "input",
            name: "app_id",
            message: "Enter your app id",
        },
        {
            type: "input",
            name: "app_secret",
            message: "Enter your app secret",
        },
        {
            type: "input",
            name: "app_url",
            message: "Enter your app url",
        },
    ])
        .then((answers) => {
        if (answers != null &&
            answers["app_id"] != null &&
            answers["app_secret"] != null &&
            answers["app_url"] != null) {
            createReactNativeProject({
                repoName: projectName,
                nanoversion,
                reactNativeVers,
            });
            deleteDefaultAppTsAndBabelFiles({ repoName: projectName });
            downloadFileWithCallback(commonUrl + "App3.js", projectName + "/App.js", () => {
                npmInstallRequiredPackagesInRNProject({
                    repoName: projectName,
                    appId: answers["app_id"],
                    appSecret: answers["app_secret"],
                    nanoversion,
                    isSyncFunctionalityRequired: true,
                    userArgs,
                });
                return null;
            });
            const babelDownloadUrl = reactNativeVers != null
                ? reactNativeVers > "0.72.0"
                    ? commonUrl + "babel.config2.js"
                    : commonUrl + "babel.config.js"
                : commonUrl + "babel.config2.js";
            downloadFileWithCallback(babelDownloadUrl, projectName + "/babel.config.js", () => {
                addNanoConfigToExistingProject(projectName, answers["app_id"], answers["app_secret"], answers["app_url"]);
                return null;
            });
        }
    })
        .catch((error) => {
        if (error.isTtyError) {
        }
        else {
        }
    });
};
//# sourceMappingURL=installations.js.map