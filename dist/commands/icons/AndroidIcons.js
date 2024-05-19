import extract from "extract-zip";
import { moveFileByNode } from "../../common.js";
import { commonUrl } from "../../constants.js";
import { downloadFileWithCallback } from "../../utilities.js";
import path from "path";
import fs from "fs";
export const setupAndroidIcons = () => {
    // const deleteAppts = `cd android/ && echo "include ':react-native-vector-icons'
    //   project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')" >> settings.gradle`;
    fs.appendFileSync("/android/settings.gradle", `include ':react-native-vector-icons'
    project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')`);
    // const delCommand = runCommand(deleteAppts);
    // if (!delCommand) process.exit(-1);
    // const deleteAppt = `cd android/app && awk '/dependencies/ {print; print \"    implementation project(\\\":react-native-vector-icons\\\")\"; next}1' build.gradle > temp && mv temp build.gradle`;
    // const delComman = runCommand(deleteAppt);
    // if (!delComman) process.exit(-1);
    fs.readFile(`android/app/build.gradle`, function (err, data) {
        if (err)
            throw err;
        var array = data.toString().split("\n");
        for (let i = 0; i < array.length; i++) {
            if (array[i].includes("dependencies {")) {
                console.log("found", array[i], array[i + 1]);
                fs.appendFileSync(`build.gradle`, array[i] + "\n");
                fs.appendFileSync(`build.gradle`, `     implementation project(":react-native-vector-icons") \n`);
            }
            else {
                fs.appendFileSync(`build.gradle`, array[i] + "\n");
            }
        }
        // fs.unlinkSync(`${repoName}/android/app/build.gradle`);
        moveFileByNode(`build.gradle`, `android/app/build.gradle`, () => {
            console.log("MOVEDD succeddudu");
            downloadFileWithCallback(commonUrl + "assets.zip", "android/app/src/main", () => {
                console.log("assets.zip downloaded");
                extract("android/app/src/main/assets.zip", {
                    dir: path.resolve(path.join("android/app/src/main")),
                });
                fs.unlinkSync(`android/app/src/main/assets.zip`);
                return null;
            });
            return null;
        });
    });
};
//# sourceMappingURL=AndroidIcons.js.map