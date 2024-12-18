import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { runCommand } from "../../common.js";

const indexOfAfter = (
  searchString: string,
  afterString: string,
  str: string
): number => {
  // Find the index of the 'afterString'
  const afterIndex = str.indexOf(afterString);

  if (afterIndex === -1) {
    // 'afterString' not found in 'str'
    return -1;
  }

  // Move past the 'afterString'
  const startIndex = afterIndex + afterString.length;

  // Find the index of 'searchString' starting from 'startIndex'
  return str.indexOf(searchString, startIndex);
};

const removingEditorComponentString = ({
  fileContent,
}: {
  fileContent: string;
}): string => {
  const startIndex = fileContent.indexOf("<Editor");
  const endIndex = indexOfAfter("}/>", "<Editor", fileContent);

  if (startIndex > -1 && endIndex > -1) {
    const resultString =
      fileContent.slice(0, startIndex) + fileContent.slice(endIndex + 3);

    return resultString;
  }
  return fileContent;
};

type ResultObject = {
  [key: number]: string | ResultObject;
};

type TraverseResult = [ResultObject, number | null];

async function traverseDir(dirPath: string): Promise<TraverseResult> {
  const result = {};
  let folderPosition = null;

  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const s = await traverseDir(fullPath);
      if (s && s[1] && s[0]) {
        result[s[1]] = s[0];
      }
    } else if (entry.isFile()) {
      if (entry.name.endsWith(".md")) {
        const content = await fs.promises.readFile(fullPath, "utf-8");
        const match = content.match(/sidebar_position:\s*(\d+)/);
        let pos = match ? parseInt(match[1], 10) : 1;

        result[pos] = fullPath;
      } else if (entry.name.endsWith(".json")) {
        const data = JSON.parse(await fs.promises.readFile(fullPath, "utf-8"));
        const pos = data.position || 1;
        folderPosition = pos;
      }
    }
  }

  return [result, folderPosition];
}
function removeSidebarPosition(frontMatterString: string): string {
  const pattern = /^---\n(?:[^-]*\n)?sidebar_position: \d+\n(?:[^-]*\n)?---\n/m;

  const result = frontMatterString.replace(pattern, "");
  return result;
}
const appendContentToFile = async (
  pathObj: ResultObject,
  fileName: string = "final.md"
): Promise<void> => {
  const sortedObjectKeysArr = Object.keys(pathObj).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  for (let index = 0; index < sortedObjectKeysArr.length; index++) {
    const key = sortedObjectKeysArr[index];
    if (pathObj[key]) {
      if (typeof pathObj[key] == "string") {
        fs.appendFileSync(fileName, `\n`, "utf-8");
        const cleanedString = removeSidebarPosition(
          fs.readFileSync(pathObj[key]).toString()
        );
        const stringWithEditorCodeRemoved = removingEditorComponentString({
          fileContent: cleanedString,
        });

        fs.appendFileSync(fileName, stringWithEditorCodeRemoved, "utf-8");
        fs.appendFileSync(fileName, `\n`, "utf-8");
      } else if (typeof pathObj[key] === "object") {
        appendContentToFile(pathObj[key], fileName);
      }
    }
  }
};

function replaceOccurrences(
  inputString: string,
  replacements: { [key: string]: string }
): string {
  // Iterate through each replacement object
  Object.entries(replacements).forEach(([key, value]) => {
    // Create a regular expression for the 'value' string with global flag and escape special characters
    const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex characters
    const regex = new RegExp(escapedValue, "g");
    // Replace occurrences of 'value' with 'key'
    inputString = inputString.replace(regex, key);
  });

  return inputString;
}
const replacesments: { [key: string]: string } = {
  text: "NANO.TEXT",
  view: "NANO.BUTTON",
  activity_indicator: "NANO.ACTIVITY_INDICATOR",
  avatar_icon: "NANO.AVATAR_ICON",
  avatar_image: "NANO.AVATAR_IMAGE",
  avatar_text: "NANO.AVATAR_TEXT",
  badge: "NANO.BADGE",
  checkbox: "NANO.CHECKBOX",
  chip: "NANO.CHIP",
  fab: "NANO.FAB",
  progress_bar: "NANO.PROGRESS_BAR",
  radio_button: "NANO.RADIO_BUTTON",
  switch: "NANO.SWITCH",
  text_input: "NANO.TEXT_INPUT",
  divider: "NANO.DIVIDER",
  search_bar: "NANO.SEARCH_BAR",
  segmented_buttons: "NANO.SEGMENTED_BUTTONS",
  icon_button: "NANO.ICON_BUTTON",
  helper_text: "NANO.HELPER_TEXT",
  card: "NANO.CARD",
  card_title: "NANO.CARD_TITLE",
  card_content: "NANO.CARD_CONTENT",
  card_cover: "NANO.CARD_COVER",
  card_action: "NANO.CARD_ACTION",
  dialog: "NANO.DIALOG",
  dialog_title: "NANO.DIALOG_TITLE",
  dialog_content: "NANO.DIALOG_CONTENT",
  dialog_scrollarea: "NANO.DIALOG_SCROLLAREA",
  dialog_action: "NANO.DIALOG_ACTION",
  tooltip: "NANO.TOOLTIP",
  scroll_view: "NANO.SCROLL_VIEW",
  appbar_action: "NANO.APPBAR_ACTION",
  appbar_content: "NANO.APPBAR_CONTENT",
  appbar_back_action: "NANO.APPBAR_BACK_ACTION",
  appbar_header: "NANO.APPBAR_HEADER",
  modal: "NANO.MODAL",
  video: "NANO.VIDEO",
  youtube_player: "NANO.YOUTUBE_PLAYER",
};
export const convertDocsToPdf = ({
  dirPath,
  resultPdfName = "final",
}: {
  dirPath: string;
  resultPdfName: string;
}): void => {
  const argv = yargs(hideBin(process.argv)).argv;
  const restArgs =
    argv["md-to-pdf-args"] != null ? argv["md-to-pdf-args"] : " ";

  traverseDir(dirPath)
    .then(async (result: TraverseResult) => {
      if (result && result[0]) {
        const resObj: ResultObject = result[0];
        if (resultPdfName.includes(".pdf")) {
          resultPdfName = resultPdfName.slice(0, -4);
        }
        appendContentToFile(resObj, resultPdfName + ".md");
        if (fs.existsSync(resultPdfName + ".md")) {
          if (argv["regex-pattern"] != null) {
            let fileContent = fs.readFileSync(resultPdfName + ".md").toString();
            const regex = new RegExp(
              argv["regex-pattern"],
              argv["regex-flag"] != null ? argv["regex-flag"] : ""
            );

            fileContent = fileContent.replace(regex, argv.replacement);

            fs.writeFileSync(
              resultPdfName + ".md",
              fileContent
            );
          }

          const result = runCommand(
            `npx md-to-pdf ${resultPdfName}.md ${restArgs}`
          );
          if (!result) process.exit(-1);
        }
      }
    })
    .catch((err) => console.error("Error traversing directory:", err));
};
