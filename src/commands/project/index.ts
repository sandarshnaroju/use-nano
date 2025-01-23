import {
  copyFile,
  existsSync,
  mkdirSync,
  readFile,
  unlinkSync,
  writeFile,
  writeFileSync,
} from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { runCommand } from "../../common.js";
import { commonUrl } from "../../constants.js";
import { downloadFileWithCallback } from "../../utilities.js";
import {
  createReactNativeProject,
  deleteDefaultAppTsAndBabelFiles,
  downloadNanoAppJsAndBabelFiles,
} from "../init/installations.js";

async function moveFiles({
  destFolder,
  filePaths,
}: {
  destFolder: string;
  filePaths: string[];
}): Promise<void> {
  // Ensure the destination folder exists
  if (!existsSync(destFolder)) {
    mkdirSync(destFolder);
  }

  // Iterate over each file path
  for (const filePath of filePaths) {
    const fileName: string = path.basename(filePath); // Get the file name from the path
    const destPath: string = path.join(destFolder, fileName); // Construct the destination file path

    try {
      // Move the file to the destination folder
      await moveFile({ source: filePath, destination: destPath });
      console.log(`Moved ${fileName} to ${destFolder}`);
    } catch (err) {
      console.error(`Failed to move ${fileName}:`, err);
    }
  }
}

interface MoveFileParams {
  source: string;
  destination: string;
}

async function moveFile({
  source,
  destination,
}: MoveFileParams): Promise<string> {
  await copyFile(source, destination, () => {});
  return "File copied successfully";
}

interface SetupAssetsParams {
  assetsObj: Record<string, string[] | null>; // Object with keys as strings and values as arrays of strings or null
  projectName: string;
}

const setupAssets = ({ assetsObj, projectName }: SetupAssetsParams): void => {
  let textToWrite: string = " assets: [ ";

  Object.keys(assetsObj).forEach((key) => {
    if (assetsObj[key] != null) {
      console.log(`Moving ${key} assets...`);
      mkdirSync(`${projectName}/src/assets/`, { recursive: true });
      mkdirSync(`${projectName}/src/assets/${key}`, { recursive: true });

      assetsObj[key]!.forEach((assetPath) => {
        moveFiles({
          destFolder: `${projectName}/src/assets/${key}`,
          filePaths: [assetPath],
        });
      });

      textToWrite += `\n"./src/assets/${key}",`;
      console.log(`Moved ${key} assets.`);
    }
  });

  textToWrite += `\n];`;

  try {
    // Write the content to the react-native.config.js file synchronously
    console.log("Creating react-native.config.js file...");
    writeFileSync(`${projectName}/react-native.config.js`, textToWrite, "utf8");
    console.log("File created successfully!");
  } catch (err) {
    console.error("Error writing file:", err);
  }
};
interface Screen {
  name: string;
  code: string;
}

interface Args {
  name: string;
  screens?: string;
  assets?: string;
  "app-icon"?: string;
  packages?: string;
  nanoversion?: string;
  reactNativeVers?: string;
}
interface SetupProjectWithScreensParams {
  args: Args;
  onFinish: () => void;
}
// const dummyScreensString = `IltcbiAgICB7XG4gICAgICAgIG5hbWU6XCJDb3VudFNjcmVlblwiXG4gICAgICAgIGNvZGU6IGBcbmNvbnN0IGNvdW50VGV4dCA9IHtcbiAgICBjb21wb25lbnQ6IFwidGV4dFwiLFxuICAgIG5hbWU6ICd0ZXh0JyxcbiAgICB2YWx1ZTogMSxcbiAgICBwcm9wczoge1xuICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgZm9udFNpemU6IDUwLFxuICAgICAgICAgICAgYWxpZ25TZWxmOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8vIGNyZWF0aW5nIGEgYnV0dG9uIGNvbXBvbmVudCB0byBjbGljayBhbmQgaW5jcmVhc2UgbnVtYmVycy5cbmNvbnN0IGluY3JlYXNlQ291bnRCdXR0b24gPSB7XG4gICAgY29tcG9uZW50OiBcImJ1dHRvblwiLFxuICAgIHZhbHVlOiAnQ0xJQ0sgTUUgVE8gSU5DUkVBU0UnLFxuICAgIG9uUHJlc3M6ICh7IHNldFVpLCBnZXRVaSB9KSA9PiB7XG5cbiAgICAgICAgLy8gaW5jcmVhc2UgY291bnQgYnkgMVxuICAgICAgICBjb25zdCB0ZXh0T2JqID0gZ2V0VWkoXCJ0ZXh0XCIpXG4gICAgICAgIHRleHRPYmoudmFsdWUgPSB0ZXh0T2JqLnZhbHVlICsgMVxuICAgICAgICBzZXRVaShcInRleHRcIiwgdGV4dE9iailcblxuICAgIH1cbn07XG5cbi8vIEZpbmFsbHkgYWRkaW5nIGJvdGggY29tcG9uZW50cyB0byBzY3JlZW4gd2l0aCB2MSh2ZXJ0aWNhbCkgdGFnLlxuY29uc3Qgc2NyZWVuID0ge1xuICAgIG5hbWU6ICdDb3VudFNjcmVlbicsXG4gICAgc2NyZWVuOiB7XG4gICAgICAgIHYxOiBbY291bnRUZXh0LCBpbmNyZWFzZUNvdW50QnV0dG9uXSxcbiAgICB9LFxuICAgIHByb3BzOiB7XG4gICAgICAgIHN0eWxlOiB7IGZsZXg6IDEsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyB9LFxuICAgIH1cbn07XG5gXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6XCJGZWVkU2NyZWVuXCJcbiAgICAgICAgY29kZTogYGNvbnN0IGZlZWRUZXh0ID0ge1xuICAgIG5hbWU6IFwiZmVlZF90ZXh0XCIsXG4gICAgY29tcG9uZW50OiBcInRleHRcIixcbiAgICB2YWx1ZTogJ1RoaXMgaXMgRmVlZCcsXG4gICAgcHJvcHM6IHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIGZvbnRTaXplOiAyNSxcbiAgICAgICAgICAgIGNvbG9yOiBcImJsYWNrXCJcbiAgICAgICAgfSxcbiAgICB9XG59O1xuXG5jb25zdCBzY3JlZW4gPSB7XG4gICAgbmFtZTogJ0ZlZWRTY3JlZW4nLFxuICAgIHNjcmVlbjoge1xuICAgICAgICB2MTogW2ZlZWRUZXh0XSxcbiAgICB9LFxuICAgIHByb3BzOiB7XG4gICAgICAgIHN0eWxlOiB7IGZsZXg6IDEsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgYWxpZ25JdGVtczogJ2NlbnRlcicgfSxcbiAgICAgICAgc2Nyb2xsOiBmYWxzZSxcbiAgICAgICAgc2Nyb2xsVmlld1Byb3BzOiB7fVxuICAgIH1cbn07XG5gXG4gICAgfSxcblxuXSI=
// `;
const setupProjectWithScreens = ({
  args,
  onFinish,
}: SetupProjectWithScreensParams): void => {
  const decodedStringifiedScreens = atob(args.screens);
  const decodedScreens: string = JSON.parse(decodedStringifiedScreens);
  // console.log(
  //   "decodedScreens",
  //   decodedScreens,
  //   typeof decodedScreens,
  //   decodedStringifiedScreens
  // );
  try {
    const parsedScreensArray: Screen[] = eval(decodedScreens);
    // console.log("parsedScreensArray", parsedScreensArray);
    if (typeof parsedScreensArray === "object" && parsedScreensArray !== null) {
      createReactNativeProject({
        repoName: args.name,
        nanoversion: args.nanoversion,
        reactNativeVers: args.reactNativeVers,
      });

      deleteDefaultAppTsAndBabelFiles({ repoName: args.name });

      mkdirSync(path.join(args.name, "/src/screens/"), { recursive: true });

      downloadNanoAppJsAndBabelFiles({
        onFinish: () => {
          let importString = "";
          parsedScreensArray.forEach((screenObj) => {
            writeFileSync(
              path.join(args.name, "/src/screens/", `${screenObj.name}.js`),
              `${screenObj.code}\nexport default screen;`
            );
            importString += `import ${screenObj.name} from './${screenObj.name}'\n`;
          });

          writeFileSync(
            path.join(args.name, "/src/screens/index.js"),
            `${importString}\nexport default [\n${parsedScreensArray
              .map((screenObj) => screenObj.name)
              .join(",\n")}\n]`
          );

          if (existsSync(path.join(args.name, "/App.js"))) {
            unlinkSync(path.join(args.name, "/App.js"));
          }

          downloadFileWithCallback(
            `${commonUrl}App.js`,
            path.join(args.name, "/App.js"),
            () => {
              // onFinish();
              return null;
            }
          );

          if (args["package-name"] != null) {
            const command = `cd ${args.name} && git init && npx react-native-rename@3.2.12 ${args.name} -b ${args["package-name"]} --skipGitStatusCheck `;
            runCommand(command);
          }

          onFinish();
        },
        repoName: args.name,
        reactNativeVers: args.reactNativeVers,
      });
    }
  } catch (error) {
    console.log("Invalid JSON string passed for screens", error);
  }
};

interface Dependencies {
  [key: string]: string; // key-value pair for dependency name and version
}

function updatePackageJsonDependencies(
  packageJsonPath: string,
  newDependencies: Dependencies
): void {
  // Step 1: Read the existing package.json file
  readFile(
    packageJsonPath,
    "utf8",
    (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        console.error("Error reading package.json:", err);
        return;
      }

      // Step 2: Parse the JSON data
      let packageJson: { dependencies?: Dependencies } = JSON.parse(data);

      // Step 3: Add new dependencies to the existing "dependencies"
      if (!packageJson.dependencies) {
        packageJson.dependencies = {};
      }

      // Merge the new dependencies with the existing ones
      packageJson.dependencies = {
        ...packageJson.dependencies,
        ...newDependencies,
      };

      // Step 4: Write the updated package.json back to the file
      writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf8",
        (err: NodeJS.ErrnoException | null) => {
          if (err) {
            console.error("Error writing to package.json:", err);
            return;
          }
          console.log("package.json updated successfully!");
        }
      );
    }
  );
}
interface SetupPackagesParams {
  packages: Dependencies; // The packages to add to the package.json dependencies
  projectName: string; // The name of the project (the path to the project folder)
}

const setupPackages = ({
  packages,
  projectName,
}: SetupPackagesParams): void => {
  const packageJsonPath = path.join(projectName, "package.json");
  updatePackageJsonDependencies(packageJsonPath, packages);
};

export const initProjectCommand = async (): Promise<void> => {
  const args: Args = yargs(hideBin(process.argv)).argv;

  if (args != null && args.screens != null && args.name != null) {
    setupProjectWithScreens({
      args,
      onFinish: () => {
        if (args.assets != null) {
          const decodedAssetsObject = JSON.parse(atob(args.assets));
          try {
            
            const parsedAssetsObject = JSON.parse(decodedAssetsObject);
            
            if (
              typeof parsedAssetsObject === "object" &&
              parsedAssetsObject !== null
            ) {
              setupAssets({
                assetsObj: parsedAssetsObject,
                projectName: args.name,
              });

              const command = `cd ${args.name} && npm install -g @callstack/react-native-asset && react-native-asset`;
              runCommand(command);
            }
          } catch (error) {
            console.log("Invalid JSON string passed for assets", error);
          }
        }

        if (args.packages != null) {
          const decodedPackages = atob(args.packages);
          const packages = JSON.parse(decodedPackages);

          try {
            const parsedObject = JSON.parse(packages);

            if (typeof parsedObject === "object" && parsedObject !== null) {
              setupPackages({ packages: parsedObject, projectName: args.name });
            }
          } catch (error) {
            console.log("Invalid JSON string passed for packages");
          }
        }
        if (args["app-icon"] != null) {
          const command = `cd ${args.name} && npx install -g icon-set-creator && iconset create ../${args["app-icon"]}`;
          // const command =`cd ${args.name} && npx icon-set-creator create ${args["app-icon"]}`;
          runCommand(command);
        }
        const command = `cd ${args.name} && rm -rf node_modules`;
        runCommand(command);
      },
    });
  }
};
