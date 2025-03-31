import path from "path";
import { runCommand } from "../../common.js";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolutionsObject, webpackScriptsObject } from "./constants.js";
import { addAliasToWebPack, addRulesInWebpack } from "./utilities.js";
const addResolutionsObject = (packageJson) => {
    packageJson["resolutions"] = resolutionsObject;
    return packageJson;
};
export const addWebpackScripts = (repoName) => {
    const packageJsonPath = path.join(repoName, "package.json");
    try {
        // Read the existing package.json
        const packageJsonData = readFileSync(packageJsonPath, "utf8");
        let packageJson = JSON.parse(packageJsonData);
        const newScripts = { ...packageJson.scripts, ...webpackScriptsObject };
        // Add or update the new scripts
        Object.assign(packageJson.scripts, newScripts);
        // Write the updated package.json back to the file
        packageJson = addResolutionsObject(packageJson);
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");
        console.log("Scripts added to package.json successfully!");
    }
    catch (err) {
        console.error("Error modifying package.json:", err);
    }
};
function addLineToTopOfFile(filePath, line) {
    // File path and new line to add
    const newLine = "This is the new first line\n";
    // Read the existing content of the file
    try {
        // Read the existing content of the file
        const data = readFileSync(filePath, "utf8");
        // Combine the new line with the existing content
        const updatedContent = line + data;
        // Write the updated content back to the file
        writeFileSync(filePath, updatedContent, "utf8");
    }
    catch (err) {
        console.error("Error:", err);
    }
}
function addObjectToExport(filePath, newName, newComponents = "null") {
    try {
        // Read the file content
        let content = readFileSync(filePath, "utf8");
        // Find the export default array and append the new object
        const arrayEndIndex = content.lastIndexOf("];");
        if (arrayEndIndex === -1) {
            throw new Error("Export default array not found");
        }
        // Construct the new object string
        const newObject = `  { name: '${newName}', components: ${newComponents} },\n`;
        // Insert the new object before the closing bracket
        const updatedContent = content.slice(0, arrayEndIndex) +
            newObject +
            content.slice(arrayEndIndex);
        // Write the updated content back to the file
        writeFileSync(filePath, updatedContent, "utf8");
    }
    catch (err) {
        console.error("Error:", err);
    }
}
function moveFolderSync(source, destination) {
    try {
        // Ensure the destination's parent directory exists
        const parentDir = path.dirname(destination);
        if (!existsSync(destination)) {
            mkdirSync(destination, { recursive: true });
        }
        // Move folder
        // renameSync(source, destination);
        cpSync(source, destination, { recursive: true });
    }
    catch (error) {
        console.error(`Error moving folder: ${error.message}`);
    }
}
export function setupLibPackages(args, libsconfig) {
    if (libsconfig && libsconfig.length > 0) {
        let importString = "";
        let exportObjectSring = "";
        const indexPath = path.join(`${args.repoName}/src/react-native-nano/src/libs/`, "index.ts");
        libsconfig.forEach((lib) => {
            const { path, rules, alias, install, name } = lib;
            const libPath = path;
            const libRules = rules;
            const libAlias = alias;
            const libInstall = install;
            moveFolderSync(`${path}`, `${args.repoName}/src/react-native-nano/src/libs/${name}/`);
            if (libAlias) {
                addAliasToWebPack(libAlias, args.repoName);
            }
            if (libRules) {
                addRulesInWebpack(libRules, args.repoName);
            }
            if (libInstall) {
                if (libInstall.packages && libInstall.packages.length > 0) {
                    runCommand(`cd ${args.repoName} && npm install ${libInstall.packages.join(" ")} --legacy-peer-deps`);
                }
                if (libInstall.devPackages && libInstall.devPackages.length > 0) {
                    runCommand(`cd ${args.repoName} && npm install --save-dev ${libInstall.devPackages.join(" ")} --legacy-peer-deps`);
                }
            }
            if (name) {
                const importName = name.replace(/[^a-zA-Z]/g, "");
                importString += `import ${importName} from './${name}/config';\n`;
                exportObjectSring += `{name: '${name}',components:${importName}.components },\n`;
                addObjectToExport(indexPath, name, `${importName}.components`);
            }
        });
        addLineToTopOfFile(indexPath, importString);
    }
}
//# sourceMappingURL=webpack.js.map