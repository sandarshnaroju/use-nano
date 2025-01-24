import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

interface Args {
  name: string;
  screens?: string;
  assets?: string;
  "app-icon"?: string;
  packages?: string;
  nanoversion?: string;
  reactNativeVers?: string;
}
const updateFile = (
  filePath: string,
  regex: RegExp,
  replacement: string
): void => {
  if (!existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  try {
    const content = readFileSync(filePath, "utf8");
    const updatedContent = content.replace(regex, replacement);
    writeFileSync(filePath, updatedContent, "utf8");
    console.log(`✅ Updated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error);
  }
};

export const updateVersion = () => {
  const args: Args = yargs(hideBin(process.argv)).argv;
  if (
    args["version-code"] != null &&
    args["version-name"] != null &&
    args["name"] != null
  ) {
    const versionCode = args["version-code"];
    const versionName = args["version-name"];

    const androidPathArray = [args["name"], "android", "app", "build.gradle"];

    // **Android: Update `android/app/build.gradle`**
    const androidGradlePath = path.join(...androidPathArray);
    console.log("androidGradlePath", androidGradlePath);
    updateFile(
      androidGradlePath,
      /versionCode \d+/g,
      `versionCode ${versionCode}`
    );
    updateFile(
      androidGradlePath,
      /versionName "[^"]+"/g,
      `versionName "${versionName}"`
    );

    // **iOS: Update `ios/App/Info.plist`**
    const iosPathArray = [args["name"], "ios", args["name"], "Info.plist"];

    const iosPlistPath = path.join(...iosPathArray); // Change 'App' if needed
    updateFile(
      iosPlistPath,
      /<key>CFBundleShortVersionString<\/key>\s*<string>[^<]+<\/string>/,
      `<key>CFBundleShortVersionString</key>\n\t<string>${versionName}</string>`
    );
    updateFile(
      iosPlistPath,
      /<key>CFBundleVersion<\/key>\s*<string>[^<]+<\/string>/,
      `<key>CFBundleVersion</key>\n\t<string>${versionCode}</string>`
    );
  }
};
