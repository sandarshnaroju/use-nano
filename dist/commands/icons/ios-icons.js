import { execSync } from "child_process";
import { moveFile, moveFileByNode } from "../../common.js";
import { commonUrl } from "../../constants.js";
import { downloadFileWithCallback } from "../../utilities.js";
import fs from "fs";
/* ruby copy_fonts_to_ios.rb -f ios/Fonts -g Fonts -p ios/Test.xcodeproj */
export const setupIosIcons = () => {
    downloadFileWithCallback(commonUrl + "assets.zip", "ios", () => {
        const downloadFontsZipCommand = ` unzip assets.zip > /dev/null  &&  rm -rf assets.zip`;
        execSync(`${downloadFontsZipCommand}`, { cwd: `ios` });
        moveFile({ source: "assets/fonts", destination: ".", path: "ios" });
        moveFileByNode("assets/fonts", "ios", () => {
            fs.unlinkSync(`assets`);
            return null;
        });
        return null;
    });
};
//# sourceMappingURL=ios-icons.js.map