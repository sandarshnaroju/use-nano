import { execSync } from "child_process";
import fs from "fs";
export const runCommand = (command) => {
    try {
        execSync(`${command}`);
    }
    catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
};
export const getNanoVersionAndReactNativeVersion = ({ firstArgCommand, firstArgValue, secondArgCommand, secondArgValue, }) => {
    // returns [nanoVersion, react native version]
    if (secondArgCommand != null && secondArgValue != null) {
        if (firstArgCommand == "nano-version" /* COMMAND_ARGUMENTS.NANO_VERSION */) {
            if (secondArgCommand == "react-native-version" /* COMMAND_ARGUMENTS.REACT_NATIVE_VERSION */) {
                // provided both
                return [firstArgValue, secondArgValue];
            }
            else {
                return [firstArgValue, null];
            }
        }
        else if (firstArgCommand == "react-native-version" /* COMMAND_ARGUMENTS.REACT_NATIVE_VERSION */) {
            if (secondArgCommand == "nano-version" /* COMMAND_ARGUMENTS.NANO_VERSION */) {
                return [secondArgValue, firstArgValue];
            }
            else {
                return [null, firstArgValue];
            }
        }
    }
    else {
        // only one param is given i.e first param
        if (firstArgCommand == "nano-version" /* COMMAND_ARGUMENTS.NANO_VERSION */) {
            // provided only nano version
            return [firstArgValue, null];
        }
        else if (firstArgCommand == "react-native-version" /* COMMAND_ARGUMENTS.REACT_NATIVE_VERSION */) {
            // provided only react native version
            return [null, firstArgValue];
        }
        else {
            // provided none
            return [null, null];
        }
    }
    return [null, null];
};
export const moveFile = ({ path, source, destination, }) => {
    let downloadAppjsCommand = "";
    if (path) {
        downloadAppjsCommand = `cd ${path} && mv ${source} ${destination}`;
    }
    else {
        downloadAppjsCommand = `mv ${source} ${destination}`;
    }
    const downloadresult = runCommand(downloadAppjsCommand);
    if (!downloadresult)
        process.exit(-1);
};
var KEYSTORE_ARGUMENTS;
(function (KEYSTORE_ARGUMENTS) {
    KEYSTORE_ARGUMENTS["PATH"] = "--keystore";
    KEYSTORE_ARGUMENTS["PASSWORD"] = "--keystorepassword";
})(KEYSTORE_ARGUMENTS || (KEYSTORE_ARGUMENTS = {}));
export const getKeystorePathAndPasswordArray = ({ firstArgCommand, firstArgValue, secondArgCommand, secondArgValue, }) => {
    // returns [keystorepath, password]
    if (secondArgCommand != null && secondArgValue != null) {
        if (firstArgCommand == KEYSTORE_ARGUMENTS.PATH) {
            if (secondArgCommand == KEYSTORE_ARGUMENTS.PASSWORD) {
                // provided both
                return [firstArgValue, secondArgValue];
            }
            else {
                return [firstArgValue, null];
            }
        }
        else if (firstArgCommand == KEYSTORE_ARGUMENTS.PASSWORD) {
            if (secondArgCommand == KEYSTORE_ARGUMENTS.PATH) {
                return [secondArgValue, firstArgValue];
            }
            else {
                return [null, firstArgValue];
            }
        }
    }
    else {
        // only one param is given i.e first param
        if (firstArgCommand == KEYSTORE_ARGUMENTS.PATH) {
            // provided only PATH
            return [firstArgValue, null];
        }
        else if (firstArgCommand == KEYSTORE_ARGUMENTS.PASSWORD) {
            // provided only password
            return [null, firstArgValue];
        }
        else {
            // provided none
            return [null, null];
        }
    }
    return [null, null];
};
export const moveFileByNode = (oldPath, newPath, callback) => {
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            if (err.code === "EXDEV") {
                copy();
            }
            else {
                callback();
            }
            return;
        }
        callback();
    });
    function copy() {
        var readStream = fs.createReadStream(oldPath);
        var writeStream = fs.createWriteStream(newPath);
        readStream.on("error", callback);
        writeStream.on("error", callback);
        readStream.on("close", function () {
            fs.unlink(oldPath, callback);
        });
        readStream.pipe(writeStream);
    }
};
//# sourceMappingURL=common.js.map