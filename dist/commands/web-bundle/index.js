import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { moveFileByNode, runCommand, writeToFile } from "../../common.js";
import { appendFileSync, mkdirSync, readFileSync, rmSync, writeFileSync, } from "fs";
import { COMMAND_ARGUMENTS } from "../../constants.js";
import { setUpANewMinimalProject } from "../init/installations.js";
import { appWebJs, babelConfigJs, babelRc, indexWebJs, tsConfigJson, webBundleDevDependencies, webIndexHtml, webPackConfig, } from "./constants.js";
import { addWebpackScripts, setupLibPackages } from "./webpack.js";
import { parseWithRegex } from "./utilities.js";
const addDevDependencies = (repoName) => {
    const packageJsonPath = path.join(repoName, "package.json");
    try {
        // Read the existing package.json
        const packageJsonData = readFileSync(packageJsonPath, "utf8");
        let packageJson = JSON.parse(packageJsonData);
        // Add or update the new scripts
        Object.assign(packageJson.devDependencies, webBundleDevDependencies);
        // Write the updated package.json back to the file
        console.log("Adding devDependencies to package.json...");
        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");
        console.log("devDependencies added to package.json successfully!");
        rmSync(path.join(repoName, "node_modules"), {
            recursive: true,
            force: true,
        });
        let devDependendiesInstallCommand = `cd ${repoName} && npm i `;
        runCommand(devDependendiesInstallCommand);
    }
    catch (err) {
        console.error("Error modifying package.json:", err);
    }
};
export const addPackagesAppUrlToNanoConfig = (repoName) => {
    const clientIdCommand = `\nexport const APP_URL = 'appurl'; \nexport const packages = [];`;
    appendFileSync(path.join(repoName, "nano.config.js"), clientIdCommand);
};
const rulesConfig = {
    libsconfig: [
        {
            path: "./libs/react-native-linear-gradient",
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(@react-native-firebase)/,
                    use: {
                        loader: "babel-loader",
                    },
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules\/(?!(react-native-animatable)\/).*/,
                    loader: "babel-loader",
                },
            ],
            alias: {
                "react-native-linear-gradient": "react-native-web-linear-gradient",
            },
            install: {
                packages: ["react-native-web-linear-gradient"],
            },
        },
    ],
};
export const createWebBundle = () => {
    const args = yargs(hideBin(process.argv)).argv;
    if (args && args.config) {
        const decoded = atob(args.config);
        const parsedConfig = parseWithRegex(decoded);
        const { libsconfig } = parsedConfig;
        // console.log("parsedConfig", parsedConfig["libsconfig"][1]['rules']);
        setUpANewMinimalProject({
            repoName: args.repoName,
            nanoversion: args[COMMAND_ARGUMENTS.NANO_VERSION],
            reactNativeVers: args[COMMAND_ARGUMENTS.REACT_NATIVE_VERSION],
            userArgs: args,
        });
        mkdirSync(`${args.repoName}/src`, { recursive: true });
        const downloadNanoRepoCommand = `cd ${args.repoName} && npx degit sandarshnaroju/react-native-nano src/react-native-nano`;
        runCommand(downloadNanoRepoCommand);
        const downloadNanoSyncRepoCommand = `cd ${args.repoName} && npx degit sandarshnaroju/rn-nano-sync src/rn-nano-sync`;
        runCommand(downloadNanoSyncRepoCommand);
        const webInstallCommand = `cd ${args.repoName} &&  npm i react-dom@18.2.0 react-native-web@0.18.12 core-js@2.5.4 --legacy-peer-deps`;
        runCommand(webInstallCommand);
        addDevDependencies(args.repoName);
        writeToFile(webPackConfig, path.join(args.repoName, "webpack.config.js"));
        writeToFile(appWebJs, path.join(args.repoName, "App.web.js"));
        writeToFile(indexWebJs, path.join(args.repoName, "index.web.js"));
        writeToFile(tsConfigJson, path.join(args.repoName, "tsconfig.json"));
        writeToFile(babelRc, path.join(args.repoName, ".babelrc"));
        mkdirSync(`${args.repoName}/web`, { recursive: true });
        writeToFile(webIndexHtml, path.join(args.repoName, "web/index.html"));
        addWebpackScripts(args.repoName);
        writeToFile(babelConfigJs, path.join(args.repoName, "babel.config.js"));
        addPackagesAppUrlToNanoConfig(args.repoName);
        setTimeout(() => {
            setupLibPackages(args, libsconfig);
            setTimeout(() => {
                const installnanoLocalRepoCommand = `cd ${args.repoName} && npm install src/react-native-nano/ --force `;
                runCommand(installnanoLocalRepoCommand);
                const installLocalRepoCommand = `cd ${args.repoName} && npm install src/rn-nano-sync/ --force`;
                runCommand(installLocalRepoCommand);
                setTimeout(() => {
                    const buildCommand = `cd ${args.repoName} && npm run build`;
                    console.log("Running Webpack...");
                    runCommand(buildCommand);
                    moveFileByNode(`${args.repoName}/web/dist/app.bundle.js`, `app.bundle.js`, () => {
                        console.log("File moved successfully!");
                        return null;
                    });
                }, 3000);
            }, 2000);
        }, 2000);
    }
};
//# sourceMappingURL=index.js.map