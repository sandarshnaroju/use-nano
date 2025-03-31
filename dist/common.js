import { execSync } from "child_process";
import https from "https";
import fs from "fs";
import { x } from "tar";
export const runCommand = (command) => {
    try {
        execSync(`${command}`, { stdio: "inherit" });
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
export const writeToFile = (text, filePath) => {
    try {
        fs.writeFileSync(filePath, text);
        console.log("File has been written successfully!");
    }
    catch (err) {
        console.error("Error writing to file:", err);
    }
};
export const downloadRepo = (packageName, destination) => {
    https.get(`https://registry.npmjs.org/${packageName}`, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
            const packageInfo = JSON.parse(data);
            const tarballUrl = packageInfo.dist.tarball;
            const file = fs.createWriteStream(`${packageName}.tgz`);
            https.get(tarballUrl, (res) => res.pipe(file));
            console.log(`Downloaded ${packageName}.tgz`);
            x({
                file: `${packageName}.tgz`,
                cwd: destination, // Optional: Extract into a specific folder
            })
                .then(() => console.log("Extraction complete!"))
                .catch((err) => console.error("Extraction error:", err));
        });
    });
};
//# sourceMappingURL=common.js.map