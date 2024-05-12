import { execSync } from "child_process";
import { moveFile, moveFileByNode } from "../common.js";
import { commonUrl } from "../Constants.js";
import { downloadFileWithCallback } from "../Utilities.js";
import fs from "fs";
// ruby copy_fonts_to_ios.rb -f ios/Fonts -g Fonts -p ios/Test.xcodeproj
export const setupIosIcons = () => {
    downloadFileWithCallback(commonUrl + "assets.zip", "ios", () => {
        console.log("assets.zip downloaded");
        const downloadFontsZipCommand = ` unzip assets.zip > /dev/null  &&  rm -rf assets.zip`;
        // const downloadresult = runCommand(downloadFontsZipCommand);
        // if (!downloadresult) process.exit(-1);
        execSync(`${downloadFontsZipCommand}`, { cwd: `ios` });
        moveFile({ source: "assets/fonts", destination: ".", path: "ios" });
        moveFileByNode("assets/fonts", "ios", () => {
            fs.unlinkSync(`assets`);
        });
        // const deleteAssectFOlder = `cd ios && rm -rf assets`;
        // const deleteAssectFOlderRES = runCommand(deleteAssectFOlder);
        // if (!deleteAssectFOlderRES) process.exit(-1);
        return null;
    });
};
//# sourceMappingURL=IosIcons.js.map