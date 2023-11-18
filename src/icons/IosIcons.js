import { downloadFileAtPathGiven, moveFile, runCommand } from "../common.js";
import { commonUrl } from "../Constants.js";

// ruby copy_fonts_to_ios.rb -f ios/Fonts -g Fonts -p ios/Test.xcodeproj

export const setupIosIcons = () => {
  downloadFileAtPathGiven({
    path: "ios",
    url: commonUrl + "assets.zip",
  });
  const downloadFontsZipCommand = `cd ios && unzip assets.zip > /dev/null  &&  rm -rf assets.zip`;
  const downloadresult = runCommand(downloadFontsZipCommand);
  if (!downloadresult) process.exit(-1);
  moveFile({ source: "assets/fonts", destination: ".", path: "ios" });
  const deleteAssectFOlder = `cd ios && rm -rf assets`;
  const deleteAssectFOlderRES = runCommand(deleteAssectFOlder);
  if (!deleteAssectFOlderRES) process.exit(-1);
};
