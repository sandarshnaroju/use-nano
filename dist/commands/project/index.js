import { copyFile, existsSync, mkdirSync, readFile, unlinkSync, writeFile, writeFileSync, } from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { runCommand } from "../../common.js";
import { commonUrl } from "../../constants.js";
import { downloadFileWithCallback } from "../../utilities.js";
import { createReactNativeProject, deleteDefaultAppTsAndBabelFiles, downloadNanoAppJsAndBabelFiles, } from "../init/installations.js";
async function moveFiles({ destFolder, filePaths, }) {
    // Ensure the destination folder exists
    if (!existsSync(destFolder)) {
        mkdirSync(destFolder);
    }
    // Iterate over each file path
    for (const filePath of filePaths) {
        const fileName = path.basename(filePath); // Get the file name from the path
        const destPath = path.join(destFolder, fileName); // Construct the destination file path
        try {
            // Move the file to the destination folder
            await moveFile({ source: filePath, destination: destPath });
            console.log(`Moved ${fileName} to ${destFolder}`);
        }
        catch (err) {
            console.error(`Failed to move ${fileName}:`, err);
        }
    }
}
async function moveFile({ source, destination, }) {
    await copyFile(source, destination, () => { });
    return "File copied successfully";
}
const setupAssets = ({ assetsObj, projectName }) => {
    let textToWrite = " assets: [ ";
    Object.keys(assetsObj).forEach((key) => {
        if (assetsObj[key] != null) {
            console.log(`Moving ${key} assets...`);
            mkdirSync(`${projectName}/src/assets/`, { recursive: true });
            mkdirSync(`${projectName}/src/assets/${key}`, { recursive: true });
            assetsObj[key].forEach((assetPath) => {
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
    }
    catch (err) {
        console.error("Error writing file:", err);
    }
};
const setupProjectWithScreens = ({ args, onFinish, }) => {
    const decodedStringifiedScreens = atob(args.screens);
    const decodedScreens = JSON.parse(decodedStringifiedScreens);
    try {
        const parsedScreensArray = eval(decodedScreens);
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
                        writeFileSync(path.join(args.name, "/src/screens/", `${screenObj.name}.js`), `${screenObj.code}\nexport default screen;`);
                        importString += `import ${screenObj.name} from './${screenObj.name}'\n`;
                    });
                    writeFileSync(path.join(args.name, "/src/screens/index.js"), `${importString}\nexport default [\n${parsedScreensArray
                        .map((screenObj) => screenObj.name)
                        .join(",\n")}\n]`);
                    if (existsSync(path.join(args.name, "/App.js"))) {
                        unlinkSync(path.join(args.name, "/App.js"));
                    }
                    downloadFileWithCallback(`${commonUrl}App.js`, path.join(args.name, "/App.js"), () => {
                        // onFinish();
                        return null;
                    });
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
    }
    catch (error) {
        console.log("Invalid JSON string passed for screens", error);
    }
};
function updatePackageJsonDependencies(packageJsonPath, newDependencies) {
    // Step 1: Read the existing package.json file
    readFile(packageJsonPath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading package.json:", err);
            return;
        }
        // Step 2: Parse the JSON data
        let packageJson = JSON.parse(data);
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
        writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8", (err) => {
            if (err) {
                console.error("Error writing to package.json:", err);
                return;
            }
            console.log("package.json updated successfully!");
        });
    });
}
const setupPackages = ({ packages, projectName, }) => {
    const packageJsonPath = path.join(projectName, "package.json");
    updatePackageJsonDependencies(packageJsonPath, packages);
};
export const initProjectCommand = async () => {
    const args = yargs(hideBin(process.argv)).argv;
    if (args != null && args.screens != null && args.name != null) {
        setupProjectWithScreens({
            args,
            onFinish: () => {
                if (args.assets != null) {
                    const decodedAssetsObject = JSON.parse(atob(args.assets));
                    try {
                        const parsedAssetsObject = JSON.parse(decodedAssetsObject);
                        if (typeof parsedAssetsObject === "object" &&
                            parsedAssetsObject !== null) {
                            setupAssets({
                                assetsObj: parsedAssetsObject,
                                projectName: args.name,
                            });
                            const command = `cd ${args.name} && npm install -g @callstack/react-native-asset && react-native-asset`;
                            runCommand(command);
                        }
                    }
                    catch (error) {
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
                    }
                    catch (error) {
                        console.log("Invalid JSON string passed for packages");
                    }
                }
                const command = `cd ${args.name} && rm -rf node_modules`;
                runCommand(command);
            },
        });
    }
};
//# sourceMappingURL=index.js.map