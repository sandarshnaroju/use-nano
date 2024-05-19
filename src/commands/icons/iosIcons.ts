import { execSync } from "child_process";
import { moveFile, moveFileByNode, runCommand } from "../../common.js";
import { commonUrl } from "../../constants.js";
import { downloadFileWithCallback } from "../../utilities.js";
import fs from "fs";
// ruby copy_fonts_to_ios.rb -f ios/Fonts -g Fonts -p ios/Test.xcodeproj

export const setupIosIcons = (): void => {
  downloadFileWithCallback(commonUrl + "assets.zip", "ios", () => {
    console.log("assets.zip downloaded");
    const downloadFontsZipCommand = ` unzip assets.zip > /dev/null  &&  rm -rf assets.zip`;
    // const downloadresult = runCommand(downloadFontsZipCommand);
    // if (!downloadresult) process.exit(-1);
    execSync(`${downloadFontsZipCommand}`, { cwd: `ios` });

    moveFile({ source: "assets/fonts", destination: ".", path: "ios" });
    moveFileByNode("assets/fonts", "ios", () => {
      fs.unlinkSync(`assets`);
      return null;
    });
    // const deleteAssectFOlder = `cd ios && rm -rf assets`;
    // const deleteAssectFOlderRES = runCommand(deleteAssectFOlder);
    // if (!deleteAssectFOlderRES) process.exit(-1);
    return null;
  });
};
