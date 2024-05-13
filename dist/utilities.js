import https from "https";
import * as fs from "fs";
export function downloadFileWithCallback(url, path, callback) {
    const file = fs.createWriteStream(path);
    https
        .get(url, function (response) {
        response.pipe(file);
        file.on("finish", function () {
            file.close(callback); // close() is async, call callback after close completes.
        });
    })
        .on("error", function (err) {
        // Handle errors
        fs.unlink(path, () => { }); // Delete the file async. (But we don't check the result)
        if (callback)
            callback(err.message);
    });
}
//# sourceMappingURL=utilities.js.map