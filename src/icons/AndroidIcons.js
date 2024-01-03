import { downloadFileAtPathGiven, runCommand } from "../common.js";
import { commonUrl } from "../Constants.js";

export const setupAndroidIcons = () => {
  const deleteAppts = `cd android/ && echo "include ':react-native-vector-icons'
    project(':react-native-vector-icons').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-vector-icons/android')" >> settings.gradle`;
  const delCommand = runCommand(deleteAppts);
  if (!delCommand) process.exit(-1);
  const deleteAppt = `cd android/app && awk '/dependencies/ {print; print \"    implementation project(\\\":react-native-vector-icons\\\")\"; next}1' build.gradle > temp && mv temp build.gradle`;

  const delComman = runCommand(deleteAppt);
  if (!delComman) process.exit(-1);

  downloadFileAtPathGiven({
    path: "android/app/src/main",
    url: commonUrl + "assets.zip",
  });
  const downloadFontsZipCommand = `cd android/app/src/main  && unzip assets.zip > /dev/null  &&  rm -rf assets.zip`;
  const downloadresult = runCommand(downloadFontsZipCommand);
  if (!downloadresult) process.exit(-1);
};
