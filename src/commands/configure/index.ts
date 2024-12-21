import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";

// Function to replace a line in a file (synchronously)
function replaceLineInFileSync(filePath, targetLine, replacementLine) {
  try {
    // Read the file content synchronously
    const data = fs.readFileSync(filePath, "utf8");

    // Split the content into lines
    const lines = data.split("\n");

    // Replace the target line with the replacement line
    const updatedLines = lines.map((line) => {
      if (line.includes(targetLine)) {
        return replacementLine; // Replace the target line
      }
      return line; // Keep other lines unchanged
    });

    // Join the lines back into a single string
    const updatedData = updatedLines.join("\n");

    // Write the modified content back to the file synchronously
    fs.writeFileSync(filePath, updatedData, "utf8");
    return true;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

export const changeAppUrlAppIdAppSecretInExistingProject = (): void => {
  const argv = yargs(hideBin(process.argv)).argv;

  if (argv && argv["app-id"] && argv["app-secret"] && argv["app-url"]) {
    const isCliendIdReplace = replaceLineInFileSync(
      "nano.config.js",
      "export const CLIENT_ID",
      `export const CLIENT_ID = "${argv["app-id"]}"`
    );
    if (!isCliendIdReplace) {
      console.log("Error in replacing client id");
      return;
    }
    const isClientSecretReplace = replaceLineInFileSync(
      "nano.config.js",
      "export const CLIENT_SECRET",
      `export const CLIENT_SECRET = "${argv["app-secret"]}"`
    );
    if (!isClientSecretReplace) {
      console.log("Error in replacing client secret");
      return;
    }
    const isAppUrlReplace = replaceLineInFileSync(
      "nano.config.js",
      "export const APP_URL",
      `export const APP_URL = "${argv["app-url"]}"`
    );
    if (!isAppUrlReplace) {
      console.log("Error in replacing app url");
      return;
    }
    console.log("Your Project is successfully configured.");
  }
};
