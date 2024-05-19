import extract from "extract-zip";
import { moveFileByNode, runCommand } from "../../common.js";
import { commonUrl } from "../../constants.js";
import { downloadFileWithCallback } from "../../utilities.js";
import path from "path";
import fs from "fs";

export const setupAndroidIcons = (): void => {
  fs.appendFileSync(
    "/android/settings.gradle",
    `include ':react-native-vector-icons'
    project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')`
  );

  fs.readFile(`android/app/build.gradle`, function (err, data) {
    if (err) throw err;
    var array = data.toString().split("\n");

    for (let i = 0; i < array.length; i++) {
      if (array[i].includes("dependencies {")) {
        fs.appendFileSync(`build.gradle`, array[i] + "\n");
        fs.appendFileSync(
          `build.gradle`,
          `     implementation project(":react-native-vector-icons") \n`
        );
      } else {
        fs.appendFileSync(`build.gradle`, array[i] + "\n");
      }
    }
    /*fs.unlinkSync(`${repoName}/android/app/build.gradle`); */
    moveFileByNode(`build.gradle`, `android/app/build.gradle`, () => {
      downloadFileWithCallback(
        commonUrl + "assets.zip",
        "android/app/src/main",
        () => {
          console.log("assets.zip downloaded");

          extract("android/app/src/main/assets.zip", {
            dir: path.resolve(path.join("android/app/src/main")),
          })
            .then(() => {
              fs.unlinkSync(`android/app/src/main/assets.zip`);
            })
            .catch(() => {});

          return null;
        }
      );
      return null;
    });
  });
};
