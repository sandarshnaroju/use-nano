import fs from "fs";
import { moveFileByNode } from "../../common.js";
import { downloadFileWithCallback } from "../../utilities.js";
import extract from "extract-zip";
import path from "path";
import { commonUrl, themeText } from "../../constants.js";
export const changeJavaFilesForVectorIcons = ({ repoName, }) => {
    fs.appendFileSync(repoName + "/android/settings.gradle", `include ':react-native-vector-icons'
    project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')`);
    fs.readFile(`${repoName}/android/app/build.gradle`, function (err, data) {
        if (err)
            throw err;
        var array = data.toString().split("\n");
        for (let i = 0; i < array.length; i++) {
            if (array[i].includes("dependencies {")) {
                fs.appendFileSync(`${repoName}/build.gradle`, array[i] + "\n");
                fs.appendFileSync(`${repoName}/build.gradle`, `     implementation project(":react-native-vector-icons") \n`);
            }
            else {
                fs.appendFileSync(`${repoName}/build.gradle`, array[i] + "\n");
            }
        }
        moveFileByNode(`${repoName}/build.gradle`, `${repoName}/android/app/build.gradle`, () => {
            console.log("Downloading assets.zip");
            downloadFileWithCallback(commonUrl + "assets.zip", repoName + "/android/app/src/main/assets.zip", (res) => {
                console.log("Download assets.zip response", res);
                extract(repoName + "/android/app/src/main/assets.zip", {
                    dir: path.resolve(path.join(repoName, "android/app/src/main")),
                })
                    .then(() => {
                    fs.unlinkSync(`${repoName}/android/app/src/main/assets.zip`);
                })
                    .catch(() => { });
                console.log("Extracted assets.zip");
                return null;
            });
            return null;
        });
    });
};
export const createNanoConfig = (repoName, id, secret) => {
    let totalText = "";
    if (id != null && secret != null) {
        totalText = `export const LOAD_PRIORITY = "dynamic"; \n export const CLIENT_ID = '${id}'; \nexport const CLIENT_SECRET = '${secret}'; \nexport const RELOAD_TIME = 10000; \n ${themeText}   \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;`;
    }
    else {
        totalText = `export const LOAD_PRIORITY = "static"; \n export const CLIENT_ID = "id"; \nexport const CLIENT_SECRET = "secret"; \nexport const RELOAD_TIME = 10000; \n ${themeText}  \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ; `;
    }
    fs.writeFileSync(path.join(repoName, "nano.config.js"), totalText);
};
export const addNanoConfigToExistingProject = (repoName, id, secret, appUrl) => {
    let clientIdCommand = "";
    if (id != null && secret != null) {
        clientIdCommand = `export const LOAD_PRIORITY = "dynamic"; \n export const CLIENT_ID = "${id}"; \nexport const CLIENT_SECRET = "${secret}"; \nexport const APP_URL = "${appUrl}";\n ${themeText} \nexport const RELOAD_TIME = 10000;  \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;`;
    }
    else {
        clientIdCommand = `export const LOAD_PRIORITY = "static"; \n export const CLIENT_ID = "id"; \nexport const CLIENT_SECRET = "secret"; \nexport const APP_URL = 'appurl'; \n ${themeText} \nexport const RELOAD_TIME = 10000; \nexport const DataBaseConfig = { \n // schema:"your schema object" , \n // schemaVersion: "", \n} ;`;
    }
    fs.writeFileSync(path.join(repoName, "nano.config.js"), clientIdCommand);
};
//# sourceMappingURL=setup.js.map