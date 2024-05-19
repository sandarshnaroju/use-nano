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